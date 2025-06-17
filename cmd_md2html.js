#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs').promises;
const path = require('path');
const { processMarkdownFile } = require('./cmd_md2html_tpl');

program
  .version('1.0.0')
  .description('Convert Markdown files to HTML with Gruvbox theme')
  .argument('<inputDir>', 'Input directory containing .md files')
  .option('-o, --output <outputDir>', 'Output directory for HTML files', './output')
  .option('-c, --code <language>', 'Default language for code blocks without specified language', 'plaintext')
  .action(async (inputDir, options) => {
    try {
      // Kiểm tra thư mục đầu vào
      const inputPath = path.resolve(inputDir);
      if (!(await fs.stat(inputPath)).isDirectory()) {
        console.error('Error: Input path is not a directory');
        process.exit(1);
      }

      // Tạo thư mục đầu ra nếu chưa tồn tại
      const outputPath = path.resolve(options.output);
      await fs.mkdir(outputPath, { recursive: true });

      // Đọc tất cả file trong thư mục đầu vào
      const files = await fs.readdir(inputPath);
      const mdFiles = files.filter(file => path.extname(file).toLowerCase() === '.md');

      if (mdFiles.length === 0) {
        console.log('No Markdown files found in input directory');
        return;
      }

      // Xử lý từng file Markdown
      for (const file of mdFiles) {
        const inputFilePath = path.join(inputPath, file);
        const outputFileName = path.basename(file, '.md') + '.html';
        const outputFilePath = path.join(outputPath, outputFileName);

        // Đọc nội dung file
        const markdownContent = await fs.readFile(inputFilePath, 'utf-8');
        
        // Lấy tên file để sử dụng làm title
        const fileName = path.basename(file, '.md');
        
        // Chuyển đổi sang HTML với ngôn ngữ mặc định và tên file làm title
        const htmlContent = processMarkdownFile(markdownContent, options.code, fileName);
        
        // Ghi file HTML
        await fs.writeFile(outputFilePath, htmlContent);
        console.log(`Converted: ${file} -> ${outputFileName}`);
      }

      console.log('Conversion completed successfully');
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse();