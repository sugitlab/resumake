# resumake

`resume.md` を読み込み、美しい職務経歴書 PDF を生成する Node.js CLI ツール。

## 必要環境

- Node.js 18 以上

## インストール

```bash
npm install -g @sugitlab/resumake
```

またはインストールなしで直接実行:

```bash
npx @sugitlab/resumake
```

## 使い方

### 1. `resume.md` を用意する

カレントディレクトリに `resume.md` を配置します。

````markdown
---
name: 山田 太郎
furigana: やまだ たろう
englishName: Taro Yamada
photo: ./photo.jpg
birthDate: 1996年4月1日
age: 30
address: 〒100-0001 東京都千代田区千代田1-1
phone: 090-1234-5678
email: taro.yamada@example.com
---

## 職務要約

Webアプリケーション開発を中心に5年間のエンジニア経験。

## 職務経歴

```timeline
2019年4月〜2021年3月 | 株式会社Sample | フロントエンドエンジニア | Vue.jsを用いた管理画面の開発
2021年4月〜現在 | 株式会社Example | ソフトウェアエンジニア | React / TypeScript を用いた SPA の設計・開発
```

## スキル

| カテゴリ | 技術 |
|------|------|
| 言語 | TypeScript, JavaScript, Python |
| フロントエンド | React, Vue.js, Next.js |

## リンク

- [ポートフォリオ](https://example.com)
- [GitHub](https://github.com/example)

## 学歴

```timeline
2015年4月 | ○○大学 情報工学部 | 入学
2019年3月 | ○○大学 情報工学部 | 卒業
```
````

`resume.md` の先頭に frontmatter を書くと、PDF の冒頭に履歴書形式の基本情報欄が表組みでレンダリングされます。

| キー | 表示項目 | 例 |
|---|---|---|
| `name` | 氏名 | `山田 太郎` |
| `furigana` | ふりがな | `やまだ たろう` |
| `englishName` | 英字名 | `Taro Yamada` |
| `photo` | 顔写真 | `./photo.jpg` |
| `birthDate` | 生年月日 | `1996年4月1日` |
| `age` | 満年齢 | `30` |
| `address` | 現住所 | `〒100-0001 東京都千代田区千代田1-1` |
| `phone` | 電話番号 | `090-1234-5678` |
| `email` | メールアドレス | `taro.yamada@example.com` |

職歴や学歴を時系列表示したい場合は、`timeline` コードフェンスを使います。各行は `年月 | タイトル | 補足 | 説明` の順で書き、補足と説明は省略できます。

````markdown
```timeline
2019年4月〜2021年3月 | 株式会社Sample | フロントエンドエンジニア | Vue.jsを用いた管理画面の開発
2021年4月〜現在 | 株式会社Example | ソフトウェアエンジニア | React / TypeScript を用いた SPA の設計・開発
```
````

Markdownのリンクは青色・下線付きで表示されます。`http://` または `https://` の外部リンクには文末に外部リンクアイコンが付きます。

````markdown
## リンク

- [ポートフォリオ](https://example.com)
- [GitHub](https://github.com/example)
````

### 2. PDF を生成する

```bash
npx @sugitlab/resumake
```

カレントディレクトリの `resume.md` を読み込み、`resume.pdf` が生成されます。

Markdownファイルを指定する場合:

```bash
npx @sugitlab/resumake docs/resume-ja.md
```

出力先を指定する場合:

```bash
npx @sugitlab/resumake docs/resume-ja.md --output dist/resume.pdf
```

ヘルプを表示する場合:

```bash
npx @sugitlab/resumake --help
```

サンプルMarkdownを生成する場合:

```bash
npx @sugitlab/resumake --init
```

実行したディレクトリに `resume-sample.md` が生成されます。既に同名ファイルがある場合は上書きせずに終了します。

## カラーテーマ

`--theme <name>` フラグでテーマを指定できます。

```bash
npx @sugitlab/resumake --theme asagi
```

短いオプション名も使えます。

```bash
npx @sugitlab/resumake resume.md -t asagi -o resume-asagi.pdf
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
  npx @sugitlab/resumake --theme $theme
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
