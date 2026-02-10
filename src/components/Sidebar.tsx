'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path ? 'active' : '';
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">🔥</div>
                <div>
                    <div className="sidebar-title">ガス爆発</div>
                    <div className="sidebar-subtitle">顧客・請求管理システム</div>
                </div>
            </div>

            <nav className="sidebar-nav">
                <Link href="/" className={`sidebar-link ${isActive('/')}`}>
                    <span className="sidebar-link-icon">🏠</span>
                    <span>ダッシュボード</span>
                </Link>

                <Link href="/customers" className={`sidebar-link ${isActive('/customers')}`}>
                    <span className="sidebar-link-icon">👥</span>
                    <span>顧客管理</span>
                </Link>

                <Link href="/readings" className={`sidebar-link ${isActive('/readings')}`}>
                    <span className="sidebar-link-icon">📊</span>
                    <span>検針入力</span>
                </Link>

                <Link href="/invoices" className={`sidebar-link ${isActive('/invoices')}`}>
                    <span className="sidebar-link-icon">📄</span>
                    <span>請求書管理</span>
                </Link>

                <Link href="/payments" className={`sidebar-link ${isActive('/payments')}`}>
                    <span className="sidebar-link-icon">💰</span>
                    <span>入金管理</span>
                </Link>

                <div style={{ flex: 1 }}></div>

                <Link href="/settings" className={`sidebar-link ${isActive('/settings')}`}>
                    <span className="sidebar-link-icon">⚙️</span>
                    <span>設定</span>
                </Link>
            </nav>

            <div className="sidebar-footer">
                © 2024 Gas Bakuhatsu Inc.
            </div>
        </aside>
    );
}
