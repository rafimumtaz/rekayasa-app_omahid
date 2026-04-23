'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Heart, ShoppingBag, User, Loader2 } from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        setUser(data.user)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  return (
    <header className="w-full bg-white">
      {/* Top bar with Search & Icons */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        <Link href="/" className="text-3xl font-black text-[#070864] tracking-tight">
          OMAH.ID
        </Link>

        <form action="/search" className="flex-1 max-w-2xl w-full relative">
          <input
            type="text"
            name="q"
            placeholder="Search for anything..."
            className="w-full bg-[#D9EAFD]/30 border-none rounded-sm py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0088FF]"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
            <Search className="w-5 h-5 text-slate-500 hover:text-[#0088FF] transition-colors" />
          </button>
        </form>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer hidden sm:flex">
            <MapPin className="w-5 h-5 text-slate-700" />
            <span className="text-sm font-semibold text-slate-800">Track Order</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href={user ? "/profile" : "/login"} className="relative cursor-pointer">
              <Heart className="w-6 h-6 text-slate-800" />
              <span className="absolute -top-2 -right-2 bg-[#070864] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
            </Link>
            <Link href={user ? "/profile" : "/login"} className="relative cursor-pointer">
              <ShoppingBag className="w-6 h-6 text-slate-800" />
              <span className="absolute -top-2 -right-2 bg-[#070864] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
            </Link>
            
            {loading ? (
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
            ) : (
              <Link href={user ? "/profile" : "/login"} className="flex items-center gap-2 group">
                <div className={`p-1.5 rounded-full transition-all ${user ? 'bg-blue-50 group-hover:bg-blue-100' : 'bg-slate-50 group-hover:bg-slate-100'}`}>
                  <User className={`w-6 h-6 ${user ? 'text-[#070864]' : 'text-slate-800'}`} />
                </div>
                {user && (
                  <span className="text-sm font-bold text-[#070864] hidden md:block">
                    {user.name?.split(' ')[0]}
                  </span>
                )}
              </Link>
            )}
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
  )
}
