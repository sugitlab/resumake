import puppeteer from 'puppeteer';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHeaderTemplate(updatedAt) {
  const updatedAtHtml = updatedAt
    ? `<span>更新日: ${escapeHtml(updatedAt)}</span>`
    : '';

  return `<div style="width: 100%; box-sizing: border-box; padding: 0 18mm; font-family: 'Noto Sans JP', sans-serif; font-size: 7pt; color: #666; text-align: right;">${updatedAtHtml}</div>`;
}

function buildFooterTemplate() {
  return `<div style="width: 100%; box-sizing: border-box; padding: 0 18mm; font-family: 'Noto Sans JP', sans-serif; font-size: 7pt; color: #666; text-align: center;"><span class="pageNumber"></span></div>`;
}

export async function generatePdf(html, outputPath, options = {}) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: { top: '22mm', bottom: '22mm', left: '18mm', right: '18mm' },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: buildHeaderTemplate(options.updatedAt),
      footerTemplate: buildFooterTemplate(),
    });
  } finally {
    await browser.close();
  }
}
