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
    update: {
      title: "HTML Structure & Semantics",
      description: "Learn how to structure a page with meaningful markup, forms, and accessibility.",
    },
    create: {
      trackId: track1.id,
      title: "HTML Structure & Semantics",
      slug: "html-structure-semantics",
      description: "Learn how to structure a page with meaningful markup, forms, and accessibility.",
      orderIndex: 1,
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
      orderIndex: 3,
      published: true,
    },
  });

 // ===============================================================
// MODULE 2.1 — JS Core Logic
// ===============================================================
const module21 = await prisma.module.upsert({
  where: { trackId_slug: { trackId: track2.id, slug: "js-core-logic" } },
  update: {
    title: "JS Core Logic",
    description: "Master variables, conditionals, arrays, functions, and loops.",
  },
  create: {
    trackId: track2.id,
    title: "JS Core Logic",
    slug: "js-core-logic",
    description: "Master variables, conditionals, arrays, functions, and loops.",
    orderIndex: 1,
    published: true,
  },
});

// ===============================================================
// MODULE 2.2 — DOM & Interactive Scripting
// ===============================================================
const module22 = await prisma.module.upsert({
  where: { trackId_slug: { trackId: track2.id, slug: "dom-interactive-scripting" } },
  update: {
    title: "DOM & Interactive Scripting",
    description: "Build dynamic web pages with event listeners, click counters, and forms.",
  },
  create: {
    trackId: track2.id,
    title: "DOM & Interactive Scripting",
    slug: "dom-interactive-scripting",
    description: "Build dynamic web pages with event listeners, click counters, and forms.",
    orderIndex: 2,
    published: true,
  },
});

  // ===============================================================
// TRACK 3: CSS Styling & Layout
// ===============================================================
const track3 = await prisma.track.upsert({
  where: { slug: "css-styling-layout" },
  update: {},
  create: {
    title: "CSS Styling & Layout",
    slug: "css-styling-layout",
    description: "Master visual styling, typography, colors, and responsive layouts with CSS Flexbox.",
    orderIndex: 2,
    published: true,
  },
});

const module31 = await prisma.module.upsert({
  where: { trackId_slug: { trackId: track3.id, slug: "css-basics-layout" } },
  update: {
    title: "CSS Styling & Layout",
    description: "Learn selectors, colors, typography, and box model spacing to style web pages.",
  },
  create: {
    trackId: track3.id,
    title: "CSS Styling & Layout",
    slug: "css-basics-layout",
    description: "Learn selectors, colors, typography, and box model spacing to style web pages.",
    orderIndex: 1,
    published: true,
  },
});

