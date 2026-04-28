import { marked } from 'marked';
import { buildHtml } from './template.js';

export function renderToHtml(markdown, theme = null) {
  const bodyHtml = marked.parse(markdown);
  return buildHtml(bodyHtml, theme);
}
