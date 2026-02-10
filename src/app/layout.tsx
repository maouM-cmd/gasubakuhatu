import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ガス会社向け顧客管理・請求管理ツール",
  description: "検針〜請求書発行〜入金確認を効率化する業務管理ツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

  if (!hasDatabaseUrl) {
    return (
      <html lang="ja">
        <body>
          <main className="main-content" style={{ margin: "0 auto", maxWidth: 900 }}>
            <div className="page-header">
              <h1>
                <span>⛽</span> ガス会社向け顧客管理・請求管理ツール
              </h1>
              <p>
                アプリ自体は起動しています。データベース接続情報が未設定のため、画面表示をセットアップモードにしています。
              </p>
            </div>

            <div className="card">
              <div className="card-header">
                <h2>初期設定（.env）</h2>
              </div>
              <div className="card-body">
                <ol style={{ lineHeight: 1.8, paddingLeft: "1.5rem" }}>
                  <li>プロジェクト直下に <code>.env</code>（または <code>.env.local</code>）を作成</li>
                  <li>
                    <code>DATABASE_URL</code> を設定（例: Vercel Postgres / Railway Postgres）
                  </li>
                  <li>
                    OCR を使う場合は <code>GEMINI_API_KEY</code> も設定
                  </li>
                  <li>
                    設定後に <code>npm run dev</code> を再起動
                  </li>
                </ol>
              </div>
            </div>
          </main>
        </body>
      </html>
    );
  }

  return (
    <html lang="ja">
      <body>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
