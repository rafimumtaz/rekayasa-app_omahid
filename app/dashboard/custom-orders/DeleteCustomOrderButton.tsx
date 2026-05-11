'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { deleteCustomOrder } from './actions'
import { useRouter } from 'next/navigation'

export default function DeleteCustomOrderButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus pesanan kustom ini?')) {
      setIsDeleting(true)
      try {
        await deleteCustomOrder(id)
        router.refresh()
      } catch (e) {
        console.error(e)
        alert('Gagal menghapus pesanan kustom')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Hapus"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
