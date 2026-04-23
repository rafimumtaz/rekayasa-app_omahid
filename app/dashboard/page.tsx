'use client'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [user, setUser] = useState<{name: string} | null>(null)
  
  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if(d.user) setUser(d.user)
    }).catch(() => {})
  }, [])

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <h3 className="text-2xl font-bold text-slate-800 mb-2">Selamat Datang, {user?.name || 'Admin'}!</h3>
      <p className="text-slate-500 text-sm">
        Ini adalah tampilan awal dashboard admin. Anda berhasil login ke sistem menggunakan token JWT.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-[#F7F9FD] p-6 rounded-2xl border border-blue-50">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Produk</p>
          <p className="text-3xl font-black text-[#070864]">5</p>
        </div>
        <div className="bg-[#F7F9FD] p-6 rounded-2xl border border-blue-50">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Pesanan Baru</p>
          <p className="text-3xl font-black text-[#070864]">12</p>
        </div>
        <div className="bg-[#F7F9FD] p-6 rounded-2xl border border-blue-50">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Pendapatan</p>
          <p className="text-3xl font-black text-[#070864]">Rp 8.5M</p>
        </div>
      </div>
    </div>
  )
}
