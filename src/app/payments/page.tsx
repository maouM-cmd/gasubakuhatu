import Link from 'next/link';
import { getUnpaidInvoices, getPayments, registerPayment } from './actions';
import StatusBadge from '@/components/StatusBadge';

// Helper component for payment modal (can be enhanced later to be precise modal)
// For now, we'll just have a separate page or inline form. 
// Let's use a simple inline form trick or just a separate page for clarity.
// Actually, `src/app/payments/[invoiceId]/new/page.tsx` is cleanest.

export default async function PaymentsPage() {
    const unpaidInvoices = await getUnpaidInvoices();
    const recentPayments = await getPayments();

    return (
        <div>
            <div className="page-header">
                <h1>
                    <span>💰</span> 入金管理
                </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-lg">
                {/* Unpaid Invoices Section */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="text-warning">⚠️ 未入金チェック</h2>
                    </div>
                    <div className="card-body p-0">
                        {unpaidInvoices.length === 0 ? (
                            <div className="p-lg text-center text-muted">
                                未入金の請求書はありません 🎉
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b">
                                        <th className="p-sm text-left">顧客</th>
                                        <th className="p-sm text-left">対象月</th>
                                        <th className="p-sm text-right">金額</th>
                                        <th className="p-sm text-right">期限</th>
                                        <th className="p-sm"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unpaidInvoices.map((inv) => (
                                        <tr key={inv.id} className="border-b">
                                            <td className="p-sm">{inv.customer.name}</td>
                                            <td className="p-sm">{inv.year}/{inv.month}</td>
                                            <td className="p-sm text-right font-bold">¥{inv.total.toLocaleString()}</td>
                                            <td className="p-sm text-right text-muted">{inv.dueDate.toLocaleDateString()}</td>
                                            <td className="p-sm text-right">
                                                <Link
                                                    href={`/payments/${inv.id}/new`}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    入金
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Recent Payments Section */}
                <div className="card">
                    <div className="card-header">
                        <h2>📝 最近の入金履歴</h2>
                    </div>
                    <div className="card-body p-0">
                        {recentPayments.length === 0 ? (
                            <div className="p-lg text-center text-muted">
                                入金履歴がありません
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b">
                                        <th className="p-sm text-left">顧客</th>
                                        <th className="p-sm text-left">入金日</th>
                                        <th className="p-sm text-right">金額</th>
                                        <th className="p-sm text-center">方法</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPayments.map((pay) => (
                                        <tr key={pay.id} className="border-b">
                                            <td className="p-sm">{pay.invoice.customer.name}</td>
                                            <td className="p-sm">{pay.paidAt.toLocaleDateString()}</td>
                                            <td className="p-sm text-right font-bold">¥{pay.amount.toLocaleString()}</td>
                                            <td className="p-sm text-center">
                                                <span className="badge badge-inactive">{pay.method === 'cash' ? '現金' : '振込'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
