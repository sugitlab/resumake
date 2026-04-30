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

export function renderToHtml(markdown, theme = null, options = {}) {
  const { data, content } = parseFrontmatter(markdown);
  const profile = embedLocalPhoto(data, options.assetBasePath);
  const bodyHtml = marked.parse(transformTimelineBlocks(content));
  return buildHtml(bodyHtml, theme, { ...options, profile });
}
