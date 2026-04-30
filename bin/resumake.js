#!/usr/bin/env node
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { basename, dirname, extname, isAbsolute, join, resolve } from 'path';
import { pathToFileURL } from 'url';
import { renderToHtml } from '../src/renderer.js';
import { generatePdf } from '../src/pdf.js';
import { themes } from '../src/themes.js';

const args = process.argv.slice(2);
const cwd = process.cwd();

function buildHelpText() {
  const themeNames = Object.keys(themes).join(', ');
  return `resumake - Markdown から職務経歴書 / 履歴書 PDF を生成します

使い方:
  resumake [input.md] [options]
  npx @sugitlab/resumake [input.md] [options]

引数:
  input.md              入力Markdownファイル。省略時は ./resume.md

オプション:
  -t, --theme <name>    カラーテーマを指定。既定値: default
  -o, --output <file>   出力PDFファイル。省略時は入力名とテーマから自動決定
  --init                カレントディレクトリに resume-sample.md を生成
  -h, --help            このヘルプを表示

テーマ:
  ${themeNames}

例:
  resumake
  resumake resume.md --theme asagi
  resumake docs/resume-ja.md -t sakura -o dist/resume.pdf
  resumake --init

frontmatter:
  resume.md の先頭に氏名や顔写真を指定できます。

  ---
  name: 山田 太郎
  furigana: やまだ たろう
  englishName: Taro Yamada
  photo: ./face.png
  birthDate: 1996年4月1日
  age: 30
  address: 東京都
  phone: 090-1234-5678
  email: taro.yamada@example.com
  ---

timeline:
  職歴や学歴は timeline コードフェンスで点と線の時系列表示にできます。

  \`\`\`timeline
  2019年4月〜2021年3月 | 株式会社Sample | フロントエンドエンジニア | Vue.jsを用いた管理画面の開発
  2021年4月〜現在 | 株式会社Example | ソフトウェアエンジニア | React / TypeScriptを用いたSPAの開発
  \`\`\`
`;
}

function readOptionValue(index, optionName) {
  const value = args[index + 1];
  if (!value || value.startsWith('-')) {
    console.error(`Error: ${optionName} には値が必要です。`);
    process.exit(1);
  }
  return value;
}

function parseArgs() {
  const parsed = {
    input: null,
    output: null,
    theme: 'default',
    help: false,
    init: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '-h' || arg === '--help') {
      parsed.help = true;
      continue;
    }

    if (arg === '--init') {
      parsed.init = true;
      continue;
    }

    if (arg === '-t' || arg === '--theme') {
      parsed.theme = readOptionValue(index, arg);
      index += 1;
      continue;
    }

    if (arg === '-o' || arg === '--output') {
      parsed.output = readOptionValue(index, arg);
      index += 1;
      continue;
    }

    if (arg.startsWith('-')) {
      console.error(`Error: 不明なオプション "${arg}" が指定されました。`);
      console.error('詳しくは resumake --help を実行してください。');
      process.exit(1);
    }

    if (parsed.input) {
      console.error(`Error: 入力Markdownファイルは1つだけ指定できます: "${parsed.input}", "${arg}"`);
      process.exit(1);
    }

    parsed.input = arg;
  }

  return parsed;
}

function buildDefaultOutputPath(inputPath, themeName) {
  const inputDir = dirname(inputPath);
  const inputBaseName = basename(inputPath, extname(inputPath));
  const suffix = themeName === 'default' ? '' : `-${themeName}`;
  return join(inputDir, `${inputBaseName}${suffix}.pdf`);
}

function buildSampleMarkdown() {
  return `---
name: 山田 太郎
furigana: やまだ たろう
englishName: Taro Yamada
photo: ./face.png
birthDate: 1996年4月1日
age: 30
address: 〒100-0001 東京都千代田区千代田1-1
phone: 090-1234-5678
email: taro.yamada@example.com
---

## 職務要約

Webアプリケーション開発を中心に5年間のエンジニア経験。
フロントエンドからバックエンドまで一貫した開発経験を持つ。

## 職務経歴

\`\`\`timeline
2019年4月〜2021年3月 | 株式会社Sample | フロントエンドエンジニア | Vue.jsを用いた管理画面の開発、レガシーjQueryコードのモダン化対応
2021年4月〜現在 | 株式会社Example | ソフトウェアエンジニア | React / TypeScriptを用いたSPA、Node.js + PostgreSQLによるREST API、GitHub Actionsを用いたCI/CDの設計・開発
\`\`\`

## スキル

| カテゴリ | 技術 |
|------|------|
| 言語 | TypeScript, JavaScript, Python |
| フロントエンド | React, Vue.js, Next.js |
| バックエンド | Node.js, Express, FastAPI |
| インフラ | AWS, Docker, GitHub Actions |

## 学歴

\`\`\`timeline
2015年4月 | ○○大学 情報工学部 | 入学
2019年3月 | ○○大学 情報工学部 | 卒業
\`\`\`
`;
}

function initSampleFile() {
  const samplePath = join(cwd, 'resume-sample.md');

  if (existsSync(samplePath)) {
    console.error(`Error: resume-sample.md は既に存在します: ${samplePath}`);
    process.exit(1);
  }

  writeFileSync(samplePath, buildSampleMarkdown(), 'utf-8');
  console.log(`resume-sample.md を生成しました: ${samplePath}`);
}

const options = parseArgs();

if (options.help) {
  console.log(buildHelpText());
  process.exit(0);
}

if (options.init) {
  if (options.input || options.output || options.theme !== 'default') {
    console.error('Error: --init は単独で指定してください。');
    console.error('例: resumake --init');
    process.exit(1);
  }

  initSampleFile();
  process.exit(0);
}

const themeName = options.theme;

if (!(themeName in themes)) {
  const available = Object.keys(themes).filter(k => k !== 'default').join(', ');
  console.error(`Error: 不明なテーマ "${themeName}" が指定されました。`);
  console.error(`使用可能なテーマ: default${available ? `, ${available}` : ''}`);
  process.exit(1);
}

const inputPath = resolve(cwd, options.input || 'resume.md');
const outputPath = options.output
  ? resolve(cwd, options.output)
  : buildDefaultOutputPath(inputPath, themeName);
const assetBasePath = dirname(inputPath);

if (!existsSync(inputPath)) {
  console.error(`Error: Markdownファイルが見つかりません: ${inputPath}`);
  console.error('入力ファイルを指定するか、カレントディレクトリに resume.md を配置してください。');
  process.exit(1);
}

const markdown = readFileSync(inputPath, 'utf-8');
console.log(`${inputPath} を読み込みました。PDF を生成中... (テーマ: ${themeName})`);

const html = renderToHtml(markdown, themes[themeName], {
  assetBasePath,
  baseHref: pathToFileURL(`${assetBasePath}/`).href,
});

try {
  await generatePdf(html, outputPath);
  console.log(`${isAbsolute(outputPath) ? basename(outputPath) : outputPath} を生成しました: ${outputPath}`);
} catch (err) {
  console.error('PDF生成中にエラーが発生しました:');
  console.error(err);
  process.exit(1);
}
