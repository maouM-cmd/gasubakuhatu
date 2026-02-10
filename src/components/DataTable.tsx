import React from 'react';

interface DataTableProps<T> {
    columns: {
        header: string;
        accessor: keyof T | ((row: T) => React.ReactNode);
        className?: string;
    }[];
    data: T[];
    keyField?: keyof T;
    onRowClick?: (row: T) => void;
    emptyMessage?: string;
}

export default function DataTable<T extends Record<string, any>>({
    columns,
    data,
    keyField = 'id',
    onRowClick,
    emptyMessage = 'データがありません'
}: DataTableProps<T>) {
    if (!data || data.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="data-table-wrapper">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className={col.className}>{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={String(row[keyField]) || rowIndex}
                            onClick={() => onRowClick && onRowClick(row)}
                            style={onRowClick ? { cursor: 'pointer' } : {}}
                        >
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className={col.className}>
                                    {typeof col.accessor === 'function'
                                        ? col.accessor(row)
                                        : row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
