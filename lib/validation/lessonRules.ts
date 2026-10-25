// lib/validation/lessonRules.ts

import type { ValidationRule } from "./htmlValidator";

export const lessonValidationRules: Record<string, ValidationRule[]> = {
  "headings-and-text": [
    { type: "tagExists", tag: "h1", message: "Add an <h1> heading" },
    { type: "tagExists", tag: "h2", message: "Add an <h2> subheading" },
    {
      type: "tagContainsText",
      tag: "p",
      minLength: 10,
      message: "Add a <p> paragraph with at least a short sentence",
    },
  ],
  lists: [
    { type: "tagExists", tag: "ul", message: "Add a <ul> list" },
    {
      type: "tagCount",
      tag: "li",
      min: 2,
      message: "Add at least 2 <li> items",
    },
  ],
};

export function getRulesForSlug(slug: string): ValidationRule[] {
  return lessonValidationRules[slug] ?? [];
}