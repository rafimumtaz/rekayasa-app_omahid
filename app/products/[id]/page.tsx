import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Heart, ShoppingCart, Tag } from 'lucide-react'
import Link from 'next/link'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true }
  })

  if (!product) {
    notFound()
  }

  const mainImage = product.images[0]?.url || ''

  return (
    <div className="min-h-screen font-sans text-slate-900" style={{ background: '#EEF2FA' }}>
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 font-semibold mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#070864]">Home</Link>
          <span>/</span>
          <Link href="/search" className="hover:text-[#070864]">Produk</Link>
          <span>/</span>
          <span className="text-[#070864]">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

          {/* LEFT: Main Image Card */}
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm" style={{ minHeight: 460 }}>
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
                style={{ minHeight: 460, maxHeight: 580 }}
              />
            ) : (
              <div className="w-full flex items-center justify-center text-slate-300 text-sm font-bold" style={{ minHeight: 460 }}>
                Belum Ada Gambar
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col gap-5">
            {/* Product Name */}
            <h1 className="text-4xl font-black text-[#070864] leading-tight">
              {product.name}
            </h1>

            {/* Price Badge */}
            <div>
              <div className="inline-block bg-green-600 text-white text-2xl font-black px-6 py-3 rounded-xl">
                Rp {product.price.toLocaleString('id-ID')}
              </div>
            </div>

            {/* Category / Color Label */}
            {product.category && (
              <div>
                <p className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest">Kategori</p>
                <span className="bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                  {product.category}
                </span>
              </div>
            )}

            {/* Stock Badge */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Stok:</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-700' :
                product.stock > 0 ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                {product.stock > 0 ? `${product.stock} tersedia` : 'Habis'}
              </span>
            </div>

            {/* Coupon Input */}
            <div>
              <p className="text-sm font-bold text-slate-600 mb-2">Coupon</p>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="text"
                  placeholder="Do you have a coupon?"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white focus:border-[#0088FF] focus:ring-0 outline-none text-sm text-slate-700 placeholder:text-slate-300 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                className="flex-1 h-14 bg-green-600 hover:bg-green-700 text-white font-black text-sm rounded-xl tracking-widest transition-all shadow-lg shadow-green-400/30"
              >
                BELI SEKARANG
              </button>
              <button
                className="w-14 h-14 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center text-[#070864] hover:border-[#0088FF] hover:text-[#0088FF] transition-all shadow-sm"
                title="Tambah ke Keranjang"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button
                className="w-14 h-14 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:border-red-300 hover:text-red-500 transition-all shadow-sm"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM: Thumbnails + Quote */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

          {/* Thumbnails row */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.length > 0 ? (
              product.images.map((img, idx) => (
                <div
                  key={img.id}
                  className={`shrink-0 w-[185px] h-[150px] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${idx === 0 ? 'border-[#070864] shadow-md' : 'border-transparent hover:border-[#070864]/40'
                    }`}
                >
                  <img src={img.url} alt={`Gambar ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              <div className="flex-1 h-[150px] rounded-2xl bg-white flex items-center justify-center text-slate-300 text-sm font-bold">
                Tidak ada gambar
              </div>
            )}
          </div>

          {/* Quote / Description Card */}
          <div className="rounded-2xl overflow-hidden bg-[#9AA6B2] flex items-stretch min-h-[150px] shadow-sm">
            <div className="flex-1 p-6 flex items-center">
              <p className="text-white font-bold text-base leading-relaxed">
                "{product.description
                  ? product.description.length > 120
                    ? product.description.substring(0, 120) + '...'
                    : product.description
                  : 'Produk pilihan terbaik untuk kenyamanan dan keindahan ruang Anda.'}"
              </p>
            </div>
            {mainImage && (
              <div className="w-40 shrink-0 hidden sm:block">
                <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
