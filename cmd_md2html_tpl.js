const { marked } = require('marked');
const hljs = require('highlight.js');

// Cấu hình marked
const configureMarked = (defaultLang = 'plaintext') => {
  marked.setOptions({
    highlight: function(code, lang) {
      const language = lang || defaultLang; // Sử dụng lang của code block, nếu không có thì dùng defaultLang
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
      return hljs.highlight(code, { language: validLanguage }).value;
    },
    langPrefix: 'hljs language-'
  });
};

// CSS cho theme gruvbox-light-hard
const gruvboxLightHardStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #fbf1c7;
    color: #3c3836;
    line-height: 1.6;
    padding: 20px;
    max-width: 1280px;
    margin: 0 auto;
  }
  h1, h2, h3, h4, h5, h6 {
    color: #282828;
    border-bottom: 1px solid #d5c4a1;
    padding-bottom: 0.3em;
  }
  a {
    color: #458588;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }

  blockquote {
    border-left: 4px solid #d79921;
    padding-left: 16px;
    color: #665c54;
    margin: 1em 0;
  }
  ul, ol {
    padding-left: 2em;
    margin: 1em 0;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }
  th, td {
    border: 1px solid #d5c4a1;
    padding: 8px;
  }
  th {
    background-color: #ebdbb2;
  }
`;

// Hàm chuyển đổi Markdown sang HTML
function convertMarkdownToHtml(markdownContent, defaultLang) {
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
      <title>Markdown Preview</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/base16/gruvbox-dark-hard.min.css">
      <style>${gruvboxLightHardStyles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/default.min.css">      
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
function processMarkdownFile(inputFileContent, defaultLang = 'plaintext') {
  try {
    return convertMarkdownToHtml(inputFileContent, defaultLang);
  } catch (error) {
    console.error('Error processing markdown:', error);
    return '<h1>Error</h1><p>Failed to process markdown content.</p>';
  }
}

// Export hàm để sử dụng
module.exports = {
  convertMarkdownToHtml,
  processMarkdownFile
};