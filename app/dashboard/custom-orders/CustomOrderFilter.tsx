'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'

export default function CustomOrderFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get('status') || ''

  const statuses = [
    { value: '', label: 'Semua Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'REVIEW', label: 'Review' },
    { value: 'PRODUKSI', label: 'Produksi' },
    { value: 'SELESAI', label: 'Selesai' },
    { value: 'BATAL', label: 'Batal' },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    const params = new URLSearchParams(searchParams)
    if (newStatus) {
      params.set('status', newStatus)
    } else {
      params.delete('status')
    }
    params.delete('page') 
    router.push(`/dashboard/custom-orders?${params.toString()}`)
  }

  return (
    <div className="relative inline-flex items-center bg-slate-100 hover:bg-slate-200 transition-colors rounded-full px-4 py-2.5">
      <Filter className="w-4 h-4 text-slate-700 mr-2" />
      <select 
        value={currentStatus}
        onChange={handleChange}
        className="bg-transparent text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer pr-4"
        style={{
           WebkitAppearance: 'none',
           MozAppearance: 'none'
        }}
      >
        {statuses.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
        ▼
      </div>
    </div>
  )
}
