// lib/validation/engine.ts

import { JSDOM, VirtualConsole } from "jsdom";
import type { RuleType } from "@prisma/client";
import "server-only";

export interface RuleConfig {
  selector?: string;
  attribute?: string;
  expectedValue?: string;
  contains?: string;
  text?: string;
  caseSensitive?: boolean;
}

export interface RuleInput {
  id: string;
  type: RuleType;
  config: RuleConfig;
  successMessage: string;
  failureMessage: string;
  hintMessage?: string | null;
}

export interface RuleResult {
  ruleId: string;
  passed: boolean;
  message: string;
}

export interface AvatarReactionOutput {
  pose: "PASSED" | "FAILED" | "HINT";
  dialogue: string;
}

export interface EvaluationOutcome {
  success: boolean;
  results: RuleResult[];
  avatarReaction: AvatarReactionOutput;
}

const DEFAULT_JS_TIMEOUT_MS = 2000;

/**
 * Builds a full document from the three source fragments and returns
 * a JSDOM instance with jsCode already executed against it.
 */
async function buildDom(
  htmlCode: string,
  cssCode: string,
  jsCode: string,
  timeoutMs: number
): Promise<{ dom: JSDOM | null; error: string | null }> {
  const virtualConsole = new VirtualConsole();
  // Swallow student console.log/error output rather than polluting server logs.
  virtualConsole.on("jsdomError", () => {});

  const fullHtml = `<!DOCTYPE html><html>
  <head>
    <meta charset="utf-8" />
    <style>${cssCode ?? ""}</style>
  </head>
  <body>
    ${htmlCode ?? ""}
  </body></html>`;

  try {
    const dom = new JSDOM(fullHtml, {
      runScripts: jsCode?.trim() ? "dangerously" : "outside-only",
      resources: undefined, // never fetch external resources
      virtualConsole,
    });

    if (jsCode?.trim()) {
      let executionError: string | null = null;

      const executed = await Promise.race([
        new Promise<boolean>((resolve) => {
          try {
            dom.window.eval(jsCode);
            resolve(true);
          } catch (err: any) {
            executionError = err?.message || "JavaScript execution threw an error.";
            resolve(false);
          }
        }),
        new Promise<boolean>((resolve) =>
          setTimeout(() => {
            executionError = "Your JavaScript execution timed out.";
            resolve(false);
          }, timeoutMs)
        ),
      ]);

      if (!executed) {
        return { dom: null, error: executionError ?? "Your JavaScript timed out or threw an error." };
      }
    }

    return { dom, error: null };
  } catch (err: any) {
    return {
      dom: null,
      error: err?.message || "Failed to render your code.",
    };
  }
}

function evaluateRule(document: Document, rule: RuleInput): RuleResult {
  const { config } = rule;

  switch (rule.type) {
    case "DOM_ELEMENT_EXISTS": {
      if (!config.selector) {
        return { ruleId: rule.id, passed: false, message: "Misconfigured rule (no selector)." };
      }
      const passed = document.querySelector(config.selector) !== null;
      return {
        ruleId: rule.id,
        passed,
        message: passed ? rule.successMessage : rule.failureMessage,
      };
    }

    case "ATTRIBUTE_MATCH": {
      if (!config.selector || !config.attribute) {
        return { ruleId: rule.id, passed: false, message: "Misconfigured rule (no selector/attribute)." };
      }
      const el = document.querySelector(config.selector);
      if (!el) {
        return { ruleId: rule.id, passed: false, message: rule.failureMessage };
      }

      const actual = el.getAttribute(config.attribute) ?? "";
      let passed: boolean;

      if (config.expectedValue !== undefined) {
        passed = actual === config.expectedValue;
      } else if (config.contains !== undefined) {
        passed = actual.includes(config.contains);
      } else {
        passed = actual.trim().length > 0;
      }

      return {
        ruleId: rule.id,
        passed,
        message: passed ? rule.successMessage : rule.failureMessage,
      };
    }

    case "TEXT_CONTAINS": {
      if (!config.selector || config.text === undefined) {
        return { ruleId: rule.id, passed: false, message: "Misconfigured rule (no selector/text)." };
      }
      const el = document.querySelector(config.selector);
      if (!el) {
        return { ruleId: rule.id, passed: false, message: rule.failureMessage };
      }

      const actualText = el.textContent ?? "";
      const passed = config.caseSensitive
        ? actualText.includes(config.text)
        : actualText.toLowerCase().includes(config.text.toLowerCase());

      return {
        ruleId: rule.id,
        passed,
        message: passed ? rule.successMessage : rule.failureMessage,
      };
    }

    default:
      return { ruleId: rule.id, passed: false, message: "Unknown rule type." };
  }
}

export async function evaluateSubmission(
  htmlCode: string,
  cssCode: string,
  jsCode: string,
  rules: RuleInput[],
  options?: { timeoutMs?: number }
): Promise<EvaluationOutcome> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_JS_TIMEOUT_MS;
  const { dom, error } = await buildDom(htmlCode, cssCode, jsCode, timeoutMs);

  if (!dom) {
    const failMessage = error ?? "Could not render your code.";
    return {
      success: false,
      results: rules.map((r) => ({ ruleId: r.id, passed: false, message: failMessage })),
      avatarReaction: { 
        pose: "FAILED", 
        dialogue: `I ran into an issue running your code: "${failMessage}"` 
      },
    };
  }

  const results = rules.map((rule) => evaluateRule(dom.window.document, rule));
  const success = results.every((r) => r.passed);
  const firstFailure = results.find((r) => !r.passed);

  return {
    success,
    results,
    avatarReaction: {
      pose: success ? "PASSED" : "FAILED",
      dialogue: success
        ? "Nice work — every check passed!"
        : firstFailure?.message ?? "Something's not quite right yet.",
    },
  };
}

/**
 * Separate from submission scoring — call this when the student clicks
 * "Get a hint" rather than "Submit", so hints don't count as a failed attempt.
 */
export function getHintForFirstFailingRule(
  document: Document,
  rules: RuleInput[]
): { pose: "HINT"; dialogue: string } | null {
  for (const rule of rules) {
    const result = evaluateRule(document, rule);
    if (!result.passed && rule.hintMessage) {
      return { pose: "HINT", dialogue: rule.hintMessage };
    }
  }
  return null;
}