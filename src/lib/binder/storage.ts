// Upload, open, download and delete for binder files (case_files rows and their stored objects).
//
// Storage rules (engineering review):
// - New files go to evidence-files at `${uid}/${random uuid}/${asciiSafeName}` with upsert off,
//   so two uploads never overwrite each other and the path never has to move.
// - If saving the row fails after an upload, the uploaded object is removed again.
// - Signed links are made only when the person taps View or Download, and last 10 minutes.
// - Delete order: remove the stored object, confirm it is gone (or was already gone), then delete
//   the row. If the object is still there, the row stays and the person is told.
// - Rows whose file_path starts with http are saved links, not stored files.
//
// Privacy: nothing here logs, and no file names or notes go to analytics.

import { supabase } from "@/integrations/supabase/client";
import { ToolkitApiError, deleteCaseFileRow, insertCaseFile, toToolkitError } from "@/lib/toolkit/api";
import type { CaseFileRow } from "@/lib/toolkit/types";
import { BINDER_MAX_FILE_BYTES, KIND_EXTENSION, KIND_MIME, detectFileKind, looksLikeHeic, readHead, type BinderFileKind } from "./prepareFiles";

/** Where the binder uploader stores new files. */
export const BINDER_BUCKET = "evidence-files";

/** Buckets case_files rows may point at. */
const KNOWN_BUCKETS = new Set(["evidence-files", "user-uploads", "case-documents"]);

/** Signed links for View and Download last this long. */
export const SIGNED_URL_SECONDS = 600;

/** Storage accepts at most 1000 paths per remove call; stay well under it. */
const REMOVE_BATCH = 500;

type FileRef = Pick<CaseFileRow, "id" | "file_path" | "bucket_name">;

/** A saved link to a file stored somewhere else (Google Drive and the like), not a stored file. */
export function isLinkRow(row: Pick<CaseFileRow, "file_path">): boolean {
  return /^https?:\/\//i.test(row.file_path ?? "");
}

/** A file stored in one of the app's buckets, so it can be opened, downloaded and put in a binder. */
export function isStoredFile(row: Pick<CaseFileRow, "file_path" | "bucket_name">): boolean {
  return !isLinkRow(row) && KNOWN_BUCKETS.has(row.bucket_name) && Boolean(row.file_path);
}

/** What the person calls the file: their display name, or the original file name. */
export function fileLabel(row: Pick<CaseFileRow, "display_name" | "file_name">): string {
  return row.display_name?.trim() || row.file_name || "Untitled file";
}

const COMBINING_MARKS = /[̀-ͯ]/g;

function extensionOf(name: string): string {
  const m = /(\.[A-Za-z0-9]{1,5})$/.exec(name.trim());
  return m ? m[1] : "";
}

/**
 * A storage-safe ASCII file name for a new upload: accents dropped, anything but letters, digits,
 * dot, dash and underscore replaced, at most 100 characters, ending in the extension of what the
 * file really is.
 */
export function asciiSafeName(original: string, kind: BinderFileKind): string {
  const ext = KIND_EXTENSION[kind];
  const base = original
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .replace(/\.[A-Za-z0-9]{1,5}$/, "")
    .replace(/[^A-Za-z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^[._]+|[._]+$/g, "")
    .slice(0, 100 - ext.length);
  return `${base || "file"}${ext}`;
}

/**
 * The file name a download is saved under: the person's display name made safe for a link
 * (Storage puts it in the URL, where &, # and + would cut it short or change it), at most 100
 * characters, with the original file's extension added if missing.
 */
export function downloadName(display: string | null | undefined, original: string | null | undefined): string {
  const originalName = (original ?? "").trim();
  const ext = extensionOf(originalName);
  const clean = (value: string) =>
    value
      .normalize("NFKD")
      .replace(COMBINING_MARKS, "")
      .replace(/[^\w .()-]/g, "_")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 100)
      .trim();
  let name = clean(display ?? "") || clean(originalName) || "file";
  if (ext && !name.toLowerCase().endsWith(ext.toLowerCase())) name += ext;
  return name;
}

function randomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// ---------------------------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------------------------

export type UploadProblem = "too_big" | "empty" | "heic" | "wrong_type" | "upload_failed" | "save_failed" | "signed_out";

export const UPLOAD_PROBLEM_MESSAGES: Record<UploadProblem, string> = {
  too_big: "This file is larger than 25 MB, so it wasn't uploaded.",
  empty: "This file is empty, so it wasn't uploaded.",
  heic: "This is an iPhone HEIC photo. Share it as a JPG, or take a screenshot of it, and upload that.",
  wrong_type: "This isn't a PDF, JPG or PNG file, so it wasn't uploaded.",
  upload_failed: "The upload didn't finish. Check your connection and try again.",
  save_failed: "The file couldn't be saved to your binder. Please try again.",
  signed_out: "Please sign in again, then try the upload again.",
};

export class BinderUploadError extends Error {
  readonly problem: UploadProblem;
  constructor(problem: UploadProblem) {
    super(UPLOAD_PROBLEM_MESSAGES[problem]);
    this.name = "BinderUploadError";
    this.problem = problem;
  }
}

/** Checks size and the real file type before anything is uploaded. Returns the type, or throws BinderUploadError. */
export async function checkBinderUpload(file: File): Promise<BinderFileKind> {
  if (file.size === 0) throw new BinderUploadError("empty");
  if (file.size > BINDER_MAX_FILE_BYTES) throw new BinderUploadError("too_big");
  const kind = detectFileKind(await readHead(file));
  if (!kind) throw new BinderUploadError(looksLikeHeic(file.name, file.type) ? "heic" : "wrong_type");
  return kind;
}

/**
 * Uploads one PDF, JPG or PNG to the person's binder and saves its row. Uploading is free for
 * everyone. Throws BinderUploadError.
 */
export async function uploadBinderFile(opts: { userId: string; file: File; caseId: string | null }): Promise<CaseFileRow> {
  const { userId, file, caseId } = opts;
  const kind = await checkBinderUpload(file);
  const safeName = asciiSafeName(file.name, kind);
  const path = `${userId}/${randomId()}/${safeName}`;
  // Send the checked type, not whatever the browser guessed (some phones send none).
  const body = new File([file], safeName, { type: KIND_MIME[kind] });

  const { error: uploadError } = await supabase.storage
    .from(BINDER_BUCKET)
    .upload(path, body, { upsert: false, cacheControl: "3600", contentType: KIND_MIME[kind] });
  if (uploadError) {
    const e = uploadError as { status?: number; statusCode?: string | number };
    const status = Number(e.status ?? e.statusCode ?? 0);
    throw new BinderUploadError(status === 401 ? "signed_out" : "upload_failed");
  }

  try {
    return await insertCaseFile(userId, {
      file_name: file.name || safeName,
      file_path: path,
      file_type: KIND_MIME[kind],
      file_size: file.size,
      bucket_name: BINDER_BUCKET,
      case_id: caseId,
    });
  } catch (err) {
    // Don't leave a stored file with no row: nobody could see or delete it.
    await supabase.storage.from(BINDER_BUCKET).remove([path]).catch(() => undefined);
    throw new BinderUploadError(toToolkitError(err).kind === "signed_out" ? "signed_out" : "save_failed");
  }
}

// ---------------------------------------------------------------------------------------------
// Open, download and read
// ---------------------------------------------------------------------------------------------

function requireStored(row: Pick<CaseFileRow, "file_path" | "bucket_name">) {
  if (!isStoredFile(row)) throw new ToolkitApiError("not_found");
}

/** A 10-minute link that opens the file in the browser. Make it when the person taps View. */
export async function signedViewUrl(row: Pick<CaseFileRow, "file_path" | "bucket_name">): Promise<string> {
  requireStored(row);
  const { data, error } = await supabase.storage.from(row.bucket_name).createSignedUrl(row.file_path, SIGNED_URL_SECONDS);
  if (error || !data?.signedUrl) throw toToolkitError(error ?? {});
  return data.signedUrl;
}

/** A 10-minute link that saves the file under its display name. Make it when the person taps Download. */
export async function signedDownloadUrl(
  row: Pick<CaseFileRow, "file_path" | "bucket_name" | "display_name" | "file_name">,
): Promise<string> {
  requireStored(row);
  const { data, error } = await supabase.storage
    .from(row.bucket_name)
    .createSignedUrl(row.file_path, SIGNED_URL_SECONDS, { download: downloadName(row.display_name, row.file_name) });
  if (error || !data?.signedUrl) throw toToolkitError(error ?? {});
  return data.signedUrl;
}

/** The file's contents (for building a binder). */
export async function downloadFileBlob(row: Pick<CaseFileRow, "file_path" | "bucket_name">): Promise<Blob> {
  requireStored(row);
  const { data, error } = await supabase.storage.from(row.bucket_name).download(row.file_path);
  if (error || !data) throw toToolkitError(error ?? {});
  return data;
}

// ---------------------------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------------------------

function splitPath(path: string): { folder: string; name: string } {
  const at = path.lastIndexOf("/");
  return at < 0 ? { folder: "", name: path } : { folder: path.slice(0, at), name: path.slice(at + 1) };
}

