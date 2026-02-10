import { getInvoice } from "@/app/invoices/actions";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function InvoicePage({ params }: { params: { id: string } }) {
    const invoice = await getInvoice(parseInt(params.id));

    if (!invoice) {
        notFound();
    }

    const { customer, meterReading } = invoice;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="page-actions mb-lg">
                <Link href="/invoices" className="btn btn-secondary">
                    ← 一覧に戻る
                </Link>
                <button
                    className="btn btn-primary"
                    onClick={() => window.print()}
                // Since this is a server component, I can't put onClick inline easily without 'use client'.
                // I'll make a small script or just let the user use browser print.
                // Actually, I'll make a client component for the print button.
                >
                    🖨️ 印刷 / PDF保存
                </button>
            </div>

            <div className="card p-xl" style={{ border: '1px solid #000' }}>
                {/* Invoice Header */}
                <div className="flex-between mb-xl pb-lg border-b">
                    <div>
                        <h1 className="text-2xl font-bold mb-sm">ガス使用料金等請求書</h1>
                        <div className="text-sm">
                            <u>{invoice.year}年 {invoice.month}月分</u>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm">請求書番号: {invoice.id.toString().padStart(6, '0')}</div>
                        <div className="text-sm">発行日: {invoice.issuedAt.toLocaleDateString()}</div>
                    </div>
                </div>

                {/* Addresses */}
                <div className="flex-between mb-xl items-start">
                    <div style={{ width: '50%' }}>
                        <div className="text-lg font-bold mb-sm underline">{customer.name} 様</div>
                        <div className="text-sm">{customer.address}</div>
                        <div className="text-sm">TEL: {customer.phone}</div>
                    </div>
                    <div className="text-right" style={{ width: '50%' }}>
                        <div className="font-bold">サンプルガス株式会社</div>
                        <div className="text-sm">〒100-0001 東京都千代田区...</div>
                        <div className="text-sm">TEL: 03-1234-5678</div>
                        <div className="text-sm">登録番号: T1234567890123</div>
                    </div>
                </div>

                {/* Total Amount */}
                <div className="text-center mb-xl p-lg bg-slate-100 border rounded">
                    <div className="text-sm mb-xs">今回ご請求金額 (税込)</div>
                    <div className="text-3xl font-bold">¥{invoice.total.toLocaleString()}</div>
                    <div className="text-xs text-muted mt-xs">支払期限: {invoice.dueDate.toLocaleDateString()}</div>
                </div>

                {/* Details Table */}
                <table className="w-full mb-xl" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                        <tr className="bg-slate-50 border-b-2 border-slate-200">
                            <th className="text-left p-sm">項目</th>
                            <th className="text-right p-sm">数量</th>
                            <th className="text-right p-sm">単価</th>
                            <th className="text-right p-sm">金額</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="p-sm">基本料金</td>
                            <td className="text-right p-sm">1 ヶ月</td>
                            <td className="text-right p-sm">¥{invoice.baseAmount.toLocaleString()}</td>
                            <td className="text-right p-sm">¥{invoice.baseAmount.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-sm">従量料金</td>
                            <td className="text-right p-sm">{meterReading.usage} m³</td>
                            <td className="text-right p-sm">¥{customer.unitPrice.toLocaleString()}</td>
                            <td className="text-right p-sm">¥{invoice.usageAmount.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-sm font-bold" colSpan={3}>小計 (税抜)</td>
                            <td className="text-right p-sm font-bold">¥{invoice.subtotal.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-sm" colSpan={3}>消費税 (10%)</td>
                            <td className="text-right p-sm">¥{invoice.tax.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Meter Reading Info */}
                <div className="mb-xl p-md border rounded text-sm">
                    <div className="font-bold mb-xs">【検針情報】</div>
                    <div className="flex gap-lg">
                        <div>今回指針: <strong>{meterReading.currentReading}</strong></div>
                        <div>前回指針: {meterReading.previousReading}</div>
                        <div>使用量: <strong>{meterReading.usage} m³</strong></div>
                        <div>検針日: {meterReading.readAt.toLocaleDateString()}</div>
                    </div>
                </div>

                {/* Footer / Bank Info */}
                <div className="text-sm p-md border-t-2 border-slate-200 mt-auto">
                    <div className="font-bold mb-xs">【お振込先】</div>
                    <div>○○銀行 ××支店 普通 1234567</div>
                    <div>口座名義: サンプルガス株式会社</div>
                </div>
            </div>

            {/* Simple script to handle print since onClick doesn't work in server component without hydration */}
            <script dangerouslySetInnerHTML={{
                __html: `
        function printPage() { window.print(); }
        document.querySelector('button.btn-primary').onclick = printPage;
      `}} />
        </div>
    );
}
