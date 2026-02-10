import Link from 'next/link';
import { getCustomers } from './actions';
import StatusBadge from '@/components/StatusBadge';

export default async function CustomersPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const query = searchParams.q || '';
    const customers = await getCustomers(query);

    return (
        <div>
            <div className="page-header">
                <div className="flex-between">
                    <div>
                        <h1>
                            <span>👥</span> 顧客管理
                        </h1>
                        <p>顧客情報の登録・編集・検索ができます。</p>
                    </div>
                    <Link href="/customers/new" className="btn btn-primary">
                        + 新規登録
                    </Link>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <form className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            name="q"
                            defaultValue={query}
                            placeholder="名前、住所、電話番号で検索..."
                            autoComplete="off"
                        />
                    </form>
                </div>

                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ステータス</th>
                                <th>氏名</th>
                                <th>住所</th>
                                <th>電話番号</th>
                                <th>契約プラン</th>
                                <th className="text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center" style={{ padding: '3rem' }}>
                                        <div style={{ opacity: 0.5, fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                                        <div>データが見つかりません</div>
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>
                                            <StatusBadge status={customer.status} />
                                        </td>
                                        <td className="font-bold">{customer.name}</td>
                                        <td>{customer.address}</td>
                                        <td>{customer.phone}</td>
                                        <td>
                                            <div className="text-sm">{customer.planName}</div>
                                            <div className="text-xs text-muted">Base: ¥{customer.basePrice} / Unit: ¥{customer.unitPrice}</div>
                                        </td>
                                        <td className="text-right">
                                            <Link href={`/customers/${customer.id}`} className="btn btn-secondary btn-sm">
                                                詳細 / 編集
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
