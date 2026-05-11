'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addShipmentUpdate } from './actions'
import { MapPin, Info } from 'lucide-react'

export default function ShipmentTrackingForm({ orderId, updates }: { orderId: string, updates: any[] }) {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!location || !status) return

    setLoading(true)
    const res = await addShipmentUpdate(orderId, location, status)
    setLoading(false)

    if (res.error) {
      alert(res.error)
    } else {
      setLocation('')
      setStatus('')
      router.refresh()
    }
  }

  return (
    <div className="mt-8 pt-8 border-t border-slate-100">
      <h3 className="text-lg font-black text-[#070864] mb-4">Update Pengiriman</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Lokasi Paket</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Gudang Transit Jakarta"
              className="w-full pl-9 pr-4 py-3 rounded-xl border-none bg-slate-50 focus:ring-2 focus:ring-[#070864]/20 outline-none transition-all text-sm font-medium text-slate-900"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status / Deskripsi</label>
          <div className="relative">
            <Info className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Contoh: Paket sedang diberangkatkan ke kota tujuan"
              className="w-full pl-9 pr-4 py-3 rounded-xl border-none bg-slate-50 focus:ring-2 focus:ring-[#070864]/20 outline-none transition-all text-sm font-medium text-slate-900"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !location || !status}
          className="w-full bg-[#070864] text-white px-4 py-3 rounded-xl text-xs font-bold hover:bg-[#0a0c8f] transition-colors disabled:opacity-50"
        >
          {loading ? 'Menambahkan...' : 'Tambah Update Pengiriman'}
        </button>
      </form>

      {updates && updates.length > 0 && (
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {updates.map((update, idx) => (
            <div key={update.id} className="relative flex items-start gap-4">
              <div className="w-4 h-4 rounded-full bg-[#070864] shrink-0 mt-1 relative z-10 shadow-[0_0_0_4px_#EEF2FA]" />
              <div className="flex flex-col bg-slate-50 p-3 rounded-xl flex-1 border border-slate-100">
                <span className="text-xs font-bold text-[#070864]">{update.location}</span>
                <span className="text-[10px] text-slate-500 mb-1">{new Date(update.timestamp).toLocaleString('id-ID')}</span>
                <span className="text-xs text-slate-700">{update.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
