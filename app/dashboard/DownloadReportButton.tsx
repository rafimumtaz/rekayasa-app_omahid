'use client'

import { Download } from 'lucide-react'
import { useState } from 'react'
import { getDashboardReportData } from './actions'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function DownloadReportButton() {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const { orders, customOrders } = await getDashboardReportData()
      
      const doc = new jsPDF()
      
      doc.setFontSize(16)
      doc.text('Laporan Penjualan (30 Hari Terakhir)', 14, 15)
      
      // Regular Orders
      doc.setFontSize(12)
      doc.text('Pesanan Reguler', 14, 25)
      
      const orderColumns = ["ID", "Tanggal", "Pelanggan", "Item", "Total", "Status"]
      const orderRows = orders.map((o: any) => [
        o.id.slice(0,8),
        new Date(o.createdAt).toLocaleDateString('id-ID'),
        o.user?.name || 'Guest',
        o.items?.length || 0,
        `Rp ${o.totalAmount.toLocaleString('id-ID')}`,
        o.status
      ])
      
      autoTable(doc, {
        head: [orderColumns],
        body: orderRows,
        startY: 30,
      })
      
      // Custom Orders
      // @ts-ignore
      const finalY = doc.lastAutoTable.finalY || 30
      
      doc.text('Pesanan Kustom', 14, finalY + 10)
      
      const customColumns = ["ID", "Tanggal", "Produk", "Pelanggan", "Estimasi Harga", "Status"]
      const customRows = customOrders.map((o: any) => [
        o.displayId,
        new Date(o.createdAt).toLocaleDateString('id-ID'),
        o.productName,
        o.user?.name || '-',
        `Rp ${(o.estimatedPrice || 0).toLocaleString('id-ID')}`,
        o.status
      ])
      
      autoTable(doc, {
        head: [customColumns],
        body: customRows,
        startY: finalY + 15,
      })
      
      doc.save(`Laporan-Penjualan-${new Date().toISOString().split('T')[0]}.pdf`)
      
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 bg-[#070864] hover:bg-[#0a0c8f] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors disabled:opacity-50"
    >
      <Download className="w-4 h-4" />
      {loading ? 'Mengunduh...' : 'Unduh Laporan'}
    </button>
  )
}
