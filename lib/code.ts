import type { Lesson } from "@prisma/client";
import type { CodeFiles } from "./type";

export function getStarterFiles(
  lesson: Pick<Lesson, "starterCodeHtml" | "starterCodeCss" | "starterCodeJs">
): CodeFiles {
  return {
    html: lesson.starterCodeHtml ?? "",
    css: lesson.starterCodeCss ?? "",
    js: lesson.starterCodeJs ?? "",
  };
}

// ---------------------------------------------------------------
// Preview <-> parent error channel
// ---------------------------------------------------------------

export const PREVIEW_CHANNEL = "codetopiaz-preview";

export interface PreviewErrorMessage {
  channel: typeof PREVIEW_CHANNEL;
  type: "error";
  message: string;
  line?: number; // 1-based line within the student's script.js, when known
  column?: number;
}

export function isPreviewErrorMessage(
  data: unknown
): data is PreviewErrorMessage {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    d.channel === PREVIEW_CHANNEL &&
    d.type === "error" &&
    typeof d.message === "string"
  );
}

/**
 * Script injected into the preview's <head>, before any student code runs.
 * `offset` is how many document lines precede the student's script, and
 * `lineCount` is the script's own length. Together they translate browser
 * line numbers (relative to the whole generated document) into script.js
 * line numbers. Anything outside that range (e.g. an inline onclick="" in
 * the HTML) is reported without a line number rather than a wrong one.
 */
function errorBridge(offset: number, lineCount: number): string {
  return `(function () {
  var OFFSET = ${offset};
  var LINES = ${lineCount};
  function send(message, line, column) {
    var local = typeof line === "number" ? line - OFFSET : undefined;
    if (local !== undefined && (local < 1 || local > LINES)) local = undefined;
    try {
      window.parent.postMessage({
        channel: ${JSON.stringify(PREVIEW_CHANNEL)},
        type: "error",
        message: String(message).slice(0, 500),
        line: local,
        column: local === undefined ? undefined : column
      }, "*");
    } catch (e) {}
  }
  window.addEventListener("error", function (e) {
    send(e.message, e.lineno, e.colno);
  });
  window.addEventListener("unhandledrejection", function (e) {
    var r = e.reason;
    send("Unhandled promise rejection: " + (r && r.message ? r.message : r));
  });
})();`;
}

/**
 * Combines the three files into one document for the preview iframe.
 * The closing-tag escapes stop student code containing "</script>" or
 * "</style>" from breaking out of its own tag.
 */
export function buildPreviewDocument({ html, css, js }: CodeFiles): string {
  const safeCss = css.replace(/<\/style/gi, "<\\/style");
  const safeJs = js.replace(/<\/script/gi, "<\\/script");
  const lineCount = safeJs.split("\n").length;

  // Everything up to and including the student's opening <script> tag.
  // The number of newlines in it is the line offset. It doesn't depend on
  // the offset's own digits, so we measure with 0 and rebuild with the result.
  const makeBefore = (offset: number) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script>${errorBridge(offset, lineCount)}</script>
    <style>${safeCss}</style>
  </head>
  <body>
    ${html}
    <script>`;

  const offset = (makeBefore(0).match(/\n/g) ?? []).length;

  return `${makeBefore(offset)}${safeJs}</script>
  </body>
</html>`;
}