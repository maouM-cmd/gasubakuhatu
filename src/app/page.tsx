import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getStats() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const totalCustomers = await prisma.customer.count({
    where: { status: 'active' }
  });

  const readingsCount = await prisma.meterReading.count({
    where: { year, month }
  });

  // Calculate percentage
  const readingProgress = totalCustomers > 0
    ? Math.round((readingsCount / totalCustomers) * 100)
    : 0;

  const unpaidInvoices = await prisma.invoice.count({
    where: { status: { in: ['unpaid', 'overdue'] } }
  });

  return {
    totalCustomers,
    readingProgress,
    unpaidInvoices
  };
}

export default async function Dashboard() {
  const stats = await getStats();

  return (
    <div>
      <div className="page-header">
        <h1>
          <span>🏠</span> ダッシュボード
        </h1>
        <p>業務の進捗状況を確認しましょう。</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div>
            <div className="stat-value">{stats.totalCustomers}</div>
            <div className="stat-label">総顧客数</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">📊</div>
          <div>
            <div className="stat-value">{stats.readingProgress}%</div>
            <div className="stat-label">今月の検針完了率</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">💰</div>
          <div>
            <div className="stat-value">{stats.unpaidInvoices}件</div>
            <div className="stat-label">未入金件数</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>📌 ショートカット</h2>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/readings" className="btn btn-primary btn-lg">
              📊 今月の検針を入力する
            </Link>
            <Link href="/customers/new" className="btn btn-secondary btn-lg">
              👥 新しい顧客を登録する
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
