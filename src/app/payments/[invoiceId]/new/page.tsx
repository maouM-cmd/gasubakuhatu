import { registerPayment } from "@/app/payments/actions";
import { getInvoice } from "@/app/invoices/actions";
import { notFound } from "next/navigation";
import Link from "next/link";

function SubmitButton() {
    return (
        <button type="submit" className="btn btn-primary w-full">
            入金確定
        </button>
    );
}

export default async function NewPaymentPage({ params }: { params: { invoiceId: string } }) {
    const invoiceId = parseInt(params.invoiceId);
    // Re-using getInvoice from payments/actions is fine if it exports it or if I duplicate helper.
    // Wait, I didn't export getInvoice from payments/actions. 
    // I should import it from `app/invoices/actions` where it IS exported.
    const { getInvoice } = await import("@/app/invoices/actions");

    const invoice = await getInvoice(invoiceId);

    if (!invoice) {
        notFound();
    }

    const { customer, meterReading } = invoice;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="page-header">
                <h1>
                    <span>💰</span> 入金登録
                </h1>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>請求概要</h2>
                </div>
                <div className="card-body bg-slate-50">
                    <div className="flex-between mb-sm">
                        <span className="text-muted">顧客名</span>
                        <span className="font-bold">{customer.name} 様</span>
                    </div>
                    <div className="flex-between mb-sm">
                        <span className="text-muted">対象・請求番号</span>
                        <span>{invoice.year}年{invoice.month}月分 (No.{invoice.id})</span>
                    </div>
                    <div className="flex-between border-t pt-sm mt-sm">
                        <span className="font-bold">請求金額 (税込)</span>
                        <span className="font-bold text-xl text-primary">¥{invoice.total.toLocaleString()}</span>
                    </div>
                </div>

                <div className="card-body border-t">
                    <form action={registerPayment}>
                        <input type="hidden" name="invoiceId" value={invoice.id} />

                        <div className="form-group">
                            <label className="form-label" htmlFor="amount">入金額</label>
                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                className="form-input font-bold text-lg"
                                defaultValue={invoice.total}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="method">入金方法</label>
                            <select id="method" name="method" className="form-select">
                                <option value="cash">現金</option>
                                <option value="transfer">銀行振込</option>
                                <option value="other">その他</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="paidAt">入金日</label>
                            <input
                                id="paidAt"
                                name="paidAt"
                                type="date"
                                className="form-input"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="note">備考</label>
                            <input
                                id="note"
                                name="note"
                                type="text"
                                className="form-input"
                                placeholder="任意"
                            />
                        </div>

                        <div className="flex gap-md mt-xl">
                            <Link href="/payments" className="btn btn-secondary w-full">キャンセル</Link>
                            <SubmitButton />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
