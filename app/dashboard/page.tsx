'use client'
import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import DownloadReportButton from './DownloadReportButton'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    popularProduct: '',
    criticalStockCount: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [criticalStocks, setCriticalStocks] = useState<any[]>([])
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch('/api/products')
        const products = await productsRes.json()
        const productsList = Array.isArray(products) ? products : []

        const ordersRes = await fetch('/api/orders')
        const orders = await ordersRes.json()
        const ordersList = Array.isArray(orders) ? orders : []

        const totalRevenue = ordersList.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0)
        const totalOrders = ordersList.length
        
        let popularProduct = 'N/A'
        if (ordersList.length > 0 && productsList.length > 0) {
          const orderCounts: Record<string, number> = {}
          ordersList.forEach((order: any) => {
            if (order.items) {
              order.items.forEach((item: any) => {
                orderCounts[item.productId] = (orderCounts[item.productId] || 0) + item.quantity
              })
            }
          })
          const mostPopularId = Object.keys(orderCounts).reduce((a, b) =>
            orderCounts[a] > orderCounts[b] ? a : b, '')
          const foundProduct = productsList.find((p: any) => p.id === mostPopularId)
          if (foundProduct) popularProduct = foundProduct.name
        }

        const critical = productsList.filter((p: any) => p.stock < 5)
        
        setStats({
          totalRevenue,
          totalOrders,
          popularProduct,
          criticalStockCount: critical.length,
        })

        setRecentOrders(ordersList.slice(0, 3))

        setCriticalStocks(critical.slice(0, 5))

        const dailyRevenue = [10, 15, 8, 20, 18, 25, 30]
        setChartData({
          labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
          datasets: [
            {
              data: dailyRevenue,
              borderColor: '#1E3A8A',
              fill: false,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: '#1E3A8A',
            },
          ],
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchData()
  }, [])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `Rp ${(value / 1000).toFixed(1)}K`
    }
    return `Rp ${value}`
  }

  const getOrderStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PAID: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-amber-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      PROCESSING: 'bg-orange-100 text-orange-800',
      CANCELED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-[#070864] tracking-widest uppercase mb-2">Overview Dashboard</p>
          <h1 className="text-4xl font-black text-[#070864] font-serif">Ringkasan Operasional</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2.5 rounded-full text-sm font-bold transition-colors">
            <Calendar className="w-4 h-4" />
            30 Hari Terakhir
          </button>
          <DownloadReportButton />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Penjualan</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-3 font-medium">+12% dari bulan lalu</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Jumlah Pesanan</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalOrders} Unit</p>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-3 font-medium">+5% dari bulan lalu</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Produk Terpopuler</p>
              <p className="text-lg font-bold text-gray-900 mt-2 truncate">{stats.popularProduct}</p>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-3 font-medium">Paling banyak diorder</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Stok Kritis</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{stats.criticalStockCount} Produk</p>
            </div>
          </div>
          <p className="text-xs text-red-600 mt-3 font-medium">Segera lakukan restock</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-4">Tren Penjualan</h3>
          <p className="text-xs text-gray-500 mb-4">Januari - Juni 2026</p>
          {chartData ? (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">Loading chart...</div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-4">Pesanan Terbaru</h3>
          <div className="text-right mb-3">
            <a href="/dashboard/orders" className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
              Lihat Semua →
            </a>
          </div>

          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order: any, idx: number) => (
                <div key={idx} className="flex justify-between items-start text-xs pb-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-gray-900 font-semibold truncate">Order #{order.id?.slice(0, 8)}</p>
                    <p className="text-gray-500 text-xs mt-1">{order.items?.length || 0} item(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-semibold">{formatCurrency(order.totalAmount)}</p>
                    <span className={`text-xs px-2 py-1 rounded-md mt-1 inline-block ${getOrderStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Belum ada pesanan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-base font-bold text-gray-900 mb-2">Manajemen Stok Kritis</h3>
        <p className="text-xs text-gray-500 mb-4">TOTAL {stats.criticalStockCount} SKU TERIDENTIFIKASI</p>

        {criticalStocks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 text-gray-600 font-medium">Kode SKU</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-medium">Nama Produk</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-medium">Kategori</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-medium">Stok Sisa</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {criticalStocks.map((product: any, idx: number) => {
                  const stockPercentage = (product.stock / 10) * 100
                  const progressColor = stockPercentage < 30 ? 'bg-red-500' : 'bg-orange-500'

                  return (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 text-gray-900 font-medium">OMH-{String(idx + 1).padStart(3, '0')}</td>
                      <td className="py-3 px-3 text-gray-900">{product.name}</td>
                      <td className="py-3 px-3">
                        <span className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded">{product.category || 'Umum'}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-16 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full ${progressColor}`} style={{ width: `${Math.min(stockPercentage, 100)}%` }}></div>
                          </div>
                          <span className="text-gray-900 font-medium">{product.stock} Unit</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <button className="text-blue-600 font-semibold hover:text-blue-800">Pesan Stok</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada produk dengan stok kritis</p>
          </div>
        )}
      </div>
    </div>
  )
}
