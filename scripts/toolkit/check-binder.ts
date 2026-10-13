// Case binder checks (engineering review important #11, item 4; addendum items 3-5). Builds real
// binders with src/lib/binder/exportBinder.ts from fixtures made right here, then reads the PDFs
// back with pdf-lib and a small content-stream reader. Nothing outside node_modules is needed;
// if poppler's pdftotext is installed it is used for one extra cross-check.
//
// Fixtures: 30 PDFs with distinct page heights (700 + i) so every page can be identified; A4,
// Legal, /Rotate 90 and non-zero crop box pages; a page with a link; a real court form filled by
// src/lib/formfill (fields not flattened); a JPEG with EXIF orientation 6; a PNG with
// transparency; an owner-password PDF made with pypdf (embedded below, it opens in any viewer but
// pdf-lib refuses it); broken PDF, PNG and JPG files; an HTML file; an empty file; a failed
// download; a saved link; and 40 Word files.
//
// Checked: no throw; files in order; every left-out file printed on the "Not included" pages with
// its reason; contents rows point at the right start pages; each start page holds its document;
// "Page N of M" on every page, in the bottom band of the page as shown (rotation and crop box
// respected), never over the document; links and filled form values move exactly with the page;
// "No page numbers" leaves pages unscaled; page limit, stop and empty binders; no court labels.
//
// Run with `npm run check:toolkit` (or `node scripts/toolkit/run-checks.mjs binder`).

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { deflateSync } from "node:zlib";
import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFRawStream,
  PDFRef,
  PDFString,
  StandardFonts,
  decodePDFRawStream,
  degrees,
  type PDFPage,
} from "pdf-lib";
import {
  CONFIDENTIAL_RECORDS_NOTICE as NOTICE_FROM_BINDER,
  EXCLUDED_REASONS,
  PAGE_NUMBER_SCALE,
  SECTION_LABELS as BINDER_SECTION_LABELS,
  buildBinderPdf,
  tocPageCount,
  type BinderResult,
  type BinderSourceFile,
} from "@/lib/binder/exportBinder";
import { CONFIDENTIAL_RECORDS_NOTICE, detectFileKind, mayBeBinderFile } from "@/lib/binder/prepareFiles";
import { SECTION_LABELS } from "@/lib/toolkit/types";
import { fillPdf } from "@/lib/formfill/fill";
import { CA_FILLABLE } from "@/lib/formfill/ca";
import { createHarness, repoRoot, run } from "./harness";

const t = createHarness("check-binder");
const s = PAGE_NUMBER_SCALE;
const enc = new TextEncoder();

// ---------------------------------------------------------------------------------------------
// Fixtures that pdf-lib can't make (generated once with python3 pypdf and Pillow)
// ---------------------------------------------------------------------------------------------

/** A one-page PDF with an owner password only (pypdf, AES-128). Viewers open it; pdf-lib refuses it. */
const SECURED_PDF_B64 =
  "JVBERi0xLjMKJeLjz9MKMSAwIG9iago8PAovUHJvZHVjZXIgPDI4NWUzMmI5NjFlZTViNTVlYzUyYzQwZGYwOWQ2N2E1NjMwZjRlZTI1YzlkZjEyMTc2ZDRhZmQ0ZjAwYTQ2MDM+Cj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovQ291bnQgMQovS2lkcyBbIDQgMCBSIF0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9SZXNvdXJjZXMgPDwKPj4KL01lZGlhQm94IFsgMC4wIDAuMCA2MTIgNzkyIF0KL1BhcmVudCAyIDAgUgo+PgplbmRvYmoKNSAwIG9iago8PAovViA0Ci9SIDQKL0xlbmd0aCAxMjgKL1AgNDI5NDk2NzI5MgovRmlsdGVyIC9TdGFuZGFyZAovTyA8OTEzYjA3M2Y1YjY1OTU0YzhiNmRhMjIxNjk5NzFhMTc3YjdlNmQ5NGExMDZmZjc1YzBjMTYyOTZiYzE1NDEyZT4KL1UgPGQ1NTJhN2QxNDhkYTVjOTg0OGNjZmI3MDViMzUxMTZlMjhiZjRlNWU0ZTc1OGE0MTY0MDA0ZTU2ZmZmYTAxMDg+Ci9DRiA8PAovU3RkQ0YgPDwKL0F1dGhFdmVudCAvRG9jT3BlbgovQ0ZNIC9BRVNWMgovTGVuZ3RoIDE2Cj4+Cj4+Ci9TdG1GIC9TdGRDRgovU3RyRiAvU3RkQ0YKPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMTEzIDAwMDAwIG4gCjAwMDAwMDAxNzIgMDAwMDAgbiAKMDAwMDAwMDIyMSAwMDAwMCBuIAowMDAwMDAwMzE1IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAzIDAgUgovSW5mbyAxIDAgUgovSUQgWyA8MzU2MTMxMzI2MjM3NjQzNzM4MzU2MTM2NjQzNTM1MzczNTM2Mzk2MjYyMzczMDY0MzIzNDMyMzI2MTM3MzAzOT4gPDM1NjEzMTMyNjIzNzY0MzczODM1NjEzNjY0MzUzNTM3MzUzNjM5NjI2MjM3MzA2NDMyMzQzMjMyNjEzNzMwMzk+IF0KL0VuY3J5cHQgNSAwIFIKPj4Kc3RhcnR4cmVmCjYyMgolJUVPRgo=";

/** A 48 x 32 JPEG whose EXIF says "rotate 90 degrees to display" (orientation 6), like a phone photo. */
const EXIF6_JPEG_B64 =
  "/9j/4AAQSkZJRgABAQAAAQABAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAAgADADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDdd/EGq+LNasbDXv7Pt7DyNifY45c748nk4PUH161a/sTxX/0OX/lMi/xo0H/ke/Ff/bn/AOijXT0Acx/Yniv/AKHL/wApkX+NH9ieK/8Aocv/ACmRf4109FAHMf2J4r/6HL/ymRf41VR/EGleLNFsb/Xv7Qt7/wA/en2OOLGyPI5GT1I9OldjXMa9/wAj34U/7fP/AEUKADQf+R78V/8Abn/6KNdPXHOniDSvFmtX1hoP9oW9/wCRsf7ZHFjZHg8HJ6k+nSrX9t+K/wDoTf8Aypxf4UAdPRXMf234r/6E3/ypxf4Uf234r/6E3/ypxf4UAdPXMa9/yPfhT/t8/wDRQo/tvxX/ANCb/wCVOL/CqqJ4g1XxZot9f6D/AGfb2Hn73+2Ry53x4HAweoHr1oA//9k=";

const fromB64 = (b64: string) => new Uint8Array(Buffer.from(b64, "base64"));

// ---------------------------------------------------------------------------------------------
// A PNG with transparency, written by hand (node:zlib only)
// ---------------------------------------------------------------------------------------------

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Uint8Array): Buffer {
  const body = Buffer.concat([Buffer.from(type, "ascii"), Buffer.from(data)]);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function makePng(width: number, height: number): Uint8Array {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const inside = (x - width / 2) ** 2 / (width / 2) ** 2 + (y - height / 2) ** 2 / (height / 2) ** 2 <= 1;
      raw.set(inside ? [30, 90, 200, 255] : [255, 255, 255, 0], row + 1 + x * 4);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.set([8, 6, 0, 0, 0], 8); // 8-bit RGBA
  return new Uint8Array(
    Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), pngChunk("IHDR", ihdr), pngChunk("IDAT", deflateSync(raw)), pngChunk("IEND", new Uint8Array())]),
  );
}

// ---------------------------------------------------------------------------------------------
// A small content-stream reader: text runs with their position on the page
// ---------------------------------------------------------------------------------------------

type Matrix = [number, number, number, number, number, number];
const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0];
/** m1 then m2 (PDF row-vector convention). */
const mul = (m1: Matrix, m2: Matrix): Matrix => [
  m1[0] * m2[0] + m1[1] * m2[2],
  m1[0] * m2[1] + m1[1] * m2[3],
  m1[2] * m2[0] + m1[3] * m2[2],
  m1[2] * m2[1] + m1[3] * m2[3],
  m1[4] * m2[0] + m1[5] * m2[2] + m2[4],
  m1[4] * m2[1] + m1[5] * m2[3] + m2[5],
];

interface Run {
  text: string;
  /** Where the text starts on the page (default user space). */
  x: number;
  y: number;
  /** Font size as drawn (before any page scaling). */
  size: number;
  /** Full text rendering matrix, for direction checks. */
  m: Matrix;
}

type Token = { kind: "num"; v: number } | { kind: "str"; v: string } | { kind: "name"; v: string } | { kind: "op"; v: string } | { kind: "other" };

