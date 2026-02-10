import Link from 'next/link';
import { getInvoices, generateInvoicesForMonth } from './actions';
import StatusBadge from '@/components/StatusBadge';
import { revalidatePath } from 'next/cache';

export default async function InvoicesPage({
    searchParams,
}: {
    searchParams: { year?: string; month?: string };
}) {
    const now = new Date();
    const year = parseInt(searchParams.year || now.getFullYear().toString());
    const month = parseInt(searchParams.month || (now.getMonth() + 1).toString());

    const invoices = await getInvoices(year, month);
    const totalAmount = invoices.reduce((sum: number, inv: any) => sum + inv.total, 0);
    const unpaidCount = invoices.filter((inv: any) => inv.status === 'unpaid' || inv.status === 'overdue').length;

    async function handleGenerate() {
        'use server';
        await generateInvoicesForMonth(year, month);
        revalidatePath('/invoices');
    }

    return (
        <div>
            <div className="page-header">
                <div className="flex-between">
                    <h1>
                        <span>📄</span> 請求書管理
                    </h1>
                    <div className="flex gap-md">
                        <Link
                            href={`/invoices?year=${month === 1 ? year - 1 : year}&month=${month === 1 ? 12 : month - 1}`}
                            className="btn btn-secondary btn-sm"
                        >
                            ← 前月
                        </Link>
                        <span className="font-bold" style={{ fontSize: '1.2rem', padding: '0 1rem' }}>
                            {year}年 {month}月
                        </span>
                        <Link
                            href={`/invoices?year=${month === 12 ? year + 1 : year}&month=${month === 12 ? 1 : month + 1}`}
                            className="btn btn-secondary btn-sm"
                        >
                            翌月 →
                        </Link>
                    </div>
                </div>
            </div>

            <div className="stats-grid mb-lg">
                <div className="stat-card">
                    <div className="stat-icon blue">💰</div>
                    <div>
                        <div className="stat-value">¥{totalAmount.toLocaleString()}</div>
                        <div className="stat-label">請求総額</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon red">⚠️</div>
                    <div>
                        <div className="stat-value">{unpaidCount}件</div>
                        <div className="stat-label">未入金</div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="flex-between">
                        <h2>請求書一覧</h2>
                        <form action={handleGenerate}>
                            <button className="btn btn-primary">
                                🔨 未作成の請求書を一括作成
                            </button>
                        </form>
                    </div>
                </div>

                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ステータス</th>
                                <th>顧客名</th>
                                <th>使用量</th>
                                <th>請求金額</th>
                                <th>発行日</th>
                                <th className="text-right">アクション</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-lg">
                                        請求書がありません。「一括作成」ボタンを押してください。<br />
                                        <small className="text-muted">※検針が済んでいない顧客の請求書は作成されません</small>
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((invoice: any) => (
                                    <tr key={invoice.id}>
                                        <td><StatusBadge status={invoice.status} /></td>
                                        <td className="font-bold">{invoice.customer.name}</td>
                                        <td>{invoice.meterReading.usage} m³</td>
                                        <td className="font-bold">¥{invoice.total.toLocaleString()}</td>
                                        <td>{invoice.issuedAt.toLocaleDateString()}</td>
                                        <td className="text-right">
                                            <Link href={`/invoices/${invoice.id}`} className="btn btn-secondary btn-sm">
                                                詳細 / 印刷
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
