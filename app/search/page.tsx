import Link from 'next/link'
import { Search, MapPin, Heart, ShoppingBag, User, CreditCard } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q || ''

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ]
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header / Navbar */}
      <header className="w-full">
        {/* Top bar with Search & Icons */}
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          <Link href="/" className="text-3xl font-black text-[#070864] tracking-tight">
            OMAH.ID
          </Link>

          <form action="/search" className="flex-1 max-w-2xl w-full relative">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search for anything..."
              className="w-full bg-[#D9EAFD]/30 border-none rounded-sm py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0088FF]"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-slate-500 hover:text-[#0088FF] transition-colors" />
            </button>
          </form>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer">
              <MapPin className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-semibold text-slate-800">Track Order</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative cursor-pointer">
                <Heart className="w-6 h-6 text-slate-800" />
                <span className="absolute -top-2 -right-2 bg-[#070864] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">1</span>
              </div>
              <div className="relative cursor-pointer">
                <ShoppingBag className="w-6 h-6 text-slate-800" />
                <span className="absolute -top-2 -right-2 bg-[#070864] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
              </div>
              <Link href="/login" className="cursor-pointer">
                <User className="w-6 h-6 text-slate-800" />
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="max-w-7xl mx-auto px-6 pb-6 flex gap-8">
          <Link href="#" className="text-sm font-bold text-[#070864] tracking-wide hover:text-[#0088FF] transition-colors uppercase">Katalog Produk</Link>
          <Link href="#" className="text-sm font-bold text-[#070864] tracking-wide hover:text-[#0088FF] transition-colors uppercase">About Us</Link>
          <Link href="#" className="text-sm font-bold text-[#070864] tracking-wide hover:text-[#0088FF] transition-colors uppercase">Services</Link>
          <Link href="#" className="text-sm font-bold text-[#070864] tracking-wide hover:text-[#0088FF] transition-colors uppercase">Payment</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 mb-20 min-h-[50vh]">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Search Results</h1>
          {query && <p className="text-slate-500">Showing results for <span className="font-semibold text-slate-900">"{query}"</span></p>}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-xl">No products found</p>
            <Link href="/" className="mt-4 inline-block text-[#0088FF] hover:underline">Return to Home</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-square bg-slate-100 flex items-center justify-center text-slate-400 relative overflow-hidden rounded-md mb-4">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <span className="text-sm">No Image</span>
                  )}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-[#0088FF] transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{product.category}</p>
                  </div>
                  <p className="font-bold text-[#070864]">Rp {product.price.toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#D9EAFD] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="w-5 h-5 text-slate-900" />
                <span className="text-xl font-black text-slate-900 tracking-tight">OMAH.ID</span>
              </div>
              <p className="text-slate-600 text-sm">Jl.Telang Indah gg.II</p>
              <p className="text-slate-600 text-sm"><span className="font-semibold text-slate-900">Email:</span> Omah.id@gmail.co.id</p>
              <p className="text-slate-600 text-sm"><span className="font-semibold text-slate-900">Phone:</span> (928) 630-9272</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">BELANJA</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-600 text-sm hover:text-slate-900">Kursi</Link></li>
                <li><Link href="#" className="text-slate-600 text-sm hover:text-slate-900">Tempat Tidur</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-blue-200">
            <p className="text-slate-500 text-xs">© Copyright f Store 2024. Design by Figma.guru</p>
            <div className="flex items-center gap-3 text-slate-500">
              <CreditCard className="w-8 h-8" />
              <span className="font-bold text-xs border border-slate-400 px-1 rounded">VISA</span>
              <span className="font-bold text-xs border border-slate-400 px-1 rounded">MasterCard</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
