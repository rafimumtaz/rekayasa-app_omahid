import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Eye, Plus, Wrench, Truck, Wallet, Activity } from 'lucide-react'
import OrderFilter from './OrderFilter'
import PaginationControls from './PaginationControls'

export const dynamic = 'force-dynamic'

function formatRevenue(value: number) {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(1)}K`
  }
  return `Rp ${value.toLocaleString('id-ID')}`
}

function getInitials(name: string) {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

export default async function AdminOrdersPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string, status?: string }>
}) {
  const resolvedParams = await searchParams
  const currentPage = Number(resolvedParams.page) || 1
  const limit = 10
  const skip = (currentPage - 1) * limit
  const statusFilter = resolvedParams.status as any

  const where = statusFilter ? { status: statusFilter } : {}

  const [
    orders,
    totalOrdersFilteredCount,
    totalOrdersCount,
    processingCount,
    shippedCount,
    revenueData
  ] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.order.count({ where }),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PROCESSING' } }),
    prisma.order.count({ where: { status: 'SHIPPED' } }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: { notIn: ['CANCELED'] }
      }
    })
  ])

  const totalRevenue = revenueData._sum.totalAmount || 0
  const totalPages = Math.ceil(totalOrdersFilteredCount / limit)

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-[#070864] font-serif mb-2">Daftar Pesanan</h2>
          <p className="text-slate-500 font-medium">Kelola dan pantau seluruh transaksi furniture pelanggan.</p>
        </div>
        <div className="flex items-center gap-3">
          <OrderFilter />
          <button className="flex items-center bg-[#070864] hover:bg-[#0a0c8f] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Pesanan Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-[32px] p-8 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">Total Pesanan</p>
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-black text-[#070864]">{totalOrdersCount.toLocaleString('id-ID')}</h3>
            <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded-md">+12%</span>
          </div>
        </div>
        <div className="bg-white rounded-[32px] p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">Dalam Produksi</p>
          <h3 className="text-3xl font-black text-[#070864]">{processingCount.toLocaleString('id-ID')}</h3>
          <Wrench className="absolute bottom-8 right-8 w-8 h-8 text-slate-200 group-hover:text-amber-200 transition-colors" />
        </div>
        <div className="bg-white rounded-[32px] p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">Siap Kirim</p>
          <h3 className="text-3xl font-black text-[#070864]">{shippedCount.toLocaleString('id-ID')}</h3>
          <Truck className="absolute bottom-8 right-8 w-8 h-8 text-slate-200 group-hover:text-emerald-200 transition-colors" />
        </div>
        <div className="bg-white rounded-[32px] p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">Total Pendapatan</p>
          <h3 className="text-3xl font-black text-[#070864] truncate pr-8">{formatRevenue(totalRevenue)}</h3>
          <Wallet className="absolute bottom-8 right-8 w-8 h-8 text-slate-200 group-hover:text-blue-200 transition-colors" />
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-8 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-4 font-bold text-slate-400 text-[11px] tracking-wider uppercase">ID Pesanan</th>
                <th className="py-4 px-4 font-bold text-slate-400 text-[11px] tracking-wider uppercase">Pelanggan</th>
                <th className="py-4 px-4 font-bold text-slate-400 text-[11px] tracking-wider uppercase">Tanggal</th>
                <th className="py-4 px-4 font-bold text-slate-400 text-[11px] tracking-wider uppercase">Total</th>
                <th className="py-4 px-4 font-bold text-slate-400 text-[11px] tracking-wider uppercase">Status</th>
                <th className="py-4 px-4 font-bold text-slate-400 text-[11px] tracking-wider uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-4">
                    <span className="font-bold text-[#070864] text-sm">#OM-{order.id.substring(order.id.length - 5)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {getInitials(order.user.name || order.user.email)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-[#070864]">{order.user.name || 'User'}</span>
                        <span className="text-xs text-slate-400">{order.user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-slate-500">
                    {order.createdAt.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: '2-digit' })}
                  </td>
                  <td className="py-4 px-4 text-sm font-black text-[#070864]">
                    Rp {order.totalAmount.toLocaleString('id-ID')}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                      order.status === 'PENDING' ? 'bg-slate-100 text-slate-600' :
                      order.status === 'PAID' ? 'bg-blue-50 text-blue-500' :
                      order.status === 'PROCESSING' ? 'bg-amber-50 text-amber-500' :
                      order.status === 'SHIPPED' ? 'bg-emerald-50 text-emerald-500' :
                      order.status === 'COMPLETED' ? 'bg-teal-50 text-teal-500' :
                      'bg-red-50 text-red-500'
                    }`}>
                      {order.status === 'PENDING' ? 'Menunggu' :
                       order.status === 'PAID' ? 'Dibayar' :
                       order.status === 'PROCESSING' ? 'Diproses' :
                       order.status === 'SHIPPED' ? 'Pengiriman' :
                       order.status === 'COMPLETED' ? 'Selesai' :
                       'Batal'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/dashboard/orders/${order.id}`}
                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-[#070864] hover:text-white flex items-center justify-center transition-all"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    Tidak ada pesanan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalOrdersFilteredCount > 0 && (
          <PaginationControls 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalOrdersFilteredCount}
            currentItemsCount={orders.length}
          />
        )}
      </div>
    </div>
  )
}
