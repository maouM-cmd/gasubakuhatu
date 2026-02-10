import React from 'react';

type StatusType = 'active' | 'inactive' | 'paid' | 'unpaid' | 'overdue';

interface StatusBadgeProps {
    status: string;
    labels?: Record<string, string>;
}

const defaultLabels: Record<string, string> = {
    active: '契約中',
    inactive: '解約済',
    paid: '支払済',
    unpaid: '未払',
    overdue: '期限切れ',
};

export default function StatusBadge({ status, labels = defaultLabels }: StatusBadgeProps) {
    const label = labels[status] || status;
    const className = `badge badge-${status}`;

    return (
        <span className={className}>
            {label}
        </span>
    );
}
