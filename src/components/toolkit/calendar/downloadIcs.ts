// Saves a .ics file in the browser: Blob, object URL, and a temporary <a download>.
//
// On an iPhone the file usually lands in the Files app, and the Google Calendar app on Android
// cannot open it, so the page never promises a one-tap import. Nothing here logs or reports the
// file name or contents.

export function downloadIcsFile(contents: string, fileName: string): void {
  const blob = new Blob([contents], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.rel = "noopener";
  a.style.display = "none";
  // Keep this synthetic click away from page-wide click listeners (analytics); the download itself
  // still happens.
  a.addEventListener("click", (e) => e.stopPropagation());
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Some mobile browsers read the object URL after click() returns, so release it later.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
