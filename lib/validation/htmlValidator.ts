// lib/validation/htmlValidator.ts

export type ValidationRule =
  | { type: "tagExists"; tag: string; message: string }
  | { type: "tagCount"; tag: string; min: number; message: string }
  | { type: "tagContainsText"; tag: string; minLength: number; message: string };

export interface RuleResult {
  message: string;
  passed: boolean;
}

export interface ValidationOutcome {
  passed: boolean;
  results: RuleResult[];
}

/**
 * Lightweight, dependency-free HTML checks. Not a real parser —
 * good enough for "does a tag exist / have enough text" checks on
 * beginner-level snippets. Do not extend this into general-purpose
 * HTML validation; swap in a real parser (e.g. `node-html-parser`)
 * if lesson complexity grows past simple tag/content checks.
 */
function countTag(code: string, tag: string): number {
  const openTagPattern = new RegExp(`<${tag}[^>]*>`, "gi");
  return (code.match(openTagPattern) ?? []).length;
}

function getTagInnerText(code: string, tag: string): string[] {
  const pattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  const matches = [...code.matchAll(pattern)];
  return matches.map((m) => m[1].replace(/<[^>]+>/g, "").trim());
}

export function validateCode(
  code: string,
  rules: ValidationRule[]
): ValidationOutcome {
  const results: RuleResult[] = rules.map((rule) => {
    switch (rule.type) {
      case "tagExists": {
        const passed = countTag(code, rule.tag) > 0;
        return { message: rule.message, passed };
      }
      case "tagCount": {
        const passed = countTag(code, rule.tag) >= rule.min;
        return { message: rule.message, passed };
      }
      case "tagContainsText": {
        const texts = getTagInnerText(code, rule.tag);
        const passed = texts.some((t) => t.length >= rule.minLength);
        return { message: rule.message, passed };
      }
      default:
        return { message: "Unknown rule", passed: false };
    }
  });

  return {
    passed: results.every((r) => r.passed),
    results,
  };
}