function buildThemeCss(theme) {
  if (!theme) return '';
  const { bg, main, accent } = theme;
  return `
    h1 { border-bottom-color: ${accent}; color: ${accent}; }
    h2 { border-bottom-color: ${main}; color: ${accent}; background: ${bg}; padding: 4px 8px; border-radius: 3px; }
    h3 { color: ${accent}; }
    table { border-color: ${main}; }
    th, td { border-color: ${main}; }
    th { background: ${bg}; color: ${accent}; }
    a { color: ${accent}; }`;
}

export function buildHtml(bodyHtml, theme = null) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Noto Sans JP', sans-serif;
      font-size: 10pt;
      line-height: 1.7;
      color: #111;
      background: #fff;
    }

    h1 { font-size: 20pt; font-weight: 700; border-bottom: 2px solid #111; padding-bottom: 6px; margin-bottom: 16px; }
    h2 { font-size: 13pt; font-weight: 700; border-bottom: 1px solid #555; padding-bottom: 4px; margin-top: 24px; margin-bottom: 10px; }
    h3 { font-size: 11pt; font-weight: 500; margin-top: 14px; margin-bottom: 4px; }

    p  { margin-bottom: 6px; }
    ul { padding-left: 1.4em; margin-bottom: 8px; }
    li { margin-bottom: 3px; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 9.5pt; }
    th, td { border: 1px solid #bbb; padding: 5px 8px; text-align: left; }
    th { background: #f0f0f0; font-weight: 500; }

    a { color: #111; text-decoration: none; }

    h2 { page-break-before: auto; page-break-after: avoid; }
    h3 { page-break-after: avoid; }
    tr  { page-break-inside: avoid; }
    ${buildThemeCss(theme)}
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}
