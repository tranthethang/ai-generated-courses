#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { program } = require('commander');

// Thiết lập command line interface
program
  .version('1.0.0')
  .description('Convert HTML files to PDF while preserving CSS formatting')
  .option('-i, --input <directory>', 'Input directory containing HTML files', './html')
  .option('-o, --output <directory>', 'Output directory for PDF files', './pdf')
  .option('-w, --wait <seconds>', 'Wait time before PDF generation (seconds)', '2')
  .option('--format <format>', 'PDF format (A4, A3, Letter)', 'A4')
  .option('--margin <margin>', 'PDF margins (top,right,bottom,left in mm)', '10,10,10,10')
  .option('--landscape', 'Generate PDF in landscape orientation')
  .option('--scale <scale>', 'Scale factor for PDF generation (0.1-2)', '1')
  .option('--bg <color>', 'Background color for PDF pages', 'rgb(250, 249, 245)')
  .parse();

const options = program.opts();

// Cấu hình PDF
const getPdfOptions = () => {
  const margins = options.margin.split(',').map(m => `${m.trim()}mm`);
  
  const pdfOptions = {
    format: options.format,
    landscape: options.landscape || false,
    printBackground: true, // Giữ lại background colors và images
    margin: {
      top: margins[0] || '10mm',
      right: margins[1] || '10mm',  
      bottom: margins[2] || '10mm',
      left: margins[3] || '10mm'
    },
    scale: parseFloat(options.scale) || 1,
    preferCSSPageSize: false // Tắt để margin có tác dụng
  };
  
  console.log(`  PDF Options - Format: ${pdfOptions.format}, Scale: ${pdfOptions.scale}`);
  console.log(`  Margins: top=${pdfOptions.margin.top}, right=${pdfOptions.margin.right}, bottom=${pdfOptions.margin.bottom}, left=${pdfOptions.margin.left}`);
  
  return pdfOptions;
};

// Hàm kiểm tra và tạo thư mục
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }
};

// Hàm lấy danh sách file HTML
const getHtmlFiles = (directory) => {
  try {
    const files = fs.readdirSync(directory);
    return files.filter(file => path.extname(file).toLowerCase() === '.html');
  } catch (error) {
    console.error(`❌ Error reading directory ${directory}:`, error.message);
    return [];
  }
};

// Hàm convert HTML sang PDF
const convertHtmlToPdf = async (browser, inputPath, outputPath) => {
  try {
    const page = await browser.newPage();
    
    // Thiết lập viewport và user agent
    await page.setViewport({ width: 1200, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // Load HTML file
    const htmlContent = fs.readFileSync(inputPath, 'utf8');
    const fileUrl = `file://${path.resolve(inputPath)}`;
    
    console.log(`  Loading: ${path.basename(inputPath)}`);
    await page.goto(fileUrl, { 
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000 
    });
    
    // Đợi thêm thời gian cho CSS và JS load hoàn toàn
    await new Promise(resolve => setTimeout(resolve, parseInt(options.wait) * 1000));
    
    // Kiểm tra và log màu nền đã được áp dụng
    const bodyBgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    console.log(`  Applied background color: ${bodyBgColor}`);
    
    // Inject CSS để đảm bảo in được background và xử lý margin
    await page.addStyleTag({
      content: `
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        @page {
          size: auto;
          background-color: ${options.bg} !important;
        }
        html {
          background-color: ${options.bg} !important;
          margin: 0 !important;
          padding: 0 !important;
          min-height: 100vh !important;
        }
        body {
          background-color: ${options.bg} !important;
          margin: 0 !important;
          padding: 0 !important;
          min-height: 100vh !important;
        }
        /* Đảm bảo background hiển thị khi in */
        @media print {
          html, body {
            background-color: ${options.bg} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            background-color: ${options.bg} !important;
          }
        }
      `
    });
    
    // Generate PDF với options
    const pdfOptions = getPdfOptions();
    console.log(`  Generating PDF with background: ${options.bg}`);
    await page.pdf({
      path: outputPath,
      ...pdfOptions
    });
    
    await page.close();
    return true;
  } catch (error) {
    console.error(`  ❌ Error converting ${inputPath}:`, error.message);
    return false;
  }
};

// Hàm main
const main = async () => {
  console.log('🚀 HTML to PDF Converter');
  console.log('========================');
  
  const inputDir = path.resolve(options.input);
  const outputDir = path.resolve(options.output);
  
  console.log(`Input directory: ${inputDir}`);
  console.log(`Output directory: ${outputDir}`);
  console.log(`PDF format: ${options.format} ${options.landscape ? '(Landscape)' : '(Portrait)'}`);
  console.log(`Background color: ${options.bg}`);
  console.log(`Wait time: ${options.wait}s`);
  console.log('');
  
  // Kiểm tra thư mục input
  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Input directory does not exist: ${inputDir}`);
    process.exit(1);
  }
  
  // Tạo thư mục output
  ensureDirectoryExists(outputDir);
  
  // Lấy danh sách file HTML
  const htmlFiles = getHtmlFiles(inputDir);
  
  if (htmlFiles.length === 0) {
    console.log('❌ No HTML files found in input directory');
    process.exit(1);
  }
  
  console.log(`Found ${htmlFiles.length} HTML file(s)`);
  console.log('');
  
  // Khởi động Puppeteer
  console.log('🔄 Starting browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--allow-file-access-from-files',
      '--disable-features=VizDisplayCompositor'
    ]
  });
  
  let successCount = 0;
  let errorCount = 0;
  
  // Convert từng file
  for (const htmlFile of htmlFiles) {
    const inputPath = path.join(inputDir, htmlFile);
    const pdfFileName = path.basename(htmlFile, '.html') + '.pdf';
    const outputPath = path.join(outputDir, pdfFileName);
    
    console.log(`\n📄 Processing: ${htmlFile}`);
    
    const success = await convertHtmlToPdf(browser, inputPath, outputPath);
    
    if (success) {
      console.log(`  ✅ Success: ${pdfFileName}`);
      successCount++;
    } else {
      console.log(`  ❌ Failed: ${htmlFile}`);
      errorCount++;
    }
  }
  
  await browser.close();
  
  // Báo cáo kết quả
  console.log('\n========================');
  console.log('📊 Conversion Summary');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📁 Output directory: ${outputDir}`);
  
  if (successCount > 0) {
    console.log('\n🎉 Conversion completed!');
  }
};

// Xử lý lỗi
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Chạy script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}