const module32 = await prisma.module.upsert({
  where: { trackId_slug: { trackId: track3.id, slug: "flexbox-modern-layouts" } },
  update: {
    title: "CSS Flexbox & Modern Layouts",
    description: "Build flexible, responsive interfaces using CSS Flexbox and navigation components.",
  },
  create: {
    trackId: track3.id,
    title: "CSS Flexbox & Modern Layouts",
    slug: "flexbox-modern-layouts",
    description: "Build flexible, responsive interfaces using CSS Flexbox and navigation components.",
    orderIndex: 2,
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
    moduleId: module11.id,
    slug: "building-a-basic-form",
    title: "Building a Basic Form",
    orderIndex: 4,
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
    moduleId: module11.id,
    slug: "accessible-labels-alt-text",
    title: "Accessible Labels & Alt Text",
    orderIndex: 5,
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
  // MODULE 3.1 — CSS Styling & Layout
  // =================================================================
  await upsertLesson({
    moduleId: module31.id,
    slug: "introduction-to-css",
    title: "Introduction to CSS Selectors",
    orderIndex: 1,
    instructionsMarkdown: `## What is CSS?
HTML gives your page structure, but **CSS (Cascading Style Sheets)** gives it style, colors, and layout.

### How a CSS Rule Works
A CSS rule consists of a **selector** and a **declaration block**:
\`\`\`css
selector {
  property: value;
}
\`\`\`
- **Selector**: Tells the browser *which* HTML element to style (e.g., \`p\` for paragraphs).
- **Property & Value**: Inside the curly braces \`{}\`, you specify what to change (like \`color: blue;\`).

### Instructions
1. In the **Styles** tab, write a CSS selector targeting all \`<p>\` elements.
2. Inside the curly braces, set the \`color\` property to \`blue\`.`,
    starterCodeHtml: `<p>Hello world! Make me blue with CSS.</p>`,
    starterCodeCss: `/* Write your CSS selector and styles here */`,
    starterCodeJs: "",
    solutionCodeHtml: `<p>Hello world! Make me blue with CSS.</p>`,
    solutionCodeCss: `p {\n  color: blue;\n}`,
    solutionCodeJs: "",
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "p" },
        successMessage: "Found your paragraph element.",
        failureMessage: "Make sure you have a <p> element in your HTML tab.",
        hintMessage: "Keep the <p> tag intact in your HTML.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "p" }, // Validates the element is present and styled
        successMessage: "Your CSS selector successfully targets the paragraph — excellent!",
        failureMessage: "Make sure your CSS selector targets the paragraph.",
        hintMessage: "Use 'p { color: blue; }' in your styles.css tab.",
      },
    ],
  });
  // =================================================================
  // MODULE 3.1 — CSS Styling & Layout (Lessons 1, 2, 2)
  // =================================================================

  // --- Lesson 2: Colors & Backgrounds ---
  await upsertLesson({
    moduleId: module31.id,
    slug: "colors-and-backgrounds",
    title: "Colors & Backgrounds",
    orderIndex: 2,
    instructionsMarkdown: `## Bringing Color to Your Website

Colors set the tone and mood of your web page. 

In CSS, you can style text colors using the \`color\` property and background colors using the \`background-color\` property.


### Popular Ways to Define Color

- **Color Names**: Simple English words like \`red\`, \`blue\`, or \`tomato\`.
- **HEX Codes**: Six-character codes starting with a hashtag, such as \`#3b82f6\` or \`#ffffff\`.


### Instructions

1. Target the \`<body>\` element in your **Styles** tab.

2. Set its \`background-color\` to \`#1e293b\`.

3. Target all \`<p>\` elements and set their text \`color\` to \`#94a3b8\`.`,
    starterCodeHtml: `<body>\n  <h1>Welcome to Styling</h1>\n  <p>This is a paragraph description.</p>\n</body>`,
    starterCodeCss: `/* Style your body and paragraphs here */`,
    starterCodeJs: "",
    solutionCodeHtml: `<body>\n  <h1>Welcome to Styling</h1>\n  <p>This is a paragraph description.</p>\n</body>`,
    solutionCodeCss: `body {\n  background-color: #1e293b;\n}\n\np {\n  color: #94a3b8;\n}`,
    solutionCodeJs: "",
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "body" },
        successMessage: "Body element found.",
        failureMessage: "Keep the body element in your HTML.",
        hintMessage: "Do not delete the <body> tag.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "body" },
        successMessage: "Colors applied successfully — looking great!",
        failureMessage: "Check your background and text color properties.",
        hintMessage: "Use 'body { background-color: #1e293b; }' and 'p { color: #94a3b8; }'.",
      },
    ],
  });

  // --- Lesson 3: Fonts & Typography ---
  await upsertLesson({
    moduleId: module31.id,
    slug: "fonts-and-typography",
    title: "Fonts & Typography",
    orderIndex: 3,
    instructionsMarkdown: `## Controlling Text with Typography

Readable text is essential for any good web page. 

CSS gives you full control over text sizing, font families, and letter styling.


### Key Typography Properties

- **\`font-family\`**: Changes the typeface (e.g., \`sans-serif\`, \`serif\`, \`monospace\`).
- **\`font-size\`**: Controls how big the text appears (e.g., \`16px\` or \`1.5rem\`).
- **\`font-weight\`**: Controls how bold text looks (e.g., \`bold\` or \`400\`).


### Instructions

1. Target all \`<h1>\` headings in your **Styles** tab.

2. Set the \`font-size\` property to \`2.5rem\`.

3. Set the \`font-weight\` property to \`bold\`.`,
    starterCodeHtml: `<h1>Typography Matters</h1>\n<p>Good fonts make content easy to read.</p>`,
    starterCodeCss: `/* Style your headings here */`,
    starterCodeJs: "",
    solutionCodeHtml: `<h1>Typography Matters</h1>\n<p>Good fonts make content easy to read.</p>`,
    solutionCodeCss: `h1 {\n  font-size: 2.5rem;\n  font-weight: bold;\n}`,
    solutionCodeJs: "",
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "h1" },
        successMessage: "Heading element found.",
        failureMessage: "Make sure you have an <h1> element.",
        hintMessage: "Keep the <h1> tag in your HTML.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "h1" },
        successMessage: "Typography styles applied correctly!",
        failureMessage: "Set font-size to 2.5rem and font-weight to bold on your <h1>.",
        hintMessage: "Use 'h1 { font-size: 2.5rem; font-weight: bold; }'.",
      },
    ],
  });

  // --- Lesson 4: Margins & Padding (The Box Model) ---
  await upsertLesson({
    moduleId: module31.id,
    slug: "margins-and-padding",
    title: "Margins & Padding",
    orderIndex: 4,
    instructionsMarkdown: `## Understanding Spacing: Margins and Padding

Every element on a web page is wrapped in a box. 

To keep your layout clean, you need to control the space inside and outside those boxes.


### The Two Spacing Tools

- **Padding**: Creates space *inside* an element, between its content and its border.
- **Margin**: Creates space *outside* an element, pushing other elements away from it.


### Instructions

1. Target the box element with the class \`.card\`.

2. Add a \`padding\` of \`20px\` so the text has breathing room inside the box.

3. Add a \`margin-bottom\` of \`15px\` to separate it from items below it.`,
    starterCodeHtml: `<div class=\"card\">\n  <h3>Card Title</h3>\n  <p>This is a padded card component.</p>\n</div>`,
    starterCodeCss: `.card {\n  background: #334155;\n  color: white;\n  /* Add padding and margin here */\n}`,
    starterCodeJs: "",
    solutionCodeHtml: `<div class=\"card\">\n  <h3>Card Title</h3>\n  <p>This is a padded card component.</p>\n</div>`,
    solutionCodeCss: `.card {\n  background: #334155;\n  color: white;\n  padding: 20px;\n  margin-bottom: 15px;\n}`,
    solutionCodeJs: "",
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: ".card" },
        successMessage: "Card element found.",
        failureMessage: "Make sure you have a .card element.",
        hintMessage: "Do not alter the HTML class name.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: ".card" },
        successMessage: "Spacing rules applied correctly — fantastic job!",
        failureMessage: "Make sure your .card has padding: 20px and margin-bottom: 15px.",
        hintMessage: "Check your spacing properties inside the .card class block.",
      },
    ],
  });
  // =================================================================
  // MODULE 1.4 — CSS Flexbox & Modern Layouts (3 lessons)
  // =================================================================
  // --- Lesson 1: Introduction to Flexbox ---
  await upsertLesson({
    moduleId: module32.id,
    slug: "introduction-to-flexbox",
    title: "Introduction to Flexbox",
    orderIndex: 1,
    instructionsMarkdown: `## What is Flexbox?
By default, HTML elements stack vertically or line up awkwardly. **Flexbox** (Flexible Box Layout) is a powerful CSS tool designed to lay out, align, and distribute space among items in a container effortlessly.

### How to Turn on Flexbox
To use Flexbox, you must target a parent container and set its display property:
\`\`\`css
.container {
  display: flex;
}
\`\`\`
- **Parent Container**: The box holding the items.
- **Flex Items**: The direct children inside the container that automatically become flexible.

### Instructions
1. Target the container with the class \`.container\` in your **Styles** tab.
2. Set its \`display\` property to \`flex\`.`,
    starterCodeHtml: `<div class="container">\n  <div class="box">Item 1</div>\n  <div class="box">Item 2</div>\n  <div class="box">Item 3</div>\n</div>`,
    starterCodeCss: `.container {\n  /* Make this container flexible */\n}\n\n.box {\n  background: #3b82f6;\n  color: white;\n  padding: 1rem;\n}`,
    starterCodeJs: "",
    solutionCodeHtml: `<div class="container">\n  <div class="box">Item 1</div>\n  <div class="box">Item 2</div>\n  <div class="box">Item 3</div>\n</div>`,
    solutionCodeCss: `.container {\n  display: flex;\n}\n\n.box {\n  background: #3b82f6;\n  color: white;\n  padding: 1rem;\n}`,
    solutionCodeJs: "",
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: ".container" },
        successMessage: "Found your container element.",
        failureMessage: "Make sure you have a element with class 'container'.",
        hintMessage: "Keep the HTML structure intact.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: ".container" },
        successMessage: "Flexbox container activated successfully!",
        failureMessage: "Set display to flex on the container.",
        hintMessage: "Use '.container { display: flex; }' in your styles tab.",
      },
    ],
  });

  // --- Lesson 2: Aligning & Spacing Items ---
  await upsertLesson({
    moduleId: module32.id,
    slug: "aligning-and-spacing-items",
    title: "Aligning & Spacing Items",
    orderIndex: 2,
    instructionsMarkdown: `## Spacing Items with \`justify-content\`
Once a container is set to \`display: flex\`, you can control how items are spaced along the main horizontal line using **\`justify-content\`**.

### Common Values:
- \`flex-start\`: Packs items to the left.
- \`center\`: Groups items tightly in the middle.
- \`space-between\`: Pushes items to opposite edges with equal spacing between them.
- \`space-around\`: Puts equal space *around* all items.

### Instructions
1. Ensure your container is a flexbox (\`display: flex\`).
2. Add \`justify-content: space-between;\` to spread your items evenly across the width.`,
    starterCodeHtml: `<div class="container">\n  <div class="box">Left</div>\n  <div class="box">Middle</div>\n  <div class="box">Right</div>\n</div>`,
    starterCodeCss: `.container {\n  display: flex;\n  /* Add spacing here */\n}\n\n.box {\n  background: #10b981;\n  color: white;\n  padding: 0.75rem 1.5rem;\n}`,
    starterCodeJs: "",
    solutionCodeHtml: `<div class="container">\n  <div class="box">Left</div>\n  <div class="box">Middle</div>\n  <div class="box">Right</div>\n</div>`,
    solutionCodeCss: `.container {\n  display: flex;\n  justify-content: space-between;\n}\n\n.box {\n  background: #10b981;\n  color: white;\n  padding: 0.75rem 1.5rem;\n}`,
    solutionCodeJs: "",
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: ".container" },
        successMessage: "Container found.",
        failureMessage: "Missing container element.",
        hintMessage: "Do not alter the HTML structure.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: ".container" },
        successMessage: "Items spaced out correctly with justify-content!",
        failureMessage: "Add justify-content: space-between to your container.",
        hintMessage: "Type justify-content: space-between; inside your .container block.",
      },
    ],
  });

  // --- Lesson 3: Building a Navigation Bar ---
  await upsertLesson({
    moduleId: module32.id,
    slug: "building-a-navigation-bar",
    title: "Building a Navigation Bar",
    orderIndex: 3,
    instructionsMarkdown: `## Putting Flexbox to Work: Navbars
One of the most common real-world uses for Flexbox is building website navigation bars. 

By combining \`display: flex\` and \`justify-content: space-between\`, you can instantly push your website logo to the far left and your navigation links to the far right.

### Instructions
1. Style the \`nav\` element with \`display: flex\`.
2. Use \`justify-content: space-between\` to push the logo and links apart.
3. Vertically center the contents using \`align-items: center\`.`,
    starterCodeHtml: `<nav class="navbar">\n  <div class="logo">CodeTopiaZ</div>\n  <div class="nav-links">\n    <a href="#">Courses</a>\n    <a href="#">About</a>\n  </div>\n</nav>`,
    starterCodeCss: `.navbar {\n  background: #1e293b;\n  padding: 1rem;\n  /* Add flexbox properties here */\n}\n\n.logo, .nav-links a {\n  color: white;\n  text-decoration: none;\n}`,
    starterCodeJs: "",
    solutionCodeHtml: `<nav class="navbar">\n  <div class="logo">CodeTopiaZ</div>\n  <div class="nav-links">\n    <a href="#">Courses</a>\n    <a href="#">About</a>\n  </div>\n</nav>`,
    solutionCodeCss: `.navbar {\n  background: #1e293b;\n  padding: 1rem;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.logo, .nav-links a {\n  color: white;\n  text-decoration: none;\n}`,
    solutionCodeJs: "",
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: ".navbar" },
        successMessage: "Navbar element found.",
        failureMessage: "Missing navbar element.",
        hintMessage: "Keep the HTML markup intact.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: ".navbar" },
        successMessage: "Navbar styled and aligned like a professional developer — awesome work!",
        failureMessage: "Make sure your navbar uses display: flex and justify-content: space-between.",
        hintMessage: "Check your CSS properties inside the .navbar class.",
      },
    ],
  });
  // =================================================================
  // MODULE 2.1 — JS Fundamentals (Complete 7 Lessons)
  // =================================================================
  // --- Lesson 1: Variables & DOM Text ---
  await upsertLesson({
    moduleId: module21.id,
    slug: "variables-and-dom-text",
    title: "Variables & DOM Text",
    orderIndex: 1,
    instructionsMarkdown: `## What is JavaScript?

While HTML gives a web page its structure and CSS gives it style, **JavaScript (JS)** adds behavior, logic, and interactivity. 


### Storing Data in Variables

A variable acts as a container for storing data values in your code. 

In modern JavaScript, we declare variables using the \`const\` or \`let\` keywords:
\`\`\`javascript
let greeting = "Hello, world!";
const maxScore = 100;
\`\`\`


### Interacting with the DOM

JavaScript can communicate directly with your HTML page using the **Document Object Model (DOM)**. 

You can select elements and change their text dynamically using \`.textContent\`:
\`\`\`javascript
document.getElementById("output").textContent = "New text!";
\`\`\`


### Instructions

1. There is an existing \`<p id="output">\` element in your HTML tab.

2. In your JavaScript tab, use \`document.getElementById("output")\` to select it.

3. Update its \`.textContent\` property to display your name or a custom greeting.`,
    starterCodeHtml: `<p id="output">Nothing here yet.</p>`,
    starterCodeCss: "",
    starterCodeJs: `// Select the #output paragraph and change its text here`,
    solutionCodeHtml: `<p id="output">Nothing here yet.</p>`,
    solutionCodeCss: "",
    solutionCodeJs: `const output = document.getElementById("output");\noutput.textContent = "Hello from JavaScript!";`,
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "#output" },
        successMessage: "#output element found successfully.",
        failureMessage: "Don't remove the #output paragraph — just change its text via JS.",
        hintMessage: 'Keep the <p id="output"> tag intact in your HTML tab.',
      },
    ],
  });

  // --- Lesson 2: Event Listener Click Counter ---
  await upsertLesson({
    moduleId: module21.id,
    slug: "event-listener-click-counter",
    title: "Event Listener Click Counter",
    orderIndex: 2,
    instructionsMarkdown: `## Responding to User Actions

Websites become truly alive when they respond to user actions like clicks, scrolls, or keypresses. 


### What is an Event Listener?

An **event listener** waits for a specific action to happen on an HTML element and runs a block of code when it occurs:
\`\`\`javascript
button.addEventListener("click", function() {
  // Code to run when the button is clicked
});
\`\`\`


### Tracking State and Updating Display

To build an interactive counter, you create a variable to track the number of clicks, increase it inside the event listener, and update the screen:
\`\`\`javascript
let count = 0;
count += 1;
display.textContent = count;
\`\`\`


### Instructions

1. There is a button with id \`#counterBtn\` and a display paragraph with id \`#count\` in your HTML.

2. Add a \`"click"\` event listener to your button.

3. Inside your listener function, increase a counter variable and update \`#count\`'s text content.`,
    starterCodeHtml: `<button id="counterBtn">Click me</button>\n<p id="count">0</p>`,
    starterCodeCss: `button {\n  padding: 0.5rem 1rem;\n  background: #3b82f6;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n}`,
    starterCodeJs: `// Add a click listener to #counterBtn that increments #count`,
    solutionCodeHtml: `<button id="counterBtn">Click me</button>\n<p id="count">0</p>`,
    solutionCodeCss: `button {\n  padding: 0.5rem 1rem;\n  background: #3b82f6;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n}`,
    solutionCodeJs: `let count = 0;\nconst button = document.getElementById("counterBtn");\nconst display = document.getElementById("count");\n\nbutton.addEventListener("click", () => {\n  count += 1;\n  display.textContent = String(count);\n});\n\nbutton.dispatchEvent(new Event("click"));`,
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "#counterBtn" },
        successMessage: "Button element found.",
        failureMessage: "Keep the #counterBtn button in your HTML.",
        hintMessage: "Don't remove the button — just add a listener to it in JavaScript.",
      },
      {
        type: "TEXT_CONTAINS",
        config: { selector: "#count", text: "1", caseSensitive: false },
        successMessage: "Your counter incremented correctly — excellent work!",
        failureMessage: "Your #count should update after a click.",
        hintMessage: 'Use button.addEventListener("click", () => { ... }) and update display.textContent.',
      },
    ],
  });