/** Removes objects and returns the paths Storage reports as removed. Throws if the request fails. */
async function removeObjects(bucket: string, paths: string[]): Promise<Set<string>> {
  const removed = new Set<string>();
  for (let i = 0; i < paths.length; i += REMOVE_BATCH) {
    const batch = paths.slice(i, i + REMOVE_BATCH);
    const { data, error } = await supabase.storage.from(bucket).remove(batch);
    if (error) throw toToolkitError(error);
    for (const obj of data ?? []) if (obj?.name) removed.add(obj.name);
  }
  return removed;
}

/** true = still stored, false = gone, null = couldn't tell. */
async function objectExists(bucket: string, path: string): Promise<boolean | null> {
  const { folder, name } = splitPath(path);
  const { data, error } = await supabase.storage.from(bucket).list(folder, { search: name, limit: 100 });
  if (error) return null;
  return (data ?? []).some((o) => o.name === name && o.id !== null);
}

export type DeleteOutcome = "deleted" | "stored_copy_remains";

/**
 * Deletes one file: the stored object first, then (once it is confirmed gone) the row. Returns
 * "stored_copy_remains" when the object could not be removed, in which case the row is kept so the
 * person can try again. Throws ToolkitApiError if a request fails. Deleting is free for everyone.
 */
export async function deleteBinderFile(row: FileRef): Promise<DeleteOutcome> {
  if (isStoredFile(row)) {
    const removed = await removeObjects(row.bucket_name, [row.file_path]);
    if (!removed.has(row.file_path)) {
      const exists = await objectExists(row.bucket_name, row.file_path);
      if (exists !== false) return "stored_copy_remains";
    }
  }
  await deleteCaseFileRow(row.id);
  return "deleted";
}

export interface DeleteAllResult {
  deleted: number;
  /** Rows that are still there (their stored copy couldn't be removed, or the row delete failed). */
  remaining: number;
}

/** Lists every object path under a folder, one level of subfolders at a time, up to `depth` levels. */
async function listObjectPaths(bucket: string, folder: string, depth: number): Promise<string[]> {
  const paths: string[] = [];
  const PAGE = 100;
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await supabase.storage.from(bucket).list(folder, { limit: PAGE, offset });
    if (error || !data) break;
    for (const item of data) {
      const full = `${folder}/${item.name}`;
      if (item.id) paths.push(full);
      else if (depth > 1) paths.push(...(await listObjectPaths(bucket, full, depth - 1)));
    }
    if (data.length < PAGE) break;
  }
  return paths;
}

/**
 * "Delete all my files": removes every file in the person's binder (all cases), then any stored
 * copies left under their own folder in evidence-files with no row (from older upload screens).
 * Rows are only deleted once their stored copy is confirmed gone.
 */
export async function deleteAllBinderFiles(
  userId: string,
  rows: CaseFileRow[],
  onProgress?: (done: number, total: number) => void,
): Promise<DeleteAllResult> {
  const total = rows.length;
  let done = 0;
  const report = () => onProgress?.(done, total);
  report();

  // 1. Stored objects, bucket by bucket.
  const rowsToDelete: string[] = [];
  const kept = new Set<string>();
  const byBucket = new Map<string, CaseFileRow[]>();
  for (const row of rows) {
    if (isStoredFile(row)) byBucket.set(row.bucket_name, [...(byBucket.get(row.bucket_name) ?? []), row]);
    else rowsToDelete.push(row.id);
  }
  for (const [bucket, bucketRows] of byBucket) {
    let removed = new Set<string>();
    try {
      removed = await removeObjects(bucket, bucketRows.map((r) => r.file_path));
    } catch {
      // Fall through: each object is checked below.
    }
    for (const row of bucketRows) {
      if (removed.has(row.file_path) || (await objectExists(bucket, row.file_path)) === false) rowsToDelete.push(row.id);
      else {
        kept.add(row.file_path);
        done += 1;
        report();
      }
    }
  }

  // 2. Rows whose stored copy is gone.
  let deleted = 0;
  for (let i = 0; i < rowsToDelete.length; i += 100) {
    const batch = rowsToDelete.slice(i, i + 100);
    const { data, error } = await supabase.from("case_files").delete().in("id", batch).select("id");
    if (!error) deleted += data?.length ?? 0;
    done += batch.length;
    report();
  }

  // 3. Leftover stored copies with no row, under the person's own folder. Paths of any rows that
  //    still exist (including one uploaded meanwhile in another tab) are left alone.
  try {
    const { data: current, error } = await supabase.from("case_files").select("file_path").eq("user_id", userId);
    if (!error) {
      for (const r of current ?? []) kept.add(r.file_path);
      const leftovers = (await listObjectPaths(BINDER_BUCKET, userId, 3)).filter((p) => !kept.has(p));
      if (leftovers.length) await removeObjects(BINDER_BUCKET, leftovers);
    }
  } catch {
    // Best effort; the person's listed files are already handled above.
  }

  return { deleted, remaining: total - deleted };
}
