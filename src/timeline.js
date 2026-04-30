function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseTimelineLine(line) {
  const normalized = line.trim().replace(/^[-*]\s+/, '');
  if (!normalized) return null;

  const [period, title, meta, description] = normalized
    .split('|')
    .map((part) => part.trim());

  if (!period || !title) return null;

  return { period, title, meta, description };
}

function buildTimelineHtml(rawLines) {
  const items = rawLines
    .split('\n')
    .map(parseTimelineLine)
    .filter(Boolean);

  if (items.length === 0) return '';

  const itemHtml = items.map((item) => {
    const metaHtml = item.meta
      ? `<div class="resume-timeline-meta">${escapeHtml(item.meta)}</div>`
      : '';
    const descriptionHtml = item.description
      ? `<div class="resume-timeline-description">${escapeHtml(item.description)}</div>`
      : '';

    return `<li class="resume-timeline-item">
  <div class="resume-timeline-marker" aria-hidden="true"></div>
  <div class="resume-timeline-period">${escapeHtml(item.period)}</div>
  <div class="resume-timeline-content">
    <div class="resume-timeline-title">${escapeHtml(item.title)}</div>
    ${metaHtml}
    ${descriptionHtml}
  </div>
</li>`;
  }).join('\n');

  return `<ol class="resume-timeline">
${itemHtml}
</ol>`;
}

export function transformTimelineBlocks(markdown) {
  return markdown.replace(/```timeline\s*\n([\s\S]*?)```/g, (_, rawLines) => buildTimelineHtml(rawLines));
}