function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  const isWs = (c: string) => c === " " || c === "\n" || c === "\r" || c === "\t" || c === "\f" || c === "\0";
  const isDelim = (c: string) => "()<>[]{}/%".includes(c);
  while (i < src.length) {
    const c = src[i];
    if (isWs(c)) {
      i++;
    } else if (c === "%") {
      while (i < src.length && src[i] !== "\n" && src[i] !== "\r") i++;
    } else if (c === "(") {
      let depth = 1;
      let v = "";
      i++;
      while (i < src.length && depth > 0) {
        const ch = src[i++];
        if (ch === "\\") {
          const n = src[i++];
          const map: Record<string, string> = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", "(": "(", ")": ")", "\\": "\\" };
          if (n in map) v += map[n];
          else if (/[0-7]/.test(n)) {
            let oct = n;
            while (oct.length < 3 && /[0-7]/.test(src[i])) oct += src[i++];
            v += String.fromCharCode(parseInt(oct, 8));
          } else if (n === "\r" || n === "\n") {
            if (n === "\r" && src[i] === "\n") i++;
          } else v += n;
        } else if (ch === "(") {
          depth++;
          v += ch;
        } else if (ch === ")") {
          depth--;
          if (depth > 0) v += ch;
        } else v += ch;
      }
      out.push({ kind: "str", v });
    } else if (c === "<" && src[i + 1] === "<") {
      i += 2;
      out.push({ kind: "other" });
    } else if (c === ">" && src[i + 1] === ">") {
      i += 2;
      out.push({ kind: "other" });
    } else if (c === "<") {
      const close = src.indexOf(">", i);
      const hex = src.slice(i + 1, close < 0 ? src.length : close).replace(/\s+/g, "");
      const padded = hex.length % 2 ? `${hex}0` : hex;
      let v = "";
      for (let k = 0; k < padded.length; k += 2) v += String.fromCharCode(parseInt(padded.slice(k, k + 2), 16));
      out.push({ kind: "str", v });
      i = close < 0 ? src.length : close + 1;
    } else if (c === "[" || c === "]" || c === "{" || c === "}") {
      i++;
      out.push({ kind: "other" });
    } else if (c === "/") {
      let j = i + 1;
      while (j < src.length && !isWs(src[j]) && !isDelim(src[j])) j++;
      out.push({ kind: "name", v: src.slice(i + 1, j) });
      i = j;
    } else {
      let j = i;
      while (j < src.length && !isWs(src[j]) && !isDelim(src[j])) j++;
      if (j === i) j++;
      const word = src.slice(i, j);
      i = j;
      if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(word)) out.push({ kind: "num", v: Number(word) });
      else if (word === "BI") {
        // Inline image: skip to EI.
        const ei = src.indexOf("EI", i);
        i = ei < 0 ? src.length : ei + 2;
      } else out.push({ kind: "op", v: word });
    }
  }
  return out;
}

function streamText(stream: unknown): string {
  if (!(stream instanceof PDFRawStream)) return "";
  try {
    return Buffer.from(decodePDFRawStream(stream).decode()).toString("latin1");
  } catch {
    return "";
  }
}

function readRuns(doc: PDFDocument, content: string, resources: PDFDict | undefined, ctm0: Matrix, runs: Run[], depth = 0) {
  if (depth > 8) return;
  let ctm = ctm0;
  const stack: Matrix[] = [];
  let tm: Matrix = IDENTITY;
  let tlm: Matrix = IDENTITY;
  let leading = 0;
  let size = 0;
  let operands: Token[] = [];
  const nums = () => operands.filter((o): o is { kind: "num"; v: number } => o.kind === "num").map((o) => o.v);
  const show = (text: string) => {
    const m = mul(tm, ctm);
    runs.push({ text, x: m[4], y: m[5], size, m });
  };
  const nextLine = (tx: number, ty: number) => {
    tlm = mul([1, 0, 0, 1, tx, ty], tlm);
    tm = tlm;
  };
  for (const tok of tokenize(content)) {
    if (tok.kind !== "op") {
      operands.push(tok);
      continue;
    }
    const n = nums();
    switch (tok.v) {
      case "q":
        stack.push(ctm);
        break;
      case "Q":
        ctm = stack.pop() ?? ctm0;
        break;
      case "cm":
        if (n.length >= 6) ctm = mul(n.slice(-6) as Matrix, ctm);
        break;
      case "BT":
        tm = IDENTITY;
        tlm = IDENTITY;
        break;
      case "Tm":
        if (n.length >= 6) tm = tlm = n.slice(-6) as Matrix;
        break;
      case "Td":
        if (n.length >= 2) nextLine(n[n.length - 2], n[n.length - 1]);
        break;
      case "TD":
        if (n.length >= 2) {
          leading = -n[n.length - 1];
          nextLine(n[n.length - 2], n[n.length - 1]);
        }
        break;
      case "TL":
        if (n.length) leading = n[n.length - 1];
        break;
      case "T*":
        nextLine(0, -leading);
        break;
      case "Tf":
        if (n.length) size = n[n.length - 1];
        break;
      case "Tj":
      case "TJ":
      case "'":
      case '"': {
        if (tok.v === "'" || tok.v === '"') nextLine(0, -leading);
        const text = operands.filter((o): o is { kind: "str"; v: string } => o.kind === "str").map((o) => o.v).join("");
        if (text) show(text);
        break;
      }
      case "Do": {
        const name = operands.find((o): o is { kind: "name"; v: string } => o.kind === "name");
        const xobjects = resources?.lookup(PDFName.of("XObject"));
        const xo = name && xobjects instanceof PDFDict ? doc.context.lookup(xobjects.get(PDFName.of(name.v))) : undefined;
        if (xo instanceof PDFRawStream && xo.dict.lookup(PDFName.of("Subtype"))?.toString() === "/Form") {
          const matrix = xo.dict.lookup(PDFName.of("Matrix"));
          const fm: Matrix = matrix instanceof PDFArray && matrix.size() === 6 ? ([0, 1, 2, 3, 4, 5].map((k) => (matrix.lookup(k) as PDFNumber).asNumber()) as Matrix) : IDENTITY;
          const res = xo.dict.lookup(PDFName.of("Resources"));
          readRuns(doc, streamText(xo), res instanceof PDFDict ? res : resources, mul(fm, ctm), runs, depth + 1);
        }
        break;
      }
      default:
        break;
    }
    operands = [];
  }
}

