// Minimal assertion helper shared by the Toolkit checks in this folder. No test framework and no
// extra dependencies: each check is bundled with esbuild and run with node (see run-checks.mjs).
//
// Checks never print case titles, file names, event titles, class names or notes from real data;
// they only ever see the fixtures they build themselves.

import path from "node:path";

export interface Harness {
  /** Records a pass, or prints FAIL with the label (and optional detail) and records a failure. */
  ok(condition: unknown, label: string, detail?: unknown): void;
  /** Deep equality through JSON, with both values printed on failure. */
  eq(actual: unknown, expected: unknown, label: string): void;
  /** Prints the summary and exits: 0 when everything passed, 1 otherwise. */
  finish(): never;
  readonly failures: number;
}

export function createHarness(name: string): Harness {
  let passes = 0;
  let failures = 0;
  const harness: Harness = {
    ok(condition, label, detail) {
      if (condition) {
        passes++;
        return;
      }
      failures++;
      console.log(`  FAIL ${label}${detail === undefined ? "" : `\n       ${typeof detail === "string" ? detail : JSON.stringify(detail)}`}`);
    },
    eq(actual, expected, label) {
      const a = JSON.stringify(actual);
      const e = JSON.stringify(expected);
      harness.ok(a === e, label, `got:      ${a}\n       expected: ${e}`);
    },
    finish() {
      console.log(`${name}: ${passes} passed, ${failures} failed`);
      process.exit(failures ? 1 : 0);
    },
    get failures() {
      return failures;
    },
  };
  return harness;
}

/** The repository root. run-checks.mjs runs every check from there. */
export function repoRoot(): string {
  return path.resolve(process.env.TOOLKIT_CHECK_ROOT ?? process.cwd());
}

/** Runs an async main and turns a thrown error into a failed check run. */
export function run(name: string, main: () => Promise<void>): void {
  main().catch((err) => {
    console.log(`${name}: crashed: ${err instanceof Error ? err.stack ?? err.message : String(err)}`);
    process.exit(1);
  });
}
