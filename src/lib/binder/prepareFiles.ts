// Rules for files that go into the case binder, and the browser-side preparation of pictures
// before they are put into a binder PDF.
//
// This file stays light (no pdf-lib) because the binder page and its uploader import it. The
// binder builder (exportBinder.ts) imports the pure parts too, so node tests can run them.

/** Largest file the binder uploader accepts: 25 MB (26,214,400 bytes). */
export const BINDER_MAX_FILE_BYTES = 25 * 1024 * 1024;

/** The uploader's accept list. The bytes are checked as well (detectFileKind). */
export const BINDER_FILE_ACCEPT = "application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png";

/** Upload copy. Must match BINDER_MAX_FILE_BYTES and detectFileKind. */
export const BINDER_FILE_RULES = "PDF, JPG or PNG, up to 25 MB each";

/** Most file data one binder PDF may be built from, so the build fits in a phone's memory. */
export const BINDER_MAX_INPUT_BYTES = 120 * 1024 * 1024;

/** Most document pages one binder PDF may hold. */
export const BINDER_MAX_PAGES = 1500;

/** Pictures are re-encoded to JPEG with their long edge at most this many pixels (8.5 in at 300 dpi). */
export const IMAGE_MAX_EDGE = 2550;
export const IMAGE_JPEG_QUALITY = 0.85;

/** Shown at first upload and before making a binder (dismissible). Wording reviewed for CA/NY confidentiality rules. */
export const CONFIDENTIAL_RECORDS_NOTICE =
  "Some court papers are confidential. For example, California juvenile court records and New York Family Court records have legal limits on who may see them, and California juvenile records may not be attached to other documents without a judge's permission. Sealed records have limits too. Your binder is private to your account, but before you upload, print, share or hand in a binder that includes confidential or sealed papers, check with the court clerk or a lawyer.";

export type BinderFileKind = "pdf" | "jpeg" | "png";

export const KIND_MIME: Record<BinderFileKind, string> = {
  pdf: "application/pdf",
  jpeg: "image/jpeg",
  png: "image/png",
};

export const KIND_EXTENSION: Record<BinderFileKind, string> = {
  pdf: ".pdf",
  jpeg: ".jpg",
  png: ".png",
};

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const PDF_MARKER = [0x25, 0x50, 0x44, 0x46, 0x2d]; // "%PDF-"
/** PDF readers accept the "%PDF-" header anywhere in the first 1024 bytes. */
const PDF_HEADER_WINDOW = 1024;

/**
 * What a file really is, from its first bytes (never from its name or the type the browser
 * reports). Pass at least the first 1024 bytes. Returns null for anything that is not a PDF, JPEG
 * or PNG.
 */
export function detectFileKind(head: Uint8Array): BinderFileKind | null {
  if (head.length >= 8 && PNG_SIGNATURE.every((b, i) => head[i] === b)) return "png";
  if (head.length >= 3 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return "jpeg";
  const end = Math.min(head.length, PDF_HEADER_WINDOW) - PDF_MARKER.length;
  for (let i = 0; i <= end; i++) {
    let match = true;
    for (let j = 0; j < PDF_MARKER.length; j++) {
      if (head[i + j] !== PDF_MARKER[j]) {
        match = false;
        break;
      }
    }
    if (match) return "pdf";
  }
  return null;
}

/** The first bytes of a file or blob (1024 by default), for detectFileKind. */
export async function readHead(blob: Blob, length = PDF_HEADER_WINDOW): Promise<Uint8Array> {
  return new Uint8Array(await blob.slice(0, length).arrayBuffer());
}

/** True when the name looks like an iPhone HEIC/HEIF photo (the most common reason a photo is refused). */
export function looksLikeHeic(name: string, type: string): boolean {
  return /\.(heic|heif)$/i.test(name) || /^image\/hei[cf]/i.test(type);
}

/**
 * Whether a stored file could be a PDF, JPG or PNG, judged from its saved type and name, so the
 * binder does not download Word, text or web-page files it can never use. The bytes are still
 * checked after download.
 */
export function mayBeBinderFile(fileType: string | null | undefined, fileName: string | null | undefined): boolean {
  const type = (fileType ?? "").toLowerCase().trim();
  if (type === "application/pdf" || type === "image/jpeg" || type === "image/jpg" || type === "image/png") return true;
  const byName = /\.(pdf|jpe?g|png)$/i.test(fileName ?? "");
  if (!type || type === "application/octet-stream" || type === "binary/octet-stream") return byName;
  return false;
}

// ---------------------------------------------------------------------------------------------
// Browser-only: pictures are redrawn so phone photos come out the right way up and smaller.
// ---------------------------------------------------------------------------------------------

interface Decoded {
  source: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
}

async function decodeImage(blob: Blob): Promise<Decoded> {
  if (typeof createImageBitmap === "function") {
    try {
      // 'from-image' applies the photo's EXIF orientation, so an upright phone photo stays upright.
      const bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() };
    } catch {
      // Fall through to <img>, which also applies EXIF orientation in current browsers.
    }
  }
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, release: () => URL.revokeObjectURL(url) };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
}

/**
 * Redraws a JPG or PNG as a JPEG: the right way up (EXIF orientation applied), long edge at most
 * IMAGE_MAX_EDGE pixels, transparent areas white. Returns null if the browser can't do it (the
 * binder then uses the original bytes).
 */
export async function reencodeImage(blob: Blob): Promise<Uint8Array | null> {
  if (typeof document === "undefined") return null;
  let decoded: Decoded | null = null;
  const canvas = document.createElement("canvas");
  try {
    decoded = await decodeImage(blob);
    const { width, height } = decoded;
    if (!width || !height) return null;
    const scale = Math.min(1, IMAGE_MAX_EDGE / Math.max(width, height));
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(decoded.source, 0, 0, canvas.width, canvas.height);
    const out = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", IMAGE_JPEG_QUALITY));
    if (!out) return null;
    return new Uint8Array(await out.arrayBuffer());
  } catch {
    return null;
  } finally {
    decoded?.release();
    // Free the canvas memory straight away (matters on iPhones).
    canvas.width = 0;
    canvas.height = 0;
  }
}

/**
 * Bytes ready for buildBinderPdf: pictures are redrawn (reencodeImage), PDFs and anything else are
 * passed through unchanged (the builder checks the bytes again and lists anything it can't use).
 */
export async function prepareFileForBinder(blob: Blob): Promise<Uint8Array> {
  const kind = detectFileKind(await readHead(blob));
  if (kind === "jpeg" || kind === "png") {
    const redrawn = await reencodeImage(blob);
    if (redrawn) return redrawn;
  }
  return new Uint8Array(await blob.arrayBuffer());
}
