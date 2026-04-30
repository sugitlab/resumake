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
    .resume-profile-title { border-bottom-color: ${accent}; color: ${accent}; }
    .resume-profile-label { background: ${bg}; color: ${accent}; }
    .resume-timeline-marker { border-color: ${accent}; }
    .resume-timeline-item::before { background: ${main}; }
    .resume-timeline-period { color: ${accent}; }
    a { color: #1f6feb; }`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeProfile(profile = {}) {
  return {
    name: profile.name,
    furigana: profile.furigana,
    englishName: profile.englishName,
    photo: profile.photo,
    birthDate: profile.birthDate,
    age: profile.age,
    address: profile.address,
    phone: profile.phone,
    email: profile.email,
  };
}

function buildProfileCell(value, fallback = '') {
  const text = value || fallback;
  return text ? escapeHtml(text) : '&nbsp;';
}

function buildProfileHtml(rawProfile) {
  const profile = normalizeProfile(rawProfile);
  const hasProfile = Object.values(profile).some(Boolean);
  if (!hasProfile) return '';

  const photoHtml = profile.photo
    ? `<img class="resume-profile-photo-image" src="${escapeHtml(profile.photo)}" alt="顔写真">`
    : '<div class="resume-profile-photo-placeholder">顔写真</div>';

  const age = profile.age ? `満${profile.age}歳` : '';

  return `
<section class="resume-profile" aria-label="履歴書基本情報">
  <div class="resume-profile-title">履歴書</div>
  <table class="resume-profile-table">
    <colgroup>
      <col class="resume-profile-label-column">
      <col>
      <col class="resume-profile-age-label-column">
      <col class="resume-profile-photo-column">
    </colgroup>
    <tbody>
      <tr>
        <th class="resume-profile-label">ふりがな</th>
        <td class="resume-profile-value" colspan="2">${buildProfileCell(profile.furigana)}</td>
        <td class="resume-profile-photo" rowspan="3">${photoHtml}</td>
      </tr>
      <tr>
        <th class="resume-profile-label resume-profile-name-label">氏名</th>
        <td class="resume-profile-value resume-profile-name" colspan="2">${buildProfileCell(profile.name)}</td>
      </tr>
      <tr>
        <th class="resume-profile-label">英字名</th>
        <td class="resume-profile-value" colspan="2">${buildProfileCell(profile.englishName)}</td>
      </tr>
      <tr>
        <th class="resume-profile-label">生年月日</th>
        <td class="resume-profile-value">${buildProfileCell(profile.birthDate)}</td>
        <th class="resume-profile-label">満年齢</th>
        <td class="resume-profile-value">${buildProfileCell(age)}</td>
      </tr>
      <tr>
        <th class="resume-profile-label">現住所</th>
        <td class="resume-profile-value" colspan="3">${buildProfileCell(profile.address)}</td>
      </tr>
      <tr>
        <th class="resume-profile-label">電話番号</th>
        <td class="resume-profile-value" colspan="3">${buildProfileCell(profile.phone)}</td>
      </tr>
      <tr>
        <th class="resume-profile-label">メールアドレス</th>
        <td class="resume-profile-value" colspan="3">${buildProfileCell(profile.email)}</td>
      </tr>
    </tbody>
  </table>
</section>`;
}

