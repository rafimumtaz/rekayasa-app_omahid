import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import OrderActionForm from './OrderActionForm'
import ShipmentTrackingForm from './ShipmentTrackingForm'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: { include: { product: true } },
      shipmentUpdates: { orderBy: { timestamp: 'desc' } }
    }
  })

  if (!order) notFound()

  return (
    <div className="space-y-6">
      <Link href="/dashboard/orders" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#070864] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Pesanan
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left: Order Details */}
        <div className="bg-white rounded-3xl p-8 shadow-sm space-y-8">
          <div>
            <h3 className="text-xl font-black text-[#070864] mb-4">Informasi Pesanan</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">ID Pesanan</p>
                <p className="font-mono text-sm font-bold text-slate-800">{order.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Tanggal Transaksi</p>
                <p className="text-sm font-bold text-slate-800">{order.createdAt.toLocaleString('id-ID')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Pelanggan</p>
                <p className="text-sm font-bold text-slate-800">{order.user.name}</p>
                <p className="text-xs text-slate-500">{order.user.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Total Nilai</p>
                <p className="text-lg font-black text-green-600">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black text-[#070864] mb-4">Item Pesanan</h3>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <p className="font-bold text-[#070864]">{item.product.name}</p>
                    <p className="text-sm text-slate-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  <p className="font-black text-green-600">Rp {(item.quantity * item.price).toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>
          </div>

          {order.customNotes && (
            <div>
              <h3 className="text-xl font-black text-[#070864] mb-2">Catatan Pelanggan (Pre-Order)</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700">
                {order.customNotes}
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm h-fit">
            <h3 className="text-xl font-black text-[#070864] mb-6">Manajemen Status</h3>
            <OrderActionForm order={order as any} />
          </div>

          {order.status === 'SHIPPED' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm h-fit">
              <ShipmentTrackingForm orderId={order.id} updates={order.shipmentUpdates} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
