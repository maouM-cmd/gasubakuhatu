# ガス会社向け顧客管理・請求管理ツール (Gas Explosion?)

プロパンガス販売会社向けの業務管理システムです。
顧客管理、検針入力（OCR対応）、請求書発行、入金管理を一元化します。

## 機能一覧

- **顧客管理**: 顧客情報の登録・検索・編集
- **検針入力**: 
  - メーター写真のOCR読み取り (Gemini Vision API)
  - 前回指針との差分による使用量自動計算
- **請求書発行**: 
  - インボイス制度対応フォーマット
  - 一括自動作成機能
  - 印刷 / PDF保存
- **入金管理**: 
  - 未入金一覧
  - 入金消込・履歴管理
- **ダッシュボード**: 業務進捗の可視化

## 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite
- **ORM**: Prisma
- **AI/OCR**: Google Gemini 1.5 Flash
- **Styling**: Vanilla CSS (Tailwind不使用)

## セットアップ手順

### 1. 依存パッケージのインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.local` ファイルを作成し、以下の変数を設定してください。
OCR機能を使用する場合は `GEMINI_API_KEY` が必要です（[Google AI Studio](https://aistudio.google.com/)で取得）。

```
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your_api_key_here"
```

### 3. データベースのセットアップ
```bash
npx prisma db push
```

### 4. 開発サーバーの起動
```bash
npm run dev
```
ブラウザで `http://localhost:3001` にアクセスしてください。

### 📱 スマホからアクセスする場合 (OCR機能のテスト)
同じWi-Fiネットワークに接続したスマホからアクセスするには、PCのIPアドレスを使用します。

1. コマンドプロンプトで `ipconfig` (Windows) または `ifconfig` (Mac/Linux) を実行し、`IPv4アドレス` を確認します（例: `192.168.1.10`）。
2. スマホのブラウザで `http://192.168.1.10:3001` にアクセスします。
   ※カメラの使用許可を求められた場合は許可してください。


## 運用・バックアップ

データは `prisma/dev.db` (SQLiteファイル) に保存されます。
このファイルを定期的にUSBメモリやクラウドストレージにバックアップしてください。
