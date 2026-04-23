import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Save, AlertCircle } from 'lucide-react'
import SubmitButton from '@/components/SubmitButton'

export const dynamic = 'force-dynamic'

export default async function AdminStockManagement() {
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' }
  })

  async function updateStock(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const stock = parseInt(formData.get('stock') as string)
    
    if (id && !isNaN(stock)) {
      await prisma.product.update({
        where: { id },
        data: { stock }
      })
      revalidatePath('/dashboard/stock')
      revalidatePath('/dashboard/products')
    }
  }

  // Hitung ringkasan
  const totalProducts = products.length
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length
  const outOfStock = products.filter(p => p.stock === 0).length

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-800">Manajemen Stok</h3>
        <p className="text-slate-500 text-sm mt-1">Pantau dan perbarui ketersediaan inventaris gudang Anda secara real-time.</p>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">Total Item</p>
            <p className="text-3xl font-black text-[#070864]">{totalProducts}</p>
          </div>
        </div>
        <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 flex items-center justify-between">
          <div>
            <p className="text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">Stok Menipis (≤5)</p>
            <p className="text-3xl font-black text-orange-700">{lowStock}</p>
          </div>
        </div>
        <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 flex items-center justify-between">
          <div>
            <p className="text-red-600 text-xs font-bold uppercase tracking-wider mb-1">Habis</p>
            <p className="text-3xl font-black text-red-700">{outOfStock}</p>
          </div>
          {outOfStock > 0 && <AlertCircle className="text-red-500 w-8 h-8 opacity-50" />}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 w-1/2">Nama Produk</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Penyesuaian Stok</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-slate-400">Belum ada produk untuk dikelola.</td>
              </tr>
            )}
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800 text-base">{p.name}</p>
                  <p className="text-xs text-slate-400 mt-1">ID: {p.id}</p>
                </td>
                <td className="px-6 py-4 font-medium text-slate-600 uppercase text-xs">
                  {p.category || '-'}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                    {p.stock > 10 ? 'Aman' : p.stock > 0 ? 'Menipis' : 'Habis'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={updateStock} className="flex items-center justify-end gap-3">
                    <input type="hidden" name="id" value={p.id} />
                    <input 
                      type="number" 
                      name="stock" 
                      defaultValue={p.stock} 
                      min="0"
                      className="w-24 px-4 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#070864] focus:ring-2 focus:ring-blue-100 outline-none text-center font-bold text-slate-800 transition-all shadow-inner"
                    />
                    <SubmitButton 
                      className="p-2.5 bg-[#070864] text-white hover:bg-blue-900 rounded-xl transition-all shadow-md shadow-blue-900/20" 
                      icon={<Save className="w-4 h-4" />}
                    >
                      {/* Empty children because icon is enough */}
                    </SubmitButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
