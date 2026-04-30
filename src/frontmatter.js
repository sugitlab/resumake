const FRONTMATTER_BOUNDARY = '---';

function unquote(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function parseFrontmatter(markdown) {
  if (!markdown.startsWith(`${FRONTMATTER_BOUNDARY}\n`) && !markdown.startsWith(`${FRONTMATTER_BOUNDARY}\r\n`)) {
    return { data: {}, content: markdown };
  }

  const normalized = markdown.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');
  const endIndex = lines.findIndex((line, index) => index > 0 && line.trim() === FRONTMATTER_BOUNDARY);

  if (endIndex === -1) {
    return { data: {}, content: markdown };
  }

  const data = {};
  for (const line of lines.slice(1, endIndex)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf(':');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1);
    if (key) data[key] = unquote(value);
  }

  return {
    data,
    content: lines.slice(endIndex + 1).join('\n').replace(/^\n+/, ''),
  };
}
