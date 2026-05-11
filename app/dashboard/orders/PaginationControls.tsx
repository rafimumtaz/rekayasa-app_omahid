'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

export default function PaginationControls({ 
  currentPage, 
  totalPages,
  totalItems,
  currentItemsCount
}: { 
  currentPage: number, 
  totalPages: number,
  totalItems: number,
  currentItemsCount: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/dashboard/orders?${params.toString()}`)
  }

  const generatePages = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
      <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
        MENAMPILKAN {currentItemsCount > 0 ? ((currentPage - 1) * 10 + 1) : 0} - {Math.min(currentPage * 10, totalItems)} DARI {totalItems} PESANAN
      </div>
      <div className="flex items-center gap-1">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-[#070864] hover:bg-slate-50 rounded-full transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {generatePages().map((page, idx) => (
          typeof page === 'number' ? (
            <button
              key={idx}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${
                currentPage === page 
                  ? 'bg-[#070864] text-white' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ) : (
            <div key={idx} className="w-8 h-8 flex items-center justify-center text-slate-400">
              <MoreHorizontal className="w-4 h-4" />
            </div>
          )
        ))}

        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-[#070864] hover:bg-slate-50 rounded-full transition-colors disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