// --- Lesson 3: Conditionals & Logic ---
  await upsertLesson({
    moduleId: module21.id,
    slug: "conditionals-and-logic",
    title: "Conditionals & Logic",
    orderIndex: 3,
    instructionsMarkdown: "## Making Decisions in Code\n\nPrograms often need to make decisions based on different conditions.\n\n### The `if / else` Statement\n\nAn `if` statement checks whether a specific condition is true.\n\nIf it is, it runs one block of code; otherwise, it runs the alternative `else` block:\n```javascript\nlet score = 85;\n\nif (score >= 50) {\n  console.log(\"Passed!\");\n} else {\n  console.log(\"Try again!\");\n}\n```\n\n### Comparison Operators\n\n- `>` (Greater than)\n\n- `<` (Less than)\n\n- `===` (Strictly equal to)\n\n### Instructions\n\n1. Create a variable named `score` and set it to `75`.\n\n2. Write an `if/else` statement checking if `score` is greater than or equal to `60`.\n\n3. Display `\"You passed!\"` or `\"Keep trying!\"` in the paragraph element with the id `#scoreText`.",
    starterCodeHtml: '<div id="resultBox">\n  <p id="scoreText">Checking score...</p>\n</div>',
    starterCodeCss: 'body {\n  font-family: sans-serif;\n  padding: 2rem;\n  background: #0f172a;\n  color: white;\n}',
    starterCodeJs: '// Write your conditional logic here\n',
    solutionCodeHtml: '<div id="resultBox">\n  <p id="scoreText">Checking score...</p>\n</div>',
    solutionCodeCss: 'body {\n  font-family: sans-serif;\n  padding: 2rem;\n  background: #0f172a;\n  color: white;\n}',
    solutionCodeJs: 'let score = 75;\nconst textEl = document.querySelector("#scoreText");\n\nif (score >= 60) {\n  textEl.textContent = "You passed!";\n} else {\n  textEl.textContent = "Keep trying!";\n}',
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "#scoreText" },
        successMessage: "Score text element found.",
        failureMessage: "Make sure your HTML includes <p id=\"scoreText\">.",
        hintMessage: "Keep the scoreText ID intact.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "#scoreText" },
        successMessage: "Conditional logic evaluated successfully — brilliant programming!",
        failureMessage: "Make sure your if/else statement updates the text element.",
        hintMessage: "Check your conditional syntax in the JavaScript tab.",
      },
    ],
  });

  // --- Lesson 4: Working with Arrays ---
  await upsertLesson({
    moduleId: module21.id,
    slug: "working-with-arrays",
    title: "Working with Arrays",
    orderIndex: 4,
    instructionsMarkdown: `## Storing Multiple Items in Arrays

So far, variables have stored a single value at a time. 

When you want to store a list of multiple items in a single variable, you use an **Array**.


### What is an Array?

An array is an ordered list enclosed in square brackets \`[]\`, where items are separated by commas:
\`\`\`javascript
let languages = ["HTML", "CSS", "JavaScript"];
\`\`\`


### Accessing Items by Index

JavaScript arrays are **zero-indexed**, meaning the first item starts at index \`0\`:
\`\`\`javascript
let firstItem = languages[0]; // Gets "HTML"
\`\`\`


### Instructions

1. Create an array named \`codingSkills\` containing three string items: \`"HTML"\`, \`"CSS"\`, and \`"JavaScript"\`.

2. Select the paragraph element with the id \`#arrayOutput\`.

3. Display the first item of your array (\`codingSkills[0]\`) inside the paragraph's textContent.`,
    starterCodeHtml: `<div id="card">\n  <p id="arrayOutput">Loading skill...</p>\n</div>`,
    starterCodeCss: `body {\n  font-family: sans-serif;\n  padding: 2rem;\n  background: #0f172a;\n  color: white;\n}`,
    starterCodeJs: `// Declare your array and display an item here\n`,
    solutionCodeHtml: `<div id="card">\n  <p id="arrayOutput">Loading skill...</p>\n</div>`,
    solutionCodeCss: `body {\n  font-family: sans-serif;\n  padding: 2rem;\n  background: #0f172a;\n  color: white;\n}`,
    solutionCodeJs: `let codingSkills = ["HTML", "CSS", "JavaScript"];\ndocument.querySelector("#arrayOutput").textContent = codingSkills[0];`,
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "#arrayOutput" },
        successMessage: "Output element found.",
        failureMessage: "Make sure your HTML includes <p id=\"arrayOutput\">.",
        hintMessage: "Keep the arrayOutput ID intact.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "#arrayOutput" },
        successMessage: "Array initialized and accessed successfully — great work!",
        failureMessage: "Make sure you assign the array item to the paragraph textContent.",
        hintMessage: "Use 'let codingSkills = [\"HTML\", \"CSS\", \"JavaScript\"]; document.querySelector(\"#arrayOutput\").textContent = codingSkills[0];'.",
      },
    ],
  });

  // --- Lesson 5: Writing Functions ---
  await upsertLesson({
    moduleId: module21.id,
    slug: "writing-functions",
    title: "Writing Functions",
    orderIndex: 5,
    instructionsMarkdown: `## Reusable Logic with Functions

Writing the same code over and over is inefficient. 

A **function** is a reusable block of code designed to perform a specific task whenever it is called.


### Declaring and Calling Functions

You define a function using the \`function\` keyword, and then you call it by name:
\`\`\`javascript
function sayHello() {
  console.log("Hello from CodeTopiaZ!");
}

sayHello(); // Runs the code inside the function
\`\`\`


### Passing Parameters

You can also pass data into functions using **parameters** to make them dynamic:
\`\`\`javascript
function greetUser(name) {
  return "Welcome back, " + name;
}
\`\`\`


### Instructions

1. Create a function named \`calculateTotal\` that takes two numbers (\`a\` and \`b\`) as parameters and returns their sum (\`a + b\`).

2. Call the function with values \`10\` and \`25\`.

3. Display the returned result inside the paragraph element with the id \`#funcOutput\`.`,
    starterCodeHtml: `<div id="card">\n  <p id="funcOutput">Calculating...</p>\n</div>`,
    starterCodeCss: `body {\n  font-family: sans-serif;\n  padding: 2rem;\n  background: #0f172a;\n  color: white;\n}`,
    starterCodeJs: `// Write your function here\n`,
    solutionCodeHtml: `<div id="card">\n  <p id="funcOutput">Calculating...</p>\n</div>`,
    solutionCodeCss: `body {\n  font-family: sans-serif;\n  padding: 2rem;\n  background: #0f172a;\n  color: white;\n}`,
    solutionCodeJs: `function calculateTotal(a, b) {\n  return a + b;\n}\n\nlet total = calculateTotal(10, 25);\ndocument.querySelector("#funcOutput").textContent = "Total: " + total;`,
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "#funcOutput" },
        successMessage: "Function output element found.",
        failureMessage: "Make sure your HTML includes <p id=\"funcOutput\">.",
        hintMessage: "Keep the funcOutput ID intact.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "#funcOutput" },
        successMessage: "Function written and executed successfully — expert coding!",
        failureMessage: "Make sure your function returns the sum and updates the DOM text.",
        hintMessage: "Check your function syntax and parameters in the JavaScript tab.",
      },
    ],
  });

  // --- Lesson 6: Loops & Repetition ---
  await upsertLesson({
    moduleId: module22.id,
    slug: "loops-and-repetition",
    title: "Loops & Repetition",
    orderIndex: 1,
    instructionsMarkdown: `## Automating Tasks with Loops

When you need to repeat a block of code multiple times, writing it manually is tedious. 

**Loops** automate repetitive tasks instantly.


### The \`for\` Loop

A standard \`for\` loop runs a block of code a set number of times:
\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log("Current count is: " + i);
}
\`\`\`


### Breaking Down the Loop Syntax

- **Initialization (\`let i = 0;\`)**: Sets up a counter variable.

- **Condition (\`i < 5;\`)**: Keeps the loop running as long as this is true.

- **Increment (\`i++\`)**: Increases the counter after each cycle.


### Instructions

1. Use a \`for\` loop to count from \`1\` up to \`3\`.

2. Construct a text string showing the loop counting.

3. Display the final result inside the paragraph element with the id \`#loopOutput\`.`,
    starterCodeHtml: `<div id="card">\n  <p id="loopOutput">Running loop...</p>\n</div>`,
    starterCodeCss: `body {\n  font-family: sans-serif;\n  padding: 2rem;\n  background: #0f172a;\n  color: white;\n}`,
    starterCodeJs: `// Write your loop here\n`,
    solutionCodeHtml: `<div id="card">\n  <p id="loopOutput">Running loop...</p>\n</div>`,
    solutionCodeCss: `body {\n  font-family: sans-serif;\n  padding: 2rem;\n  background: #0f172a;\n  color: white;\n}`,
    solutionCodeJs: `let result = "";\nfor (let i = 1; i <= 3; i++) {\n  result += "Step " + i + " ";\n}\ndocument.querySelector("#loopOutput").textContent = result;`,
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "#loopOutput" },
        successMessage: "Loop output element found.",
        failureMessage: "Make sure your HTML includes <p id=\"loopOutput\">.",
        hintMessage: "Keep the loopOutput ID intact.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "#loopOutput" },
        successMessage: "Loop executed successfully — powerful automation!",
        failureMessage: "Make sure your loop runs properly and updates the DOM text.",
        hintMessage: "Check your for loop structure in the JavaScript tab.",
      },
    ],
  });

  // --- Lesson 7: Interactive Input Forms ---
  await upsertLesson({
    moduleId: module22.id,
    slug: "interactive-input-forms",
    title: "Interactive Input Forms",
    orderIndex: 2,
    instructionsMarkdown: `## Reading User Input in Real-Time

Web applications thrive on user input, such as text typed into search boxes or form fields. 


### Accessing Input Values

You can grab what a user types by accessing the \`.value\` property of an input element:
\`\`\`javascript
let userInput = document.querySelector("#myInput").value;
\`\`\`


### Combining Events and Inputs

By listening for user actions, you can read input values dynamically the moment they interact with the page.


### Instructions

1. Select the input field with the id \`#nameInput\`.

2. Read its \`.value\` property.

3. Display a personalized greeting incorporating that value inside the paragraph with the id \`#greetOutput\`.`,
    starterCodeHtml: `<input type="text" id="nameInput" value="Abigail" />\n<p id="greetOutput">Greeting will appear here...</p>`,
    starterCodeCss: `body {\n  font-family: sans-serif;\n  padding: 2rem;\n  background: #0f172a;\n  color: white;\n}\ninput {\n  padding: 8px;\n  border-radius: 4px;\n  border: 1px solid #cbd5e1;\n}`,
    starterCodeJs: `// Read the input value and display it\n`,
    solutionCodeHtml: `<input type="text" id="nameInput" value="Abigail" />\n<p id="greetOutput">Greeting will appear here...</p>`,
    solutionCodeCss: `body {\n  font-family: sans-serif;\n  padding: 2rem;\n  background: #0f172a;\n  color: white;\n}\ninput {\n  padding: 8px;\n  border-radius: 4px;\n  border: 1px solid #cbd5e1;\n}`,
    solutionCodeJs: `let nameValue = document.querySelector("#nameInput").value;\ndocument.querySelector("#greetOutput").textContent = "Hello, " + nameValue + "!";`,
    rules: [
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "#nameInput" },
        successMessage: "Input element found.",
        failureMessage: "Make sure your HTML includes an input with id 'nameInput'.",
        hintMessage: "Keep the nameInput ID intact.",
      },
      {
        type: "DOM_ELEMENT_EXISTS",
        config: { selector: "#nameInput" },
        successMessage: "User input read successfully — amazing dynamic web app feature!",
        failureMessage: "Make sure you read the input value and update the greeting output.",
        hintMessage: "Use 'document.querySelector(\"#nameInput\").value' in your JavaScript tab.",
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
  if (!lesson) {
    throw new Error(`❌ Lesson not found or failed to upsert.`);
  }
  await prisma.validationRule.createMany({
    data: input.rules.map((rule: any, index: number) => ({
      lessonId: lesson.id,
      orderIndex: index + 1,
      type: rule.type as any, // 👈 Look for this line right here
      config: rule.config ?? {},
      successMessage: rule.successMessage,
      failureMessage: rule.failureMessage,
      hintMessage: rule.hintMessage ?? null,
    })) as any,
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