export function buildHtml(bodyHtml, theme = null, options = {}) {
  const profileHtml = buildProfileHtml(options.profile);
  const baseHtml = options.baseHref ? `\n  <base href="${escapeHtml(options.baseHref)}">` : '';
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${baseHtml}
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

    a {
      color: #1f6feb;
      text-decoration: underline;
      text-decoration-thickness: 0.6px;
      text-underline-offset: 2px;
    }
    .resume-external-link-icon {
      display: inline-block;
      margin-left: 0.16em;
      font-size: 0.78em;
      line-height: 1;
      vertical-align: 0.12em;
      text-decoration: none;
    }

    .resume-profile { margin-bottom: 22px; page-break-inside: avoid; }
    .resume-profile-title {
      font-size: 18pt;
      font-weight: 700;
      letter-spacing: 0;
      border-bottom: 2px solid #111;
      padding-bottom: 5px;
      margin-bottom: 10px;
      text-align: center;
    }
    .resume-profile-table {
      table-layout: fixed;
      border: 2px solid #222;
      margin-bottom: 0;
      font-size: 8.8pt;
    }
    .resume-profile-table th,
    .resume-profile-table td {
      border: 1px solid #555;
      vertical-align: middle;
    }
    .resume-profile-label-column {
      width: 28mm;
    }
    .resume-profile-age-label-column {
      width: 22mm;
    }
    .resume-profile-photo-column {
      width: 32mm;
    }
    .resume-profile-label {
      background: #f3f3f3;
      font-weight: 700;
      text-align: center;
      white-space: nowrap;
      font-size: 8pt;
      padding-left: 3px;
      padding-right: 3px;
    }
    .resume-profile-value {
      min-height: 10mm;
      padding: 5px 7px;
      word-break: break-word;
    }
    .resume-profile-name {
      font-size: 15pt;
      font-weight: 700;
      letter-spacing: 0;
      line-height: 1.35;
    }
    .resume-profile-photo {
      width: 32mm;
      height: 42mm;
      padding: 4px;
      text-align: center;
      background: #fff;
    }
    .resume-profile-photo-image,
    .resume-profile-photo-placeholder {
      width: 28mm;
      height: 36mm;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #777;
      object-fit: cover;
      font-size: 9pt;
      color: #777;
      background: #fafafa;
    }

    .resume-timeline {
      list-style: none;
      padding-left: 0;
      margin: 8px 0 16px;
    }
    .resume-timeline-item {
      position: relative;
      display: grid;
      grid-template-columns: 30mm 8mm 1fr;
      column-gap: 0;
      min-height: 15mm;
      padding-bottom: 7mm;
      margin-bottom: 0;
      page-break-inside: avoid;
    }
    .resume-timeline-item::before {
      content: "";
      position: absolute;
      top: 4.5mm;
      bottom: -1mm;
      left: 33.8mm;
      width: 1px;
      background: #777;
    }
    .resume-timeline-item:last-child {
      padding-bottom: 0;
      min-height: 10mm;
    }
    .resume-timeline-item:last-child::before {
      display: none;
    }
    .resume-timeline-marker {
      grid-column: 2;
      width: 4mm;
      height: 4mm;
      margin: 2.2mm auto 0;
      border: 1.5px solid #111;
      border-radius: 50%;
      background: #fff;
      z-index: 1;
    }
    .resume-timeline-period {
      grid-column: 1;
      grid-row: 1;
      padding-top: 0.7mm;
      padding-right: 3mm;
      font-size: 8.8pt;
      font-weight: 700;
      line-height: 1.45;
      color: #333;
      text-align: right;
      word-break: keep-all;
    }
    .resume-timeline-content {
      grid-column: 3;
      grid-row: 1;
      padding: 0.3mm 0 0 3mm;
      border-bottom: 1px solid #ddd;
    }
    .resume-timeline-title {
      font-size: 10.2pt;
      font-weight: 700;
      line-height: 1.45;
    }
    .resume-timeline-meta {
      margin-top: 1mm;
      font-size: 9.2pt;
      font-weight: 500;
      line-height: 1.45;
    }
    .resume-timeline-description {
      margin-top: 1mm;
      font-size: 8.8pt;
      line-height: 1.55;
      color: #333;
    }

    h2 { page-break-before: auto; page-break-after: avoid; }
    h3 { page-break-after: avoid; }
    tr  { page-break-inside: avoid; }
    ${buildThemeCss(theme)}
  </style>
</head>
<body>
${profileHtml}
${bodyHtml}
</body>
</html>`;
}
