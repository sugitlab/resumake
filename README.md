# resumake

`resume.md` を読み込み、美しい職務経歴書 PDF を生成する Node.js CLI ツール。

## 必要環境

- Node.js 18 以上

## インストール

```bash
npm install -g resumake
```

またはインストールなしで直接実行:

```bash
npx resumake
```

## 使い方

### 1. `resume.md` を用意する

カレントディレクトリに `resume.md` を配置します。

```markdown
# 山田 太郎

- **Email**: taro.yamada@example.com
- **GitHub**: github.com/taro-yamada
- **所在地**: 東京都

## 職務要約

Webアプリケーション開発を中心に5年間のエンジニア経験。

## 職務経歴

### 株式会社Example（2021年4月 〜 現在）
**ソフトウェアエンジニア**

- React / TypeScript を用いた SPA の設計・開発
- Node.js + PostgreSQL による REST API 設計

## スキル

| カテゴリ | 技術 |
|------|------|
| 言語 | TypeScript, JavaScript, Python |
| フロントエンド | React, Vue.js, Next.js |

## 学歴

- 2019年3月 ○○大学 情報工学部 卒業
```

### 2. PDF を生成する

```bash
npx resumake
```

カレントディレクトリに `resume.pdf` が生成されます。

## カラーテーマ

`--theme <name>` フラグでテーマを指定できます。

```bash
npx resumake --theme asagi
```

| テーマ名 | イメージ | 出力ファイル名 |
|---|---|---|
| （なし） | モノクロ・ATS対応 | `resume.pdf` |
| `asagi` | 浅葱（青緑） | `resume-asagi.pdf` |
| `sakura` | 桜（ピンク） | `resume-sakura.pdf` |
| `wakakusa` | 若草（緑） | `resume-wakakusa.pdf` |
| `fuji` | 藤（紫） | `resume-fuji.pdf` |
| `kohaku` | 琥珀（金茶） | `resume-kohaku.pdf` |

### 全テーマを一括生成する例

```bash
for theme in asagi sakura wakakusa fuji kohaku; do
  npx resumake --theme $theme
done
```

## PDF の仕様

- **用紙**: A4
- **余白**: 上下 20mm・左右 18mm
- **フォント**: Noto Sans JP（Google Fonts）
- **デフォルト**: モノクロ・ATS スキャン対応レイアウト

## エラーメッセージ

| メッセージ | 原因と対処 |
|---|---|
| `Error: resume.md が見つかりません。` | カレントディレクトリに `resume.md` がない。ファイルを配置してから再実行。 |
| `Error: 不明なテーマ "xxx" が指定されました。` | `--theme` に存在しないテーマ名を指定した。使用可能なテーマ名を確認して再実行。 |

## ライセンス

MIT
