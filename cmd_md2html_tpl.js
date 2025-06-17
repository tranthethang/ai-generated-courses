const { marked } = require("marked");
const hljs = require("highlight.js");

// Cấu hình marked
const configureMarked = (defaultLang = "javascript") => {
  marked.setOptions({
    highlight: function (code, lang) {
      const language = lang || defaultLang; // Sử dụng lang của code block, nếu không có thì dùng defaultLang
      const validLanguage = hljs.getLanguage(language)
        ? language
        : "javascript";
      return hljs.highlight(code, { language: validLanguage }).value;
    },
    langPrefix: "hljs language-",
  });
};

// CSS cho theme gruvbox-light-hard
const gruvboxLightHardStyles = `
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");

      body {
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        font-size: 16px;
        line-height: 1.7;
        color: #2d3748;
        background-color: #fafbfc;
        background-color: rgb(250, 249, 245);
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;
        font-weight: 400;
      }

      h1 {
        font-size: 2.5rem;
        font-weight: 700;
        line-height: 1.2;
        color: #1a202c;
        margin: 0 0 2rem 0;
        letter-spacing: -0.025em;
      }

      h2 {
        font-size: 2rem;
        font-weight: 600;
        line-height: 1.3;
        color: #2d3748;
        margin: 3rem 0 1.5rem 0;
        letter-spacing: -0.02em;
      }

      h3 {
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 1.4;
        color: #2d3748;
        margin: 2.5rem 0 1rem 0;
        letter-spacing: -0.015em;
      }

      h4 {
        font-size: 1.25rem;
        font-weight: 600;
        line-height: 1.4;
        color: #4a5568;
        margin: 2rem 0 0.75rem 0;
      }

      h5 {
        font-size: 1.125rem;
        font-weight: 600;
        line-height: 1.4;
        color: #4a5568;
        margin: 1.75rem 0 0.75rem 0;
      }

      h6 {
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.4;
        color: #4a5568;
        margin: 1.5rem 0 0.5rem 0;
      }

      p {
        margin: 0 0 1.5rem 0;
        font-size: 16px;
        line-height: 1.7;
      }

      ul,
      ol {
        margin: 0 0 1.5rem 0;
        padding-left: 2rem;
        line-height: 1.7;
      }

      li {
        margin-bottom: 0.5rem;
      }

      li:last-child {
        margin-bottom: 0;
      }

      ul ul,
      ol ol,
      ul ol,
      ol ul {
        margin-top: 0.5rem;
        margin-bottom: 0;
      }

      blockquote {
        margin: 2rem 0;
        padding: 1rem 1.5rem;
        border-left: 4px solid #e2e8f0;
        background-color: #f7fafc;
        font-style: italic;
        color: #4a5568;
      }

      code {
        font-family: "JetBrains Mono", "Fira Code", "Monaco", "Consolas",
          monospace;
        font-size: 0.875rem;
        background-color: #f1f5f9;
        color: #475569;
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
        font-weight: 500;
      }

      pre {
        font-family: "JetBrains Mono", "Fira Code", "Monaco", "Consolas",
          monospace;
        font-size: 0.875rem;
        line-height: 1.6;
        background-color: #1e293b;
        color: #e2e8f0;
        border-radius: 0.5rem;
        margin: 2rem 0;
        overflow-x: auto;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      pre code {
        background-color: transparent;
        color: inherit;
        padding: 0;
        border-radius: 0;
        font-size: inherit;
        font-weight: 400;
      }

      a {
        color: #3182ce;
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: border-bottom-color 0.2s ease;
      }

      a:hover {
        border-bottom-color: #3182ce;
      }

      strong,
      b {
        font-weight: 600;
        color: #2d3748;
      }

      em,
      i {
        font-style: italic;
      }

      hr {
        border: none;
        height: 1px;
        background-color: #e2e8f0;
        margin: 3rem 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 2rem 0;
        font-size: 0.9rem;
      }

      th,
      td {
        padding: 0.75rem 1rem;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
      }

      th {
        background-color: #f8fafc;
        font-weight: 600;
        color: #2d3748;
      }

      tr:hover {
        background-color: #f8fafc;
      }

      /* Spacing improvements for better readability */
      h1 + p,
      h2 + p,
      h3 + p,
      h4 + p,
      h5 + p,
      h6 + p {
        margin-top: 0;
      }

      /* Ensure proper spacing after code blocks */
      pre + h1,
      pre + h2,
      pre + h3,
      pre + h4,
      pre + h5,
      pre + h6 {
        margin-top: 3rem;
      }

      /* Better spacing for lists following headings */
      h1 + ul,
      h1 + ol,
      h2 + ul,
      h2 + ol,
      h3 + ul,
      h3 + ol,
      h4 + ul,
      h4 + ol,
      h5 + ul,
      h5 + ol,
      h6 + ul,
      h6 + ol {
        margin-top: 0.5rem;
      }

      /* Responsive adjustments */
      @media (max-width: 768px) {
        body {
          padding: 1rem;
          font-size: 15px;
        }

        h1 {
          font-size: 2rem;
        }

        h2 {
          font-size: 1.75rem;
        }

        h3 {
          font-size: 1.375rem;
        }

        pre {
          padding: 1rem;
          margin: 1.5rem 0;
        }
      } 
`;

// Hàm chuyển đổi Markdown sang HTML
function convertMarkdownToHtml(markdownContent, defaultLang, title = "Markdown Preview") {
  // Cấu hình marked với ngôn ngữ mặc định
  configureMarked(defaultLang);
  // Chuyển đổi markdown sang HTML
  const htmlContent = marked.parse(markdownContent);

  // Tạo HTML hoàn chỉnh
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>${gruvboxLightHardStyles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/monokai.min.css"/>
    </head>
    <body>
      ${htmlContent}
    </body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>
    </html>
  `;
}

// Hàm xử lý file Markdown
function processMarkdownFile(inputFileContent, defaultLang = "plaintext", title = "Markdown Preview") {
  try {
    return convertMarkdownToHtml(inputFileContent, defaultLang, title);
  } catch (error) {
    console.error("Error processing markdown:", error);
    return "<h1>Error</h1><p>Failed to process markdown content.</p>";
  }
}

// Export hàm để sử dụng
module.exports = {
  convertMarkdownToHtml,
  processMarkdownFile,
};
