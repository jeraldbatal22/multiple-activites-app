const markdownContent = `# **Welcome to Markdown Preview!**

This is a demonstration of how Markdown is rendered in a Next.js application. Markdown is an easy-to-write plain text format that can be easily converted to HTML.

## Key Features of Markdown:

- **Simple to Write**: It uses easy-to-remember syntax.
- **Readable**: Even without rendering, it is readable in plain text.
- **Portable**: Markdown files are lightweight and portable across platforms.

## 1. Text Formatting

You can format text using different Markdown elements:

### Bold Text
This is **bold** text, which is created by wrapping the text with \`**\` or \`__\`.

### Italic Text
This is *italic* text, created by wrapping the text with \`*\` or \`_\`.

### Strikethrough
This is ~~strikethrough~~ text, created using \`~~\`.

### Combined Formatting
You can combine **bold** and *italic* in one line: **_bold and italic_**.

## 2. Code Blocks

You can add both inline code and multi-line code blocks.

### Inline Code
For inline code, use single backticks: \`const x = 10;\`.

### Multi-line Code Block
You can add a multi-line code block using triple backticks:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

You can also specify the language for syntax highlighting, like \`javascript\` in the example above.

## 3. Links and Images

You can easily add links and images.

### Link
Here is a [Google link](https://www.google.com), which will open the Google homepage.

### Image
This is an image:

![Placeholder Image](https://via.placeholder.com/400x200)

## 4. Lists

Markdown supports both ordered and unordered lists.

### Unordered List

- Item 1
- Item 2
  - Sub-item 1
  - Sub-item 2
- Item 3

### Ordered List

1. First item
2. Second item
3. Third item

## 5. Blockquotes

Blockquotes are often used for citations or highlighting a quote. Here's an example:

> "Success is not final, failure is not fatal: It is the courage to continue that counts."  
> — Winston Churchill

## 6. Tables

Tables are supported as well:

| Name      | Age | Occupation        |
|-----------|-----|-------------------|
| John Doe  | 30  | Web Developer     |
| Jane Smith| 25  | Graphic Designer  |
| Alice Lee | 35  | Data Scientist    |

## 7. Horizontal Rules

A horizontal rule is just a line, created by typing three dashes or asterisks:

---

### More Formatting

You can even add footnotes and references:

This is a sentence with a footnote[^1].

[^1]: This is the footnote text, which provides additional information.

## 8. Emoji Support

Markdown can support **emojis** using \`:emoji-name:\` syntax:

- 😀 Grinning Face
- 😎 Sunglasses
- 🚀 Rocket

## 9. Task Lists

Markdown supports task lists, which are useful for project management:

- [x] Task 1 (Completed)
- [ ] Task 2 (Not completed)
- [ ] Task 3 (Not completed)

## Conclusion

With Markdown, you can easily create readable and portable documents. It's used widely for documentation, writing posts, and more. Markdown is a great choice for content that you want to format without dealing with heavy HTML markup.

---

*Thank you for checking out this demo!*`;

const markdownContentTwo = `This is a [Next.js](https://nextjs.org) project bootstrapped with [\`create-next-app\`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying \`app/page.tsx\`. The page auto-updates as you edit the file.

This project uses [\`next/font\`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.`;

export { markdownContent, markdownContentTwo };
