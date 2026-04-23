'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, ShoppingBag, Heart, Lock, LogOut, ChevronRight, Save, Loader2, Home } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')
  
  // Form states
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Mock data for Cart and Wishlist (since APIs are not yet fully implemented)
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (!data.user) {
          router.push('/login')
          return
        }
        setUser(data.user)
        setName(data.user.name || '')
      } catch (e) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setMessage({ type: '', text: '' })

    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update')

      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' })
      setPassword('')
      setUser({ ...user, name })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setUpdating(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#070864]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black text-[#070864] flex items-center gap-2">
            <Home className="w-6 h-6" /> OMAH.ID
          </Link>
          <div className="flex items-center gap-4">
             {user?.role === 'ADMIN' && (
               <Link href="/dashboard" className="text-sm font-bold text-[#070864] hover:underline">
                 Admin Panel
               </Link>
             )}
             <button onClick={handleLogout} className="text-sm font-bold text-red-500 flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
               <LogOut className="w-4 h-4" /> Keluar
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <aside className="md:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveTab('details')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'details' ? 'bg-[#070864] text-white shadow-lg shadow-blue-900/20' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" /> Detail Akun
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTab('cart')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'cart' ? 'bg-[#070864] text-white shadow-lg shadow-blue-900/20' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" /> Keranjang
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'wishlist' ? 'bg-[#070864] text-white shadow-lg shadow-blue-900/20' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5" /> Wishlist
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </aside>

          {/* Content Area */}
          <section className="md:col-span-3 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            {activeTab === 'details' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#070864] mb-2">Profil Saya</h2>
                  <p className="text-sm text-slate-500">Kelola informasi profil dan keamanan akun Anda</p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">Email</label>
                      <input 
                        type="email" 
                        disabled 
                        value={user?.email || ''} 
                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 text-sm cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">Nama Lengkap</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-[#070864] focus:ring-1 focus:ring-[#070864] outline-none transition-all text-sm font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">Ganti Password (Opsional)</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-[#070864] focus:ring-1 focus:ring-[#070864] outline-none transition-all text-sm tracking-widest"
                        />
                      </div>
                    </div>
                  </div>

                  {message.text && (
                    <div className={`p-4 rounded-2xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {message.text}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={updating}
                    className="flex items-center gap-2 bg-[#070864] hover:bg-[#0a0c8a] text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-[#070864]/20 disabled:opacity-70"
                  >
                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Simpan Perubahan
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'cart' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#070864]">Keranjang Belanja</h2>
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">Keranjang Anda masih kosong</p>
                  <Link href="/" className="text-[#070864] font-bold hover:underline">Mulai Belanja Sekarang</Link>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#070864]">Wishlist</h2>
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                    <Heart className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">Belum ada produk favorit Anda</p>
                  <Link href="/" className="text-[#070864] font-bold hover:underline">Jelajahi Produk</Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
