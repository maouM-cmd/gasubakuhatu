# ガス会社向け顧客管理・請求管理ツール

Vercel + Vercel Postgres で動作するように設定されたバージョンです。

## 🚀 Vercelへのデプロイ手順 (推奨)

このアプリをインターネット上で公開 ("普通のURL"化) するための手順です。

### 1. Vercel プロジェクトの作成
1. [Vercel](https://vercel.com) にログイン。
2. "Add New..." -> "Project" を選択。
3. GitHubリポジトリ `gasubakuhatu` をインポート。

### 2. データベース (Storage) の作成
1. プロジェクト作成画面、または作成後の "Storage" タブに移動。
2. "Create Database" -> "Postgres" を選択。
3. 同意して作成 (Create) すると、自動的に環境変数が設定されます。

### 3. 環境変数の追加設定
"Settings" -> "Environment Variables" で以下を追加してください：

- `GEMINI_API_KEY`: あなたのGoogle Gemini APIキー

### 4. デプロイ
設定が完了したら "Deploy" (または "Redeploy") をクリック。
数分後、`https://gasubakuhatu.vercel.app` のようなURLが発行されます！

---

## 💻 ローカルでの開発について

データベースを PostgreSQL に変更したため、ローカルで実行するには工夫が必要です。
一番簡単なのは、**Vercelのデータベースにローカルから接続する** 方法です。

1. Vercelの Storage 画面で `.env.local` の内容を表示し、コピーする。
2. ローカルの `.env` ファイルに貼り付ける。
3. `npm run dev` で起動。

こうすることで、手元のパソコンからでも Vercel 上のデータベースを操作できます。
