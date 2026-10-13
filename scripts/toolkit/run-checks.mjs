#!/usr/bin/env node
// Runs the Toolkit checks (npm run check:toolkit). Each scripts/toolkit/check-*.ts is bundled with
// the project's own esbuild (alias @ -> ./src, platform node) into a temporary folder and run with
// node from the repository root. No test framework and no extra dependencies.
//
//   npm run check:toolkit                 all checks
//   node scripts/toolkit/run-checks.mjs ics binder   only some
//
// The banner gives the bundles `require` (some dependencies are CommonJS) and an in-memory
// localStorage stand-in, so app modules that import the Supabase client can load in node. Nothing
// here signs in or calls the network.

import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const esbuild = path.join(root, "node_modules", ".bin", process.platform === "win32" ? "esbuild.cmd" : "esbuild");
const ALL = ["ics", "dates", "binder", "disclosure"];
const wanted = process.argv.slice(2);
const checks = wanted.length ? wanted : ALL;

const unknown = checks.filter((c) => !ALL.includes(c));
if (unknown.length) {
  console.error(`Unknown check: ${unknown.join(", ")}. Choose from: ${ALL.join(", ")}.`);
  process.exit(2);
}
if (!existsSync(esbuild)) {
  console.error("esbuild was not found in node_modules/.bin. Run npm install first.");
  process.exit(2);
}

const banner =
  "import{createRequire as __tkRequire}from'module';const require=__tkRequire(import.meta.url);" +
  "if(!globalThis.localStorage){const s=new Map();globalThis.localStorage={getItem:(k)=>s.has(k)?s.get(k):null,setItem:(k,v)=>{s.set(k,String(v))},removeItem:(k)=>{s.delete(k)},clear:()=>s.clear(),key:(i)=>[...s.keys()][i]??null,get length(){return s.size}};}";

const outDir = mkdtempSync(path.join(tmpdir(), "toolkit-checks-"));
const failed = [];
try {
  for (const name of checks) {
    const entry = path.join("scripts", "toolkit", `check-${name}.ts`);
    const outfile = path.join(outDir, `check-${name}.mjs`);
    console.log(`\n== check-${name}`);
    const build = spawnSync(
      esbuild,
      [entry, "--bundle", "--platform=node", "--format=esm", "--alias:@=./src", "--log-level=warning", `--banner:js=${banner}`, `--outfile=${outfile}`],
      { cwd: root, stdio: "inherit", shell: process.platform === "win32" },
    );
    if (build.status !== 0) {
      failed.push(name);
      continue;
    }
    const result = spawnSync(process.execPath, ["--no-deprecation", outfile], {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, TOOLKIT_CHECK_ROOT: root },
    });
    if (result.status !== 0) failed.push(name);
  }
} finally {
  rmSync(outDir, { recursive: true, force: true });
}

if (failed.length) {
  console.error(`\nToolkit checks failed: ${failed.join(", ")}`);
  process.exit(1);
}
console.log(`\nAll Toolkit checks passed (${checks.join(", ")}).`);
