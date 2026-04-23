'use client'

import { Trash2, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface DeleteImageButtonProps {
  imageId: string
  onDelete: (imageId: string) => Promise<void>
}

export default function DeleteImageButton({ imageId, onDelete }: DeleteImageButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
      setLoading(true)
      try {
        await onDelete(imageId)
      } catch (error) {
        console.error('Failed to delete image:', error)
        alert('Gagal menghapus gambar')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 disabled:opacity-50"
      title="Hapus Gambar"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  )
}
