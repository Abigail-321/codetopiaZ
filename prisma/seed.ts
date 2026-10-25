import "dotenv/config";
import { PrismaClient, RuleType, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL?.trim().replace(/^["']|["']$/g, "");

if (!connectionString) {
  console.error("❌ DATABASE_URL is missing or empty in .env");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  console.log("🌱 Seeding CodeTopiaZ curriculum...");

  // ---------------------------------------------------------------
  // TRACK 1: Web Foundations
  // ---------------------------------------------------------------
  const track1 = await prisma.track.upsert({
    where: { slug: "web-foundations" },
    update: {},
    create: {
      title: "Web Foundations",
      slug: "web-foundations",
      description: "HTML5 structure and modern CSS fundamentals.",
      orderIndex: 1,
      published: true,
    },
  });

  const module11 = await prisma.module.upsert({
    where: { trackId_slug: { trackId: track1.id, slug: "html-structure-semantics" } },
    update: {},
    create: {
      trackId: track1.id,
      title: "HTML Structure & Semantics",
      slug: "html-structure-semantics",
      description: "Learn how to structure a page with meaningful, semantic markup.",
      orderIndex: 1,
      published: true,
    },
  });

  const module12 = await prisma.module.upsert({
    where: { trackId_slug: { trackId: track1.id, slug: "forms-accessibility" } },
    update: {},
    create: {
      trackId: track1.id,
      title: "Forms & Accessibility",
      slug: "forms-accessibility",
      description: "Build forms that are usable by everyone, including screen reader users.",
      orderIndex: 2,
      published: true,
    },
  });

  // ---------------------------------------------------------------
  // TRACK 2: Interactive Web & DOM
  // ---------------------------------------------------------------
  const track2 = await prisma.track.upsert({
    where: { slug: "interactive-web-dom" },
    update: {},
    create: {
      title: "Interactive Web & DOM",
      slug: "interactive-web-dom",
      description: "JavaScript fundamentals and DOM manipulation.",
      orderIndex: 2,
      published: true,
    },
  });

  const module21 = await prisma.module.upsert({
    where: { trackId_slug: { trackId: track2.id, slug: "js-fundamentals" } },
    update: {},
    create: {
      trackId: track2.id,
      title: "JS Fundamentals",
      slug: "js-fundamentals",
      description: "Variables, the DOM, and your first event listeners.",
      orderIndex: 1,
      published: true,
    },
  });

  // =================================================================
  // MODULE 1.1 — HTML Structure & Semantics (3 lessons)
  // =================================================================
  await upsertLesson({
    moduleId: module11.id,
    slug: "document-structure",
    title: "Document Structure",
    orderIndex: 1,
    instructionsMarkdown: `## Structure a page with semantic landmarks
Semantic tags tell browsers, search engines, and screen readers what each part of your page *means* — not just how it looks.

1. Wrap the top of the page in a \`<header>\` containing an \`<h1>\`.
2. Wrap the main content in a \`<main>\` tag containing at least one \`<p>\`.
3. Add a \`<footer>\` with a short copyright line.`,
    starterCodeHtml: `<h1>My Site</h1><p>Welcome to my site.</p><p>© 2026 My Site</p>`,
    starterCodeCss: `body {\n  font-family: sans-serif;\n  margin: 2rem;\n}`,
    starterCodeJs: "",
    solutionCodeHtml: `<header>\n  <h1>My Site</h1>\n</header>\n<main>\n  <p>Welcome to my site.</p>\n</main>\n<footer>\n  <p>© 2026 My Site</p>\n</footer>`,
    solutionCodeCss: `body {\n  font-family: sans-serif;\n  margin: 2rem;\n}`,
    solutionCodeJs: "",
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "header" },
        successMessage: "Found your <header> — nice.",
        failureMessage: "Add a <header> tag around your top content.",
        hintMessage: "Wrap your <h1> in an opening and closing <header></header> tag.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "header h1" },
        successMessage: "Your <h1> is correctly inside the header.",
        failureMessage: "Your <h1> should live inside the <header>.",
        hintMessage: "Move the <h1> tag so it's between <header> and </header>.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "main p" },
        successMessage: "Main content found.",
        failureMessage: "Add a <main> tag containing at least one <p>.",
        hintMessage: "Wrap your welcome paragraph in <main></main>.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "footer" },
        successMessage: "Footer looks good.",
        failureMessage: "Add a <footer> tag around your copyright line.",
        hintMessage: "Wrap the © line in <footer></footer>.",
      },
    ],
  });

  await upsertLesson({
    moduleId: module11.id,
    slug: "headings-and-paragraphs",
    title: "Headings & Paragraphs",
    orderIndex: 2,
    instructionsMarkdown: `## Structure content with semantic headings and a paragraph

1. Add an \`<h1>\` with the page title.
2. Add an \`<h2>\` subheading below it.
3. Write a short \`<p>\` paragraph describing the page.`,
    starterCodeHtml: `<h1>Welcome</h1>\n<h2>My first web page</h2>\n<p>\n  Edit this code and watch the preview update instantly on the right.\n</p>`,
    starterCodeCss: "",
    starterCodeJs: "",
    solutionCodeHtml: `<h1>Welcome</h1>\n<h2>My first web page</h2>\n<p>Edit this code and watch the preview update instantly on the right.</p>`,
    solutionCodeCss: "",
    solutionCodeJs: "",
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "h1" },
        successMessage: "Add an <h1> heading — done!",
        failureMessage: "Add an <h1> heading.",
        hintMessage: "An <h1> is just <h1>Your Title</h1>.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "h2" },
        successMessage: "Subheading found.",
        failureMessage: "Add an <h2> subheading below your <h1>.",
        hintMessage: "Add <h2>...</h2> right after your <h1>.",
      },
      {
        type: "TEXT_CONTAINS",
        config: { selector: "p", text: "e", caseSensitive: false },
        successMessage: "Your paragraph has real content.",
        failureMessage: "Add a <p> with a short sentence describing the page.",
        hintMessage: "A <p> tag just needs some words inside it, like <p>This is my page.</p>.",
      },
    ],
  });

  await upsertLesson({
    moduleId: module11.id,
    slug: "lists-and-links",
    title: "Lists & Links",
    orderIndex: 3,
    instructionsMarkdown: `## Group items and link to other pages

1. Create a \`<ul>\` with at least 2 \`<li>\` items.
2. Add an \`<a>\` link with a real \`href\` inside one of your list items.`,
    starterCodeHtml: `<ul>\n  <li>Item 1</li>\n</ul>`,
    starterCodeCss: "",
    starterCodeJs: "",
    solutionCodeHtml: `<ul>\n  <li>Item 1</li>\n  <li><a href="https://example.com">Item 2 — visit example.com</a></li>\n</ul>`,
    solutionCodeCss: "",
    solutionCodeJs: "",
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "ul" },
        successMessage: "Found your <ul>.",
        failureMessage: "Add a <ul> list.",
        hintMessage: "Start with <ul></ul> and put <li> items inside.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "ul li:nth-child(2)" },
        successMessage: "At least 2 list items — nice.",
        failureMessage: "Add at least 2 <li> items inside your <ul>.",
        hintMessage: "Copy your first <li>...</li> and change the text for a second one.",
      },
      {
        type: "ATTRIBUTE_MATCH",
        config: { selector: "a", attribute: "href", contains: "http" },
        successMessage: "Your link has a real href — well done.",
        failureMessage: "Add an <a> tag with an href starting with http:// or https://.",
        hintMessage: 'Try <a href="https://example.com">link text</a>.',
      },
    ],
  });

  // =================================================================
  // MODULE 1.2 — Forms & Accessibility (2 lessons)
  // =================================================================
  await upsertLesson({
    moduleId: module12.id,
    slug: "building-a-basic-form",
    title: "Building a Basic Form",
    orderIndex: 1,
    instructionsMarkdown: `## Build a simple contact form

1. Add a \`<form>\` element.
2. Inside it, add a text \`<input>\` with \`type="text"\`.
3. Add a \`<button>\` to submit the form.`,
    starterCodeHtml: `<form></form>`,
    starterCodeCss: `input, button {\n  display: block;\n  margin-top: 0.5rem;\n  padding: 0.5rem;\n}`,
    starterCodeJs: "",
    solutionCodeHtml: `<form>\n  <input type="text" placeholder="Your name" />\n  <button type="submit">Send</button>\n</form>`,
    solutionCodeCss: `input, button {\n  display: block;\n  margin-top: 0.5rem;\n  padding: 0.5rem;\n}`,
    solutionCodeJs: "",
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "form" },
        successMessage: "Form found.",
        failureMessage: "Add a <form> element.",
        hintMessage: "Start with <form></form>.",
      },
      {
        type: "ATTRIBUTE_MATCH",
        config: { selector: "form input", attribute: "type", expectedValue: "text" },
        successMessage: "Text input found inside the form.",
        failureMessage: 'Add an <input type="text"> inside your <form>.',
        hintMessage: 'Try <input type="text" placeholder="Your name" />.',
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "form button" },
        successMessage: "Submit button found.",
        failureMessage: "Add a <button> inside your <form> to submit it.",
        hintMessage: "Try <button>Send</button>.",
      },
    ],
  });

  await upsertLesson({
    moduleId: module12.id,
    slug: "accessible-labels-alt-text",
    title: "Accessible Labels & Alt Text",
    orderIndex: 2,
    instructionsMarkdown: `## Make your form and images accessible
A form field with no \`<label>\` and an image with no \`alt\` text are both invisible to screen reader users.

1. Add a \`<label>\` linked to your input via \`for\`/\`id\`.
2. Add an \`<img>\` with a descriptive \`alt\` attribute.`,
    starterCodeHtml: `<form>\n  <input type="text" id="name" />\n</form>\n<img src="https://placehold.co/100" />`,
    starterCodeCss: "",
    starterCodeJs: "",
    solutionCodeHtml: `<form>\n  <label for="name">Your name</label>\n  <input type="text" id="name" />\n</form>\n<img src="https://placehold.co/100" alt="Placeholder profile photo" />`,
    solutionCodeCss: "",
    solutionCodeJs: "",
    rules: [
      {
        type: "ATTRIBUTE_MATCH",
        config: { selector: "label", attribute: "for", expectedValue: "name" },
        successMessage: 'Your <label> is correctly linked with for="name".',
        failureMessage: 'Add a <label for="name"> that matches your input\'s id.',
        hintMessage: 'Try <label for="name">Your name</label> right before the input.',
      },
      {
        type: "ATTRIBUTE_MATCH",
        config: { selector: "img", attribute: "alt" },
        successMessage: "Your image has alt text.",
        failureMessage: "Add a descriptive alt attribute to your <img>.",
        hintMessage: 'Try alt="Placeholder profile photo".',
      },
    ],
  });

  // =================================================================
  // MODULE 2.1 — JS Fundamentals (2 lessons)
  // =================================================================
  await upsertLesson({
    moduleId: module21.id,
    slug: "variables-and-dom-text",
    title: "Variables & DOM Text",
    orderIndex: 1,
    instructionsMarkdown: `## Use JavaScript to change text on the page

1. There's a \`<p id="output">\` already in the HTML.
2. In JavaScript, select it with \`document.getElementById("output")\`.
3. Set its \`.textContent\` to your name (or any greeting).`,
    starterCodeHtml: `<p id="output">Nothing here yet.</p>`,
    starterCodeCss: "",
    starterCodeJs: `// Select the #output paragraph and change its text`,
    solutionCodeHtml: `<p id="output">Nothing here yet.</p>`,
    solutionCodeCss: "",
    solutionCodeJs: `const output = document.getElementById("output");\noutput.textContent = "Hello from JavaScript!";`,
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "#output" },
        successMessage: "#output element found.",
        failureMessage: "Don't remove the #output paragraph — just change its text via JS.",
        hintMessage: 'Keep the <p id="output"> tag in the HTML.',
      },
    ],
  });

  await upsertLesson({
    moduleId: module21.id,
    slug: "event-listener-click-counter",
    title: "Event Listener Click Counter",
    orderIndex: 2,
    instructionsMarkdown: `## Respond to clicks with an event listener

1. There's a \`<button id="counterBtn">\` and a \`<p id="count">0</p>\` already in the HTML.
2. Add a \`click\` event listener to the button.
3. Each click, increase a counter variable and update \`#count\`'s text.`,
    starterCodeHtml: `<button id="counterBtn">Click me</button>\n<p id="count">0</p>`,
    starterCodeCss: `button {\n  padding: 0.5rem 1rem;\n}`,
    starterCodeJs: `// Add a click listener to #counterBtn that increments #count`,
    solutionCodeHtml: `<button id="counterBtn">Click me</button>\n<p id="count">0</p>`,
    solutionCodeCss: `button {\n  padding: 0.5rem 1rem;\n}`,
    solutionCodeJs: `let count = 0;\nconst button = document.getElementById("counterBtn");\nconst display = document.getElementById("count");\n\nbutton.addEventListener("click", () => {\n  count += 1;\n  display.textContent = String(count);\n});\n\n// Simulate a click so the validator can see the counter working\nbutton.dispatchEvent(new Event("click"));`,
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "#counterBtn" },
        successMessage: "Button found.",
        failureMessage: "Keep the #counterBtn button in your HTML.",
        hintMessage: "Don't remove the button — just add a listener to it in JS.",
      },
      {
        type: "TEXT_CONTAINS",
        config: { selector: "#count", text: "1", caseSensitive: false },
        successMessage: "Your counter incremented after a click — nice.",
        failureMessage: "Your #count should update after a click — it's still showing 0.",
        hintMessage: 'Use button.addEventListener("click", () => { ... }) and update display.textContent inside it.',
      },
    ],
  });

  console.log("🌱 Seeding finished.");
}