/** Every text run on a page, positioned in the page's user space. */
function pageRuns(doc: PDFDocument, page: PDFPage): Run[] {
  const contents = page.node.Contents();
  const streams = contents instanceof PDFArray ? contents.asArray().map((r) => doc.context.lookup(r)) : [contents];
  const runs: Run[] = [];
  const res = page.node.Resources();
  readRuns(doc, streams.map(streamText).join("\n"), res, IDENTITY, runs);
  return runs;
}

const textOf = (runs: Run[]) => runs.map((r) => r.text).join(" | ");
/** The page's text with wrapped lines joined by spaces, for phrases that span lines. */
const flatText = (runs: Run[]) => runs.map((r) => r.text).join(" ").replace(/\s+/g, " ");

interface ReadPdf {
  doc: PDFDocument;
  runs: Run[][];
}
async function readPdf(bytes: Uint8Array): Promise<ReadPdf> {
  const doc = await PDFDocument.load(bytes);
  return { doc, runs: doc.getPages().map((p) => pageRuns(doc, p)) };
}

// ---------------------------------------------------------------------------------------------
// Fixture builders
// ---------------------------------------------------------------------------------------------

async function simpleDoc(pages: number, size: [number, number], marker: (j: number) => string, opts: { rotate?: number; at?: [number, number] } = {}) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let j = 1; j <= pages; j++) {
    const p = doc.addPage(size);
    if (opts.rotate) p.setRotation(degrees(opts.rotate));
    const [x, y] = opts.at ?? [72, size[1] - 120];
    p.drawText(marker(j), { x, y, size: 14, font });
  }
  return doc.save();
}

/** The "Page N of M" run on a page, if any. */
const footerRun = (runs: Run[], n: number, total: number) => runs.find((r) => r.text === `Page ${n} of ${total}`);

async function main() {
  // --- One source for shared wording; file kinds ----------------------------------------------
  t.ok(BINDER_SECTION_LABELS === SECTION_LABELS, "SECTION_LABELS: exportBinder re-exports the toolkit/types object");
  t.ok(NOTICE_FROM_BINDER === CONFIDENTIAL_RECORDS_NOTICE && CONFIDENTIAL_RECORDS_NOTICE.startsWith("Some court papers are confidential."), "the confidential-records notice has one source");
  t.ok(detectFileKind(enc.encode("%PDF-1.7\n")) === "pdf" && detectFileKind(new Uint8Array([0, 0, ...enc.encode("%PDF-1.4")])) === "pdf", "PDF detected from its bytes");
  t.ok(detectFileKind(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])) === "jpeg" && detectFileKind(makePng(2, 2)) === "png", "JPEG and PNG detected from their bytes");
  t.ok(detectFileKind(enc.encode("PK\u0003\u0004word")) === null && detectFileKind(enc.encode("<html>")) === null, "Word and HTML files are not binder files");
  t.ok(mayBeBinderFile("application/pdf", "x") && mayBeBinderFile("", "a.JPG") && !mayBeBinderFile("text/html", "a.pdf") && !mayBeBinderFile("application/msword", "a.doc"), "mayBeBinderFile");

  // --- Fixtures ---------------------------------------------------------------------------------
  const docs: { name: string; bytes: Uint8Array; pages: number; height: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const pages = (i % 3) + 1;
    docs.push({ name: `Doc ${i}`, bytes: await simpleDoc(pages, [612, 700 + i], (j) => `DOC${i} P${j}`), pages, height: 700 + i });
  }
  const a4 = await simpleDoc(1, [595.28, 841.89], () => "A4MARK", { at: [72, 30] });
  const legal = await simpleDoc(1, [612, 1008], () => "LEGALMARK");
  const rotated = await simpleDoc(1, [612, 792], () => "ROTMARK", { rotate: 90 });
  const cropDoc = await PDFDocument.create();
  {
    const f = await cropDoc.embedFont(StandardFonts.Helvetica);
    const p = cropDoc.addPage([700, 900]);
    p.setCropBox(50, 60, 600, 800);
    p.drawText("CROPMARK", { x: 100, y: 100, size: 14, font: f });
  }
  const crop = await cropDoc.save();
  const LINK_RECT = [100, 395, 200, 415];
  const linkDoc = await PDFDocument.create();
  {
    const f = await linkDoc.embedFont(StandardFonts.Helvetica);
    const p = linkDoc.addPage([612, 792]);
    p.drawText("LINKMARK", { x: 100, y: 400, size: 14, font: f });
    const annot = linkDoc.context.obj({ Type: "Annot", Subtype: "Link", Rect: LINK_RECT, Border: [0, 0, 0], A: { Type: "Action", S: "URI", URI: PDFString.of("https://example.com/") } });
    p.node.set(PDFName.of("Annots"), linkDoc.context.obj([linkDoc.context.register(annot)]));
  }
  const link = await linkDoc.save();

  const fw001 = CA_FILLABLE.find((f) => f.id === "fw-001");
  t.ok(fw001, "FW-001 is in the form filler");
  const filled = await fillPdf(fw001!, { yourName: "Zelda Testperson", yourCity: "Sacramento", county: "Placer", caseName: "Zeta v. Omega" }, new Uint8Array(readFileSync(path.join(repoRoot(), "public/forms/ca/fw001.pdf"))));
  const filledDoc = await PDFDocument.load(filled.bytes);
  t.ok(filled.filled >= 3 && filledDoc.getForm().getFields().length > 0, "fixture: FW-001 filled by the app's form filler, fields not flattened");
  const formPages = filledDoc.getPageCount();

  const secured = fromB64(SECURED_PDF_B64);
  const exif6 = fromB64(EXIF6_JPEG_B64);
  const png = makePng(30, 50);
  const docxs: BinderSourceFile[] = Array.from({ length: 40 }, (_, i) => ({ name: `letter-${String(i).padStart(2, "0")}.docx`, bytes: enc.encode("PK\u0003\u0004 not a pdf") }));

  const files: BinderSourceFile[] = [
    ...docs.map((d, i) => ({ name: d.name, section: i % 2 ? "evidence" : "court_papers", documentDate: i === 0 ? "2026-11-01" : null, load: async () => d.bytes })),
    { name: "A4 page", bytes: a4 },
    { name: "Legal page", bytes: legal },
    { name: "Rotated page", bytes: rotated },
    { name: "Cropped page", bytes: crop },
    { name: "Page with link", bytes: link },
    { name: "Fee waiver request (filled)", section: "court_papers", bytes: filled.bytes, mimeType: "text/plain" },
    { name: "Sideways phone photo", section: "photos", bytes: exif6, mimeType: "application/pdf" },
    { name: "Picture PNG", section: "photos", bytes: png },
    { name: "Secured statement", bytes: secured },
    { name: "Broken PDF", bytes: enc.encode("%PDF-1.4\n%âã\nthis is not really a pdf at all\n") },
    { name: "Broken PNG", bytes: new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0, 1, 2, 3]) },
    { name: "Broken JPG", bytes: new Uint8Array([0xff, 0xd8, 0xff, 0x00, 1, 2, 3, 4, 5]) },
    { name: "Saved web page.html", bytes: enc.encode("<!doctype html><html><body>hi</body></html>") },
    { name: "Empty file", bytes: new Uint8Array() },
    { name: "Download fails", load: async () => { throw new Error("network down"); } },
    { name: "Drive link", skip: { code: "link" } },
    ...docxs,
  ];

  // --- Build A: page numbers on, everything ---------------------------------------------------
  const progress: number[] = [];
  const res = await buildBinderPdf({ caseTitle: "Zeta v. Omega — eviction", generatedOn: "2026-10-13", files, onProgress: (p) => progress.push(p.done) });
  const A = await readPdf(res.pdfBytes);
  const total = A.doc.getPageCount();
  const names = res.included.map((x) => x.name);
  const expected = [...docs.map((d) => d.name), "A4 page", "Legal page", "Rotated page", "Cropped page", "Page with link", "Fee waiver request (filled)", "Sideways phone photo", "Picture PNG"];
  t.eq(names, expected, "A: the 38 readable files are included, in the order given");
  const codes = Object.fromEntries(res.excluded.map((e) => [e.name, e.code]));
  t.eq(
    ["Secured statement", "Broken PDF", "Broken PNG", "Broken JPG", "Saved web page.html", "Empty file", "Download fails", "Drive link"].map((n) => codes[n]),
    ["secured", "unreadable", "picture_unreadable", "picture_unreadable", "not_supported", "unreadable", "download_failed", "link"],
    "A: each left-out file has the right reason",
  );
  t.ok(docxs.every((d) => codes[d.name] === "not_supported") && res.excluded.length === 48, `A: 40 Word files listed as not supported (${res.excluded.length} left out)`);
  t.ok(res.excluded.every((e) => e.reason === EXCLUDED_REASONS[e.code]), "A: reasons come from EXCLUDED_REASONS");
  t.ok(progress.length === files.length && progress[progress.length - 1] === files.length, "A: progress reported once per file");
  t.eq(total, res.pageCount, "A: page count in the result equals the PDF");

  const toc = tocPageCount(res.included.length);
  t.ok(toc === 2 && res.contentsPages === 2, `A: two contents pages for 38 documents (${res.contentsPages})`);
  const contentPages = docs.reduce((n, d) => n + d.pages, 0) + 5 + formPages + 2;
  t.eq(res.notIncludedPage, 1 + toc + contentPages + 1, "A: the Not-included list starts right after the documents");
  t.ok(total > (res.notIncludedPage ?? total), "A: 48 left-out files need more than one Not-included page");

  // Every page carries "Page N of M", in the bottom band of the page as shown.
  const missingFooter: number[] = [];
  const badBand: string[] = [];
  const helv = await (await PDFDocument.create()).embedFont(StandardFonts.Helvetica);
  A.doc.getPages().forEach((page, i) => {
    const f = footerRun(A.runs[i], i + 1, total);
    if (!f) {
      missingFooter.push(i + 1);
      return;
    }
    const crop = page.getCropBox();
    const rot = ((page.getRotation().angle % 360) + 360) % 360;
    const sideways = rot === 90 || rot === 270;
    const band = (1 - s) * (sideways ? crop.width : crop.height);
    const w = helv.widthOfTextAtSize(f.text, f.size);
    const midAlong = rot === 90 ? f.y + w / 2 : rot === 270 ? f.y - w / 2 : rot === 180 ? f.x - w / 2 : f.x + w / 2;
    const center = sideways ? crop.y + crop.height / 2 : crop.x + crop.width / 2;
    const inBand =
      rot === 90 ? f.x >= crop.x + crop.width - band && f.x <= crop.x + crop.width
      : rot === 270 ? f.x >= crop.x && f.x <= crop.x + band
      : rot === 180 ? f.y >= crop.y + crop.height - band && f.y <= crop.y + crop.height
      : f.y >= crop.y && f.y <= crop.y + band;
    if (!inBand || Math.abs(midAlong - center) > 1) badBand.push(`page ${i + 1} (rot ${rot}) at ${f.x.toFixed(1)},${f.y.toFixed(1)}`);
  });
  t.ok(missingFooter.length === 0, "A: every page has Page N of M", missingFooter);
  t.ok(badBand.length === 0, "A: every footer is centered in the bottom band of the page as shown (rotation and crop box)", badBand.slice(0, 4));

  // Contents rows point at the right pages; each start page holds its document.
  const tocRows = new Map<number, number>();
  for (let p = 1; p <= toc; p++) {
    const runs = A.runs[p];
    for (const r of runs.filter((x) => Math.abs(x.x - 54) < 0.5 && /^\d+$/.test(x.text))) {
      const pageCell = runs.find((x) => Math.abs(x.y - r.y) < 0.5 && Math.abs(x.x - 522) < 0.5 && /^\d+$/.test(x.text));
      if (pageCell) tocRows.set(Number(r.text), Number(pageCell.text));
    }
  }
  t.eq([...tocRows.entries()].sort((a, b) => a[0] - b[0]).map(([, page]) => page), res.included.map((x) => x.startPage), "A: contents rows list each document's start page");
  t.ok(textOf(A.runs[1]).includes("Nov 1, 2026"), "A: the typed document date is printed as typed (no day shift)");
  t.ok(/48 files are not in this binder\. See the list on page \d+/.test(textOf(A.runs[toc])), "A: the contents point to the Not-included list");
  const misplaced: string[] = [];
  docs.forEach((d, i) => {
    const start = res.included[i].startPage;
    for (let j = 1; j <= d.pages; j++) {
      const page = A.doc.getPage(start + j - 2);
      if (!textOf(A.runs[start + j - 2]).includes(`DOC${i} P${j}`) || Math.abs(page.getMediaBox().height - d.height) > 0.01) misplaced.push(`Doc ${i} page ${j}`);
    }
  });
  t.ok(misplaced.length === 0, "A: each start page holds its document (text marker and page height)", misplaced.slice(0, 4));

  // Document content is shrunk into the space above the band, never under the footer.
  const byName = (n: string) => res.included[names.indexOf(n)].startPage;
  const marker = (pageNo: number, text: string) => A.runs[pageNo - 1].find((r) => r.text === text);
  {
    const a4mark = marker(byName("A4 page"), "A4MARK");
    t.ok(a4mark && Math.abs(a4mark.y - (s * 30 + (1 - s) * 841.89)) < 0.01, "A: A4 marker near the bottom edge is lifted above the band", a4mark?.y);
    const rot = marker(byName("Rotated page"), "ROTMARK");
    t.ok(A.doc.getPage(byName("Rotated page") - 1).getRotation().angle === 90 && rot && Math.abs(rot.x - s * 72) < 0.01, "A: rotated page keeps /Rotate 90 and its content stays out of the band");
    const cropMark = marker(byName("Cropped page"), "CROPMARK");
    const expX = s * 100 + (1 - s) * 50 + 0.5 * (1 - s) * 600;
    const expY = s * 100 + (1 - s) * 60 + (1 - s) * 800;
    t.ok(cropMark && Math.abs(cropMark.x - expX) < 0.01 && Math.abs(cropMark.y - expY) < 0.01, "A: crop-box content is shrunk inside the crop box");
    t.ok(Math.abs(A.doc.getPage(byName("Legal page") - 1).getMediaBox().height - 1008) < 0.01, "A: Legal page keeps its own size");
    const d0 = marker(res.included[0].startPage, "DOC0 P1");
    t.ok(d0 && Math.abs(d0.x - (s * 72 + 0.5 * (1 - s) * 612)) < 0.01, "A: document text moved by exactly the band transform");
  }

  // The link moved exactly with the content.
  {
    const page = A.doc.getPage(byName("Page with link") - 1);
    const annot = page.node.Annots()?.lookup(0);
    const rect = annot instanceof PDFDict ? annot.lookup(PDFName.of("Rect")) : undefined;
    const got = rect instanceof PDFArray ? [0, 1, 2, 3].map((k) => (rect.lookup(k) as PDFNumber).asNumber()) : [];
    const want = LINK_RECT.map((v, k) => v * s + (k % 2 === 0 ? 0.5 * (1 - s) * 612 : (1 - s) * 792));
    t.ok(got.length === 4 && got.every((v, k) => Math.abs(v - want[k]) < 0.01), "A: link Rect scaled and shifted with the page", { got, want });
  }

  // The filled form: flattened, values kept, moved exactly with the printed form.
  const formPage = byName("Fee waiver request (filled)");
  {
    const annots = A.doc.getPage(formPage - 1).node.Annots();
    let widgets = 0;
    for (let k = 0; k < (annots?.size() ?? 0); k++) {
      const a = annots?.lookup(k);
      if (a instanceof PDFDict && a.lookup(PDFName.of("Subtype"))?.toString() === "/Widget") widgets++;
    }
    t.eq(widgets, 0, "A: the filled form is flattened (no form fields left)");
    t.ok(textOf(A.runs[formPage - 1]).includes("Zelda Testperson") && textOf(A.runs[formPage - 1]).includes("Sacramento"), "A: typed form values kept after flattening");
  }

  // Pictures: one Letter page each, named.
  {
    const p = byName("Sideways phone photo");
    const size = A.doc.getPage(p - 1).getSize();
    t.ok(Math.abs(size.width - 612) < 0.01 && Math.abs(size.height - 792) < 0.01 && textOf(A.runs[p - 1]).includes("Sideways phone photo"), "A: a picture gets a Letter page with its name");
    const xobjects = A.doc.getPage(byName("Picture PNG") - 1).node.Resources()?.lookup(PDFName.of("XObject"));
    const kinds = xobjects instanceof PDFDict ? xobjects.values().map((v) => (v instanceof PDFRef ? A.doc.context.lookup(v) : v)).map((o) => (o instanceof PDFRawStream ? o.dict.lookup(PDFName.of("Subtype"))?.toString() : "")) : [];
    t.ok(kinds.includes("/Image"), "A: the PNG is embedded as an image");
  }

  // Not-included pages list every left-out name; cover text; no court labels.
  const notText = A.runs.slice((res.notIncludedPage ?? total) - 1).map(textOf).join(" | ");
  const unlisted = res.excluded.filter((e) => !notText.includes(e.name)).map((e) => e.name);
  t.ok(unlisted.length === 0, "A: every left-out file is printed on the Not-included pages", unlisted);
  const notFlat = A.runs.slice((res.notIncludedPage ?? total) - 1).map(flatText).join(" ");
  t.ok(notFlat.includes("security settings") && notFlat.includes("Only PDF, JPG and PNG files can go in a binder PDF"), "A: reasons are printed");
  const cover = flatText(A.runs[0]);
  t.ok(cover.includes("Zeta v. Omega - eviction") && cover.includes("38 documents") && cover.includes("Made on Tuesday, October 13, 2026"), "A: cover shows the case title (made PDF-safe), document count and date");
  t.ok(cover.includes("Page numbers in this binder were added by the binder tool") && cover.includes("Not reviewed by a lawyer, a court or Justice Bot USA"), "A: cover carries counsel's notes");
  t.ok(cover.includes("Quorex Solutions") && cover.includes("Justice Bot Technologies Inc.") && !/veritas/i.test(cover), "A: cover names the company the one right way");
  const binderPages = [0, ...Array.from({ length: toc }, (_, k) => k + 1), ...A.runs.map((_, k) => k).filter((k) => k >= (res.notIncludedPage ?? total) - 1)];
  t.ok(!/exhibit|court-ready|book of documents/i.test(binderPages.map((k) => flatText(A.runs[k])).join(" ")), "A: no court labels on the binder's own pages");

  // Refs are passed back and never printed.
  {
    const r = await buildBinderPdf({ caseTitle: "R", generatedOn: "2026-10-13", files: [{ name: "a", ref: "row-1", bytes: docs[0].bytes }, { name: "b", ref: "row-2", bytes: secured }] });
    const rr = await readPdf(r.pdfBytes);
    t.ok(r.included[0].ref === "row-1" && r.excluded[0].ref === "row-2" && !rr.runs.map(textOf).join(" ").includes("row-"), "refs are passed back and never printed");
  }

  // --- Build B: "No page numbers" ------------------------------------------------------------
  const resB = await buildBinderPdf({
    caseTitle: "Case B",
    generatedOn: "2026-03-08",
    pageNumbers: false,
    files: [
      { name: "Doc 0", bytes: docs[0].bytes },
      { name: "Rotated page", bytes: rotated },
      { name: "Fee waiver request (filled)", bytes: filled.bytes },
      { name: "Secured statement", bytes: secured },
    ],
  });
  const B = await readPdf(resB.pdfBytes);
  const bAll = B.runs.map(textOf).join(" | ");
  t.ok(!new RegExp(`Page \\d+ of ${resB.pageCount}\\b`).test(bAll), "B: no binder page numbers anywhere");
  t.ok(!flatText(B.runs[0]).includes("Page numbers in this binder") && flatText(B.runs[0]).includes("Sunday, March 8, 2026"), "B: cover drops the page-number sentence and shows the date with the right weekday");
  {
    const d0 = B.runs[resB.included[0].startPage - 1].find((r) => r.text === "DOC0 P1");
    t.ok(d0 && Math.abs(d0.x - 72) < 0.01, "B: document content is not scaled");
    // The same form value: in A it sits exactly where B puts it, shrunk into the band.
    const inB = B.runs[resB.included[2].startPage - 1].find((r) => r.text.includes("Zelda"));
    const inA = A.runs[formPage - 1].find((r) => r.text.includes("Zelda"));
    const cropB = B.doc.getPage(resB.included[2].startPage - 1).getCropBox();
    const tx = (1 - s) * cropB.x + 0.5 * (1 - s) * cropB.width;
    const ty = (1 - s) * cropB.y + (1 - s) * cropB.height;
    t.ok(inA && inB && Math.abs(inA.x - (s * inB.x + tx)) < 0.01 && Math.abs(inA.y - (s * inB.y + ty)) < 0.01, "A/B: the filled form value moved exactly with the printed form", { inA: inA && [inA.x, inA.y], inB: inB && [inB.x, inB.y] });
  }
  t.ok(resB.excluded.length === 1 && resB.excluded[0].code === "secured" && /1 file is not in this binder/.test(bAll), "B: one secured PDF listed (singular wording)");

  // --- C: page limit; D: stop; E: nothing can go in ------------------------------------------
  const resC = await buildBinderPdf({ caseTitle: "C", generatedOn: "2026-10-13", maxPages: 4, files: docs.slice(0, 5).map((d) => ({ name: d.name, bytes: d.bytes })) });
  t.eq(resC.included.map((x) => x.name), ["Doc 0", "Doc 1", "Doc 3"], "C: the page limit keeps what fits, in order");
  t.eq(resC.excluded.map((e) => e.code), ["too_many_pages", "too_many_pages"], "C: the rest are listed as over the limit");

  const ctrl = new AbortController();
  let stopped = false;
  try {
    await buildBinderPdf({
      caseTitle: "D",
      generatedOn: "2026-10-13",
      files: docs.slice(0, 5).map((d) => ({ name: d.name, bytes: d.bytes })),
      onProgress: (p) => {
        if (p.done === 2) ctrl.abort();
      },
      signal: ctrl.signal,
    });
  } catch (err) {
    stopped = err instanceof Error && err.name === "AbortError";
  }
  t.ok(stopped, "D: Stop ends the build with an AbortError");

  const resE = await buildBinderPdf({ caseTitle: "", generatedOn: "2026-10-13", files: docxs.slice(0, 3) });
  const E = await readPdf(resE.pdfBytes);
  t.ok(resE.included.length === 0 && resE.pageCount === 3, "E: cover, contents and Not-included only");
  t.ok(textOf(E.runs[1]).includes("No documents could be added") && textOf(E.runs[0]).includes("My documents"), "E: says nothing could be added; untitled binder is 'My documents'");

  // --- Optional cross-check with poppler -----------------------------------------------------
  const probe = spawnSync("pdftotext", ["-v"], { encoding: "utf8" });
  if (probe.error) {
    console.log("  (pdftotext not installed: poppler cross-check skipped)");
  } else {
    const dir = mkdtempSync(path.join(tmpdir(), "toolkit-binder-"));
    try {
      const file = path.join(dir, "binder-A.pdf");
      writeFileSync(file, (res as BinderResult).pdfBytes);
      const out = spawnSync("pdftotext", [file, "-"], { encoding: "utf8" }).stdout ?? "";
      const pages = out.split("\f");
      const missing = Array.from({ length: total }, (_, k) => k + 1).filter((n) => !(pages[n - 1] ?? "").includes(`Page ${n} of ${total}`));
      t.ok(missing.length === 0, "poppler: pdftotext also finds Page N of M on every page", missing.slice(0, 5));
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }

  t.finish();
}

run("check-binder", main);
