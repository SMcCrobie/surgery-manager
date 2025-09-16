import { useState, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender
} from '@tanstack/react-table';
import { API_BASE_URL } from '../config/api';

const SurgeryList = ({ onViewSurgery, onAddSurgery }) => {
    const [surgeries, setSurgeries] = useState([]);
    const [sorting, setSorting] = useState([]);

    function fetchSurgeries() {
        fetch(`${API_BASE_URL}/surgeries`)
            .then(response => response.json())
            .then(data => setSurgeries(data))
            .catch(error => console.error('Error:', error));
    }

    useEffect(() => {
        fetchSurgeries();
    }, []);

    function cancelSurgery(id) {
        fetch(`${API_BASE_URL}/surgeries/${id}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }})
            .then(response => response.json())
            .then(data => console.log('Cancelled:', data))
            .then(fetchSurgeries);
    }

    const columns = [
        {
            accessorKey: 'surgeryType',
            header: 'Surgery Type',
            size: 200,
        },
        {
            accessorKey: 'dateTime',
            header: 'Date & Time',
            size: 180,
            cell: info => new Date(info.getValue()).toLocaleString(),
        },
        {
            accessorKey: 'surgeon',
            header: 'Surgeon',
            size: 150,
        },
        {
            accessorKey: 'patient.name',
            header: 'Patient',
            size: 150,
        },
        {
            id: 'actions',
            header: 'Actions',
            size: 200,
            enableSorting: false,
            cell: ({ row }) => (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => onViewSurgery(row.original._id)}
                        style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => cancelSurgery(row.original._id)}
                        style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: surgeries,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <h2 style={{ margin: 0, color: 'white', fontSize: '2rem' }}>Upcoming Surgeries</h2>
                <button
                    onClick={() => onAddSurgery()}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    + Add Surgery
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    style={{
                                        width: header.getSize(),
                                        padding: '0.75rem',
                                        border: '1px solid #ddd',
                                        backgroundColor: '#f8f9fa',
                                        textAlign: 'left',
                                        fontWeight: '600',
                                        color: '#333',
                                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                        userSelect: 'none'
                                    }}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getCanSort() && (
                                            <span style={{ fontSize: '0.75rem' }}>
                                                    {{
                                                        asc: '🔼',
                                                        desc: '🔽',
                                                    }[header.column.getIsSorted()] ?? '↕️'}
                                                </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map((row, index) => (
                        <tr
                            key={row.id}
                            style={{
                                backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                            }}
                        >
                            {row.getVisibleCells().map(cell => (
                                <td
                                    key={cell.id}
                                    style={{
                                        width: cell.column.getSize(),
                                        padding: '0.75rem',
                                        border: '1px solid #ddd',
                                        color: '#333'
                                    }}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1rem',
                padding: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '4px',
                color: '#333'
            }}>
                <div style={{ fontSize: '0.875rem', color: '#333' }}>
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}{' '}
                    of {table.getFilteredRowModel().rows.length} entries
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        style={{
                            padding: '0.25rem 0.5rem',
                            border: '1px solid #ddd',
                            backgroundColor: table.getCanPreviousPage() ? 'white' : '#f5f5f5',
                            color: '#333',
                            cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed',
                            borderRadius: '4px'
                        }}
                    >
                        {'<<'}
                    </button>
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        style={{
                            padding: '0.25rem 0.5rem',
                            border: '1px solid #ddd',
                            backgroundColor: table.getCanPreviousPage() ? 'white' : '#f5f5f5',
                            color: '#333',
                            cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed',
                            borderRadius: '4px'
                        }}
                    >
                        {'<'}
                    </button>

                    <span style={{
                        padding: '0.25rem 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#333'
                    }}>
                        Page{' '}
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </strong>
                    </span>

                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        style={{
                            padding: '0.25rem 0.5rem',
                            border: '1px solid #ddd',
                            backgroundColor: table.getCanNextPage() ? 'white' : '#f5f5f5',
                            color: '#333',
                            cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed',
                            borderRadius: '4px'
                        }}
                    >
                        {'>'}
                    </button>
                    <button
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                        style={{
                            padding: '0.25rem 0.5rem',
                            border: '1px solid #ddd',
                            backgroundColor: table.getCanNextPage() ? 'white' : '#f5f5f5',
                            color: '#333',
                            cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed',
                            borderRadius: '4px'
                        }}
                    >
                        {'>>'}
                    </button>
                </div>

                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                    style={{
                        padding: '0.25rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        color: '#333',
                        backgroundColor: 'white'
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SurgeryList;