import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminProductsList() {
  const products = await prisma.product.findMany({
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Daftar Produk</h3>
          <p className="text-slate-500 text-sm mt-1">Kelola semua produk yang ditampilkan di toko Anda.</p>
        </div>
        <Link href="/dashboard/products/add" className="flex items-center gap-2 bg-[#070864] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-900 shadow-lg shadow-blue-900/20 transition-all">
          <Plus className="w-5 h-5" /> Tambah Produk
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Info Produk</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Harga</th>
              <th className="px-6 py-4 text-center">Stok</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-400">Belum ada produk yang ditambahkan.</td>
              </tr>
            )}
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                    {p.images && p.images.length > 0 ? (
                      <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-medium">No Img</div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-base">{p.name}</p>
                    <p className="text-xs text-slate-400 max-w-[200px] truncate mt-1">{p.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-600">
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs uppercase tracking-wide">
                    {p.category || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-[#070864]">
                  Rp {p.price.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 font-bold text-center">
                  <span className={`px-3 py-1 rounded-full text-xs ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/products/${p.id}/edit`} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
