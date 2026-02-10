import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import StatusBadge from '@/components/StatusBadge';

async function getCustomersWithReadings(year: number, month: number) {
    return await prisma.customer.findMany({
        where: { status: 'active' },
        include: {
            meterReadings: {
                where: { year, month },
                take: 1,
            },
        },
        orderBy: { id: 'asc' },
    });
}

export default async function ReadingsPage({
    searchParams,
}: {
    searchParams: { year?: string; month?: string; q?: string };
}) {
    const now = new Date();
    const year = parseInt(searchParams.year || now.getFullYear().toString());
    const month = parseInt(searchParams.month || (now.getMonth() + 1).toString());
    const query = searchParams.q || '';

    const customers = await getCustomersWithReadings(year, month);

    // Filter in memory for simplicity if query is present, or update query
    const filteredCustomers = query
        ? customers.filter((c: any) => c.name.includes(query) || c.address.includes(query))
        : customers;

    // Simple progress stats
    const total = filteredCustomers.length;
    const completed = filteredCustomers.filter((c: any) => c.meterReadings.length > 0).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div>
            <div className="page-header">
                <div className="flex-between">
                    <h1>
                        <span>📊</span> 検針データ入力
                    </h1>
                    <div className="flex gap-md">
                        <Link
                            href={`/readings?year=${month === 1 ? year - 1 : year}&month=${month === 1 ? 12 : month - 1}`}
                            className="btn btn-secondary btn-sm"
                        >
                            ← 前月
                        </Link>
                        <span className="font-bold" style={{ fontSize: '1.2rem', padding: '0 1rem' }}>
                            {year}年 {month}月
                        </span>
                        <Link
                            href={`/readings?year=${month === 12 ? year + 1 : year}&month=${month === 12 ? 1 : month + 1}`}
                            className="btn btn-secondary btn-sm"
                        >
                            翌月 →
                        </Link>
                    </div>
                </div>
            </div>

            <div className="stats-grid mb-lg">
                <div className="stat-card" style={{ padding: '1.5rem', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <div className="text-sm text-muted">検針進捗</div>
                        <div className="text-xl font-bold">{completed} / {total} 件</div>
                    </div>
                    <div style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: `conic-gradient(var(--color-primary) ${progress}%, var(--color-border) 0)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <span style={{ background: 'white', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {progress}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <form className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            name="q"
                            defaultValue={query}
                            placeholder="顧客名で検索..."
                            autoComplete="off"
                        />
                        {/* Preserve year/month in search */}
                        <input type="hidden" name="year" value={year} />
                        <input type="hidden" name="month" value={month} />
                    </form>
                </div>

                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>状態</th>
                                <th>顧客名</th>
                                <th>住所</th>
                                <th>前回指針</th>
                                <th>今回指針</th>
                                <th>使用量</th>
                                <th className="text-right">アクション</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center p-lg">データがありません</td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer: any) => {
                                    const reading = customer.meterReadings[0];
                                    return (
                                        <tr key={customer.id}>
                                            <td>
                                                {reading ? (
                                                    <span className="badge badge-active">完了</span>
                                                ) : (
                                                    <span className="badge badge-inactive">未検針</span>
                                                )}
                                            </td>
                                            <td className="font-bold">{customer.name}</td>
                                            <td className="text-sm text-muted">{customer.address}</td>
                                            <td>
                                                {reading ? reading.previousReading : '-'}
                                            </td>
                                            <td>
                                                {reading ? <strong>{reading.currentReading}</strong> : '-'}
                                            </td>
                                            <td>
                                                {reading ? `${reading.usage} m³` : '-'}
                                            </td>
                                            <td className="text-right">
                                                {reading ? (
                                                    <button className="btn btn-secondary btn-sm" disabled>
                                                        修正（未実装）
                                                    </button>
                                                ) : (
                                                    <Link
                                                        href={`/readings/${customer.id}/new?year=${year}&month=${month}`}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        📷 検針入力
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
