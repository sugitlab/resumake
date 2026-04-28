import puppeteer from 'puppeteer';

export async function generatePdf(html, outputPath) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' },
      printBackground: true,
    });
  } finally {
    await browser.close();
  }
}
