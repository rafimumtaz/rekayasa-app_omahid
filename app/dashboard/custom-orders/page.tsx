import { prisma } from '@/lib/prisma'
import { Plus, Edit } from 'lucide-react'
import Link from 'next/link'
import CustomOrderFilter from './CustomOrderFilter'
import ExportButton from './ExportButton'
import PaginationControls from './PaginationControls'
import DeleteCustomOrderButton from './DeleteCustomOrderButton'

export const dynamic = 'force-dynamic'

function formatCurrency(value: number | null) {
  if (!value) return '-'
  return `Rp ${value.toLocaleString('id-ID')}`
}

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  let interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' jam yang lalu'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' menit yang lalu'
  }
  return 'Baru saja'
}

export default async function CustomOrdersPage({
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

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    orders,
    totalOrdersFilteredCount,
    totalOrdersCount,
    inProcessCount,
    waitingPaymentCount,
    completedThisMonthCount,
    recentActivities
  ] = await Promise.all([
    prisma.customOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { user: true, images: true }
    }),
    prisma.customOrder.count({ where }),
    prisma.customOrder.count(),
    prisma.customOrder.count({ where: { status: 'PRODUKSI' } }),
    prisma.customOrder.count({ where: { status: { in: ['PENDING', 'REVIEW'] } } }),
    prisma.customOrder.count({ 
      where: { 
        status: 'SELESAI',
        updatedAt: { gte: startOfMonth }
      } 
    }),
    prisma.customOrder.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 3,
      select: { displayId: true, status: true, updatedAt: true, user: { select: { name: true } } }
    })
  ])

  const totalPages = Math.ceil(totalOrdersFilteredCount / limit)

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-[#070864] font-serif mb-2">Custom Order</h2>
          <p className="text-slate-500 font-medium">Kelola permintaan desain furnitur khusus dari pelanggan.</p>
        </div>
        <div className="flex items-center">
          <Link href="/dashboard/custom-orders/add" className="flex items-center bg-[#070864] hover:bg-[#0a0c8f] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Buat Pesanan Kustom
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-[32px] p-8 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">Total Permintaan</p>
          <h3 className="text-3xl font-black text-[#070864]">{totalOrdersCount}</h3>
        </div>
        <div className="bg-white rounded-[32px] p-8 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">Dalam Proses</p>
          <h3 className="text-3xl font-black text-[#c78822]">{inProcessCount}</h3>
        </div>
        <div className="bg-white rounded-[32px] p-8 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">Menunggu Pembayaran</p>
          <h3 className="text-3xl font-black text-[#e55353]">{waitingPaymentCount}</h3>
        </div>
        <div className="bg-white rounded-[32px] p-8 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">Selesai Bulan Ini</p>
          <h3 className="text-3xl font-black text-[#070864]">{completedThisMonthCount}</h3>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-[#070864] font-serif">Daftar Pesanan Kustom</h3>
          <div className="flex items-center gap-3">
            <CustomOrderFilter />
            <ExportButton status={resolvedParams.status} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="py-4 px-4 font-bold text-slate-500 text-[10px] tracking-widest uppercase rounded-l-xl">Produk Custom</th>
                <th className="py-4 px-4 font-bold text-slate-500 text-[10px] tracking-widest uppercase">Deskripsi & Bahan</th>
                <th className="py-4 px-4 font-bold text-slate-500 text-[10px] tracking-widest uppercase">Ukuran</th>
                <th className="py-4 px-4 font-bold text-slate-500 text-[10px] tracking-widest uppercase">Estimasi Harga</th>
                <th className="py-4 px-4 font-bold text-slate-500 text-[10px] tracking-widest uppercase">Status</th>
                <th className="py-4 px-4 font-bold text-slate-500 text-[10px] tracking-widest uppercase rounded-r-xl">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        {order.images && order.images.length > 0 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={order.images[0].url} alt={order.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#070864]/10" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-[#070864]">{order.productName}</span>
                        <span className="text-[10px] font-bold text-slate-400">ID: {order.displayId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-slate-600 truncate max-w-[200px]">{order.description}</span>
                      <div className="flex flex-wrap gap-1">
                        {order.materials.split(',').map((material, idx) => (
                          <span key={idx} className="bg-blue-50 text-blue-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            {material.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-bold text-slate-600">{order.dimensions}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-black text-[#070864]">{formatCurrency(order.estimatedPrice)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                      order.status === 'PENDING' ? 'bg-red-100 text-red-600' :
                      order.status === 'REVIEW' ? 'bg-slate-200 text-slate-600' :
                      order.status === 'PRODUKSI' ? 'bg-orange-100 text-orange-600' :
                      order.status === 'SELESAI' ? 'bg-blue-100 text-blue-600' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/dashboard/custom-orders/${order.id}/edit`}
                        className="p-2 text-slate-400 hover:text-[#070864] hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteCustomOrderButton id={order.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    Tidak ada pesanan kustom ditemukan.
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

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1b327b] rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-center min-h-[240px]">
          <div className="relative z-10 max-w-md ml-auto text-right md:text-left md:ml-48">
            <h3 className="text-2xl font-serif font-bold text-white mb-3">Ingat Detail Pengerjaan</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Pesanan kustom memerlukan perhatian ekstra pada bahan. Pastikan stok kayu Jati dan Walnut selalu diverifikasi sebelum menyetujui estimasi harga pelanggan.
            </p>
            <button className="bg-white text-[#070864] hover:bg-slate-100 px-6 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-colors inline-block">
              Buka Ledger Bahan
            </button>
          </div>
          {/* Dummy worker image / illustration placeholder */}
          <div className="absolute left-8 bottom-0 w-40 h-48 bg-white/10 rounded-t-3xl hidden md:block border border-white/20"></div>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-sm">
          <h3 className="text-lg font-serif font-bold text-[#070864] mb-6">Aktivitas Terbaru</h3>
          <div className="space-y-6">
            {recentActivities.length > 0 ? recentActivities.map((activity, idx) => (
              <div key={idx} className="flex gap-4">
                <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                  activity.status === 'PENDING' ? 'bg-red-500' :
                  activity.status === 'REVIEW' ? 'bg-slate-300' :
                  activity.status === 'PRODUKSI' ? 'bg-orange-500' :
                  activity.status === 'SELESAI' ? 'bg-blue-500' :
                  'bg-slate-300'
                }`} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#070864]">
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1).toLowerCase()}: {activity.displayId}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {timeAgo(activity.updatedAt)} oleh {activity.user?.name || 'Admin'}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-sm text-slate-400">Belum ada aktivitas.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
