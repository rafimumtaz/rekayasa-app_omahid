'use client'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { getAllCustomOrders } from './actions'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function ExportButton({ status }: { status?: string }) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const data = await getAllCustomOrders(status)
      const doc = new jsPDF()
      
      doc.setFontSize(16)
      doc.text('Daftar Pesanan Kustom', 14, 15)
      
      const tableColumn = ["ID", "Produk", "Deskripsi", "Bahan", "Ukuran", "Harga", "Status"]
      const tableRows: any[] = []

      data.forEach(order => {
        const row = [
          order.displayId,
          order.productName,
          order.description,
          order.materials,
          order.dimensions,
          `Rp ${order.estimatedPrice?.toLocaleString('id-ID') || 0}`,
          order.status
        ]
        tableRows.push(row)
      })

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      })

      doc.save(`custom-orders-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-full text-sm font-bold transition-colors disabled:opacity-50"
    >
      <Download className="w-4 h-4" />
      {loading ? 'Mengekspor...' : 'Ekspor'}
    </button>
  )
}
