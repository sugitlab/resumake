import { existsSync, readFileSync } from 'fs';
import { extname, isAbsolute, resolve } from 'path';
import { marked } from 'marked';
import { parseFrontmatter } from './frontmatter.js';
import { buildHtml } from './template.js';
import { transformTimelineBlocks } from './timeline.js';

const imageMimeTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

function isExternalOrEmbeddedUrl(value) {
  return /^(https?:|data:)/i.test(value);
}

function embedLocalPhoto(profile, assetBasePath) {
  if (!profile.photo || isExternalOrEmbeddedUrl(profile.photo) || !assetBasePath) {
    return profile;
  }

  const photoPath = isAbsolute(profile.photo)
    ? profile.photo
    : resolve(assetBasePath, profile.photo);

  if (!existsSync(photoPath)) {
    return profile;
  }

  const mimeType = imageMimeTypes[extname(photoPath).toLowerCase()];
  if (!mimeType) {
    return profile;
  }

  const imageData = readFileSync(photoPath).toString('base64');
  return {
    ...profile,
    photo: `data:${mimeType};base64,${imageData}`,
  };
}

function addExternalLinkIcons(html) {
  return html.replace(/<a\s+href="(https?:\/\/[^"]+)"([^>]*)>([\s\S]*?)<\/a>/g, (match, href, attributes, label) => {
    if (attributes.includes('resume-external-link')) return match;
    const nextAttributes = attributes.includes(' class="')
      ? attributes.replace(' class="', ' class="resume-external-link ')
      : `${attributes} class="resume-external-link"`;
    return `<a href="${href}"${nextAttributes}>${label}<span class="resume-external-link-icon" aria-hidden="true">↗</span></a>`;
  });
}

function renderMarkdown(markdown, theme = null, options = {}) {
  const { data, content } = parseFrontmatter(markdown);
  const profile = embedLocalPhoto(data, options.assetBasePath);
  const bodyHtml = addExternalLinkIcons(marked.parse(transformTimelineBlocks(content)));
  return {
    html: buildHtml(bodyHtml, theme, { ...options, profile }),
    metadata: data,
  };
}

export function renderToHtml(markdown, theme = null, options = {}) {
  return renderMarkdown(markdown, theme, options).html;
}

export function renderResume(markdown, theme = null, options = {}) {
  return renderMarkdown(markdown, theme, options);
}
