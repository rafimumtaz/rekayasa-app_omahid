import { Search, MapPin, Heart, ShoppingBag, User, ArrowRight, CreditCard } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header / Navbar */}
      <Navbar />

      <main>
        {/* Hero Banner */}
        <section className="w-full">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row min-h-[400px]">
            {/* Image Placeholder area (Left) */}
            <div className="md:w-[55%] relative bg-slate-200 min-h-[400px] bg-cover bg-center overflow-hidden flex items-center justify-center">
              <div className="text-slate-400 font-medium">[ Kasur Image from SVG ]</div>
            </div>

            {/* Text area (Right) */}
            <div className="md:w-[45%] bg-[#9AA6B2] p-12 md:p-16 flex flex-col justify-center">
              <h3 className="text-[#0088FF] font-bold text-lg tracking-widest mb-6 uppercase">
                Kasur Serenity
              </h3>
              <h2 className="text-white text-3xl md:text-4xl font-serif leading-snug mb-10">
                “Nikmati kenyamanan maksimal dengan tempat tidur yang dirancang untuk gaya hidup modern.”
              </h2>
              <div>
                <button className="bg-[#0088FF] text-white px-8 py-3 font-bold text-sm hover:bg-blue-600 transition-colors">
                  LIAT DETAIL
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Shop by Categories */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-bold text-slate-900">Shop by Categories</h2>
            <button className="px-6 py-2 border border-slate-300 font-semibold text-sm hover:bg-slate-50 transition-colors">
              View all
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <CategoryCard title="Kasur" subtitle="42 products" icon="KASUR" />
            <CategoryCard title="meja makan set" subtitle="16 products" icon="MEJA MAKAN SET" />
            <CategoryCard title="rak serbaguna" subtitle="42 products" icon="RAK SERBAGUNA" />
            <CategoryCard title="meja rias" subtitle="42 products" icon="MEJA RIAS" />
          </div>
        </section>

        {/* New Products */}
        <section className="max-w-7xl mx-auto px-6 py-10 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-8">New Products</h2>
            <div className="flex flex-wrap justify-center gap-8 text-lg font-medium text-slate-800">
              <span className="border-b-2 border-slate-900 pb-1 cursor-pointer">All</span>
              <span className="text-slate-500 cursor-pointer hover:text-slate-900">Chairs</span>
              <span className="text-slate-500 cursor-pointer hover:text-slate-900">Tables</span>
              <span className="text-slate-500 cursor-pointer hover:text-slate-900">Armchairs</span>
              <span className="text-slate-500 cursor-pointer hover:text-slate-900">Sofas</span>
              <span className="text-slate-500 cursor-pointer hover:text-slate-900">Decor</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Product Placeholders matching the grid layout */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square bg-slate-100 flex items-center justify-center text-slate-400 group relative overflow-hidden">
                Product Image
                <div className="absolute bottom-0 w-full p-4 bg-white/90 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="font-semibold text-slate-900">Product Name</p>
                  <p className="text-sm font-bold text-[#0088FF]">Rp 1.000.000</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#D9EAFD] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Newsletter Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8 border-b border-blue-200 pb-16">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Berlangganan Newsletter Kami</h2>
              <h2 className="text-2xl font-bold text-slate-900">Jangan lewatkan berita dan promo terbaru</h2>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full md:w-72 px-4 py-3 bg-white border-none focus:outline-none focus:ring-2 focus:ring-[#0088FF]"
              />
              <button className="bg-[#0088FF] text-white px-8 py-3 font-semibold hover:bg-blue-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Col 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="w-5 h-5 text-slate-900" />
                <span className="text-xl font-black text-slate-900 tracking-tight">OMAH.ID</span>
              </div>
              <p className="text-slate-600 text-sm">Jl.Telang Indah gg.II</p>
              <p className="text-slate-600 text-sm"><span className="font-semibold text-slate-900">Email:</span> Omah.id@gmail.co.id</p>
              <p className="text-slate-600 text-sm"><span className="font-semibold text-slate-900">Phone:</span> (928) 630-9272</p>

              {/* <div className="flex gap-4 pt-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white cursor-pointer"><Facebook className="w-4 h-4" /></div>
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white cursor-pointer"><Twitter className="w-4 h-4" /></div>
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white cursor-pointer"><Instagram className="w-4 h-4" /></div>
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white cursor-pointer"><Youtube className="w-4 h-4" /></div>
              </div> */}
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="font-bold text-slate-900 mb-6">BELANJA</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-600 text-sm hover:text-slate-900">Kursi</Link></li>
                <li><Link href="#" className="text-slate-600 text-sm hover:text-slate-900">Tempat Tidur</Link></li>
                <li><Link href="#" className="text-slate-600 text-sm hover:text-slate-900">Sofa</Link></li>
                <li><Link href="#" className="text-slate-600 text-sm hover:text-slate-900">Lemari</Link></li>
                <li><Link href="#" className="text-slate-600 text-sm hover:text-slate-900">Kursi Santai</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Customer service</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-600 text-sm hover:text-slate-900">Pesanan</Link></li>
                <li><Link href="#" className="text-slate-600 text-sm hover:text-slate-900">Alamat</Link></li>
                <li><Link href="#" className="text-slate-600 text-sm hover:text-slate-900">Pengembalian</Link></li>
                <li><Link href="#" className="text-slate-600 text-sm hover:text-slate-900">Detail Akun</Link></li>
                <li><Link href="#" className="text-slate-600 text-sm hover:text-slate-900">FAQ</Link></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Delivery</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-600 text-sm hover:text-slate-900">Orders</Link></li>
                <li><Link href="#" className="text-slate-600 text-sm hover:text-slate-900">Return</Link></li>
                <li><Link href="#" className="text-slate-600 text-sm hover:text-slate-900">Free Delivery</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-blue-200">
            <p className="text-slate-500 text-xs">© Copyright f Store 2024. Design by Figma.guru</p>
            <div className="flex items-center gap-3 text-slate-500">
              <CreditCard className="w-8 h-8" />
              <span className="font-bold text-xs border border-slate-400 px-1 rounded">VISA</span>
              <span className="font-bold text-xs border border-slate-400 px-1 rounded">MasterCard</span>
              <span className="font-bold text-xs border border-slate-400 px-1 rounded italic">PayPal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function CategoryCard({ title, subtitle, icon }: { title: string, subtitle: string, icon: string }) {
  return (
    <div>
      <div className="aspect-square border border-slate-200 rounded-lg flex flex-col items-center justify-center p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white mb-4">
        {/* Placeholder for the icon */}
        <div className="w-20 h-20 mb-4 bg-slate-50 flex items-center justify-center rounded-lg">
          <span className="text-xs text-slate-400 font-bold text-center leading-tight">{icon}</span>
        </div>
      </div>
      <div className="px-2">
        <h3 className="font-bold text-slate-900 capitalize text-lg">{title}</h3>
        <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
      </div>
    </div>
  )
}
