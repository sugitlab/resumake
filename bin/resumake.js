#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { renderToHtml } from '../src/renderer.js';
import { generatePdf } from '../src/pdf.js';
import { themes } from '../src/themes.js';

const args = process.argv.slice(2);
const themeIndex = args.indexOf('--theme');
const themeName = themeIndex !== -1 ? args[themeIndex + 1] : 'default';

if (!(themeName in themes)) {
  const available = Object.keys(themes).filter(k => k !== 'default').join(', ');
  console.error(`Error: 不明なテーマ "${themeName}" が指定されました。`);
  console.error(`使用可能なテーマ: ${available}`);
  process.exit(1);
}

const cwd = process.cwd();
const inputPath = join(cwd, 'resume.md');
const outputFile = themeName === 'default' ? 'resume.pdf' : `resume-${themeName}.pdf`;
const outputPath = join(cwd, outputFile);

if (!existsSync(inputPath)) {
  console.error('Error: resume.md が見つかりません。カレントディレクトリに resume.md を配置してください。');
  process.exit(1);
}

const markdown = readFileSync(inputPath, 'utf-8');
console.log(`resume.md を読み込みました。PDF を生成中... (テーマ: ${themeName})`);

const html = renderToHtml(markdown, themes[themeName]);

try {
  await generatePdf(html, outputPath);
  console.log(`${outputFile} を生成しました: ${outputPath}`);
} catch (err) {
  console.error('PDF生成中にエラーが発生しました:');
  console.error(err);
  process.exit(1);
}
