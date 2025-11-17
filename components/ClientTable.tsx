// components/ClientTable.tsx
'use client';

import { 
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState
} from '@tanstack/react-table';
import { ArrowUpDown, Search, User, Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

// --- Tipe Data (Sesuai dengan skema Prisma Anda) ---
interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: Date;
}

interface ClientTableProps {
  data: ClientData[];
}

const columnHelper = createColumnHelper<ClientData>();

// --- DEFINISI KOLOM ---
const columns = [
  columnHelper.accessor('name', {
    header: ({ column }) => (
      <button className="flex items-center" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <User className="w-4 h-4 mr-2" /> Nama Klien
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    cell: info => <p className="font-semibold text-gray-800">{info.getValue()}</p>,
  }),
  columnHelper.accessor('email', {
    header: () => <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /> Email</div>,
    cell: info => <p className="text-sm text-gray-600">{info.getValue()}</p>,
  }),
  columnHelper.accessor('phone', {
    header: () => <div className="flex items-center"><Phone className="w-4 h-4 mr-2" /> Telepon</div>,
    cell: info => info.getValue() || <span className="text-gray-400 italic">N/A</span>,
  }),
  columnHelper.accessor('createdAt', {
    header: ({ column }) => (
      <button className="flex items-center" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <Calendar className="w-4 h-4 mr-2" /> Terdaftar
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    cell: info => format(new Date(info.getValue()), 'dd MMM yyyy'),
  }),
];


// --- KOMPONEN UTAMA ---
export default function ClientTable({ data }: ClientTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Daftar Klien Anda</h2>
        
        {/* Input Pencarian Global */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Cari nama atau email..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm w-64 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {/* Indikator Sort */}
                    {{
                      asc: <span className="ml-1">▲</span>,
                      desc: <span className="ml-1">▼</span>,
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            
            {/* Jika tidak ada data */}
            {table.getRowModel().rows.length === 0 && (
                <tr>
                    <td colSpan={columns.length} className="text-center py-10 text-gray-500 italic">
                        Tidak ada klien yang cocok dengan pencarian Anda.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}