interface RuleSeedInput {
  type: RuleType;
  config: Prisma.InputJsonObject;
  successMessage: string;
  failureMessage: string;
  hintMessage: string | null;
}

async function upsertLesson(input: {
  moduleId: string;
  slug: string;
  title: string;
  orderIndex: number;
  instructionsMarkdown: string;
  starterCodeHtml: string;
  starterCodeCss: string;
  starterCodeJs: string;
  solutionCodeHtml: string;
  solutionCodeCss: string;
  solutionCodeJs: string;
  rules: RuleSeedInput[];
}) {
  const lesson = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: input.moduleId, slug: input.slug } },
    update: {
      title: input.title,
      orderIndex: input.orderIndex,
      instructionsMarkdown: input.instructionsMarkdown,
      starterCodeHtml: input.starterCodeHtml,
      starterCodeCss: input.starterCodeCss,
      starterCodeJs: input.starterCodeJs,
      solutionCodeHtml: input.solutionCodeHtml,
      solutionCodeCss: input.solutionCodeCss,
      solutionCodeJs: input.solutionCodeJs,
    },
    create: {
      moduleId: input.moduleId,
      slug: input.slug,
      title: input.title,
      orderIndex: input.orderIndex,
      instructionsMarkdown: input.instructionsMarkdown,
      starterCodeHtml: input.starterCodeHtml,
      starterCodeCss: input.starterCodeCss,
      starterCodeJs: input.starterCodeJs,
      solutionCodeHtml: input.solutionCodeHtml,
      solutionCodeCss: input.solutionCodeCss,
      solutionCodeJs: input.solutionCodeJs,
    },
  });

  // Re-seed rules idempotently: clear and recreate for this lesson.
  await prisma.validationRule.deleteMany({ where: { lessonId: lesson.id } });
  await prisma.validationRule.createMany({
    data: input.rules.map((rule, index) => ({
      lessonId: lesson.id,
      orderIndex: index + 1,
      type: rule.type,
      config: rule.config,
      successMessage: rule.successMessage,
      failureMessage: rule.failureMessage,
      hintMessage: rule.hintMessage,
    })),
  });

  console.log(`  ✅ Lesson: ${input.title}`);
  return lesson;
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });