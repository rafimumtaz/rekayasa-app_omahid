'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const msg = searchParams.get('message')
    if (msg) setSuccess(msg)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials')
      }

      if (data.user?.role === 'ADMIN') {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
      
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-slate-50/50"
    >
      <div className="text-center mb-8 space-y-2">
        <h2 className="text-2xl font-bold text-[#070864] font-serif">Masuk ke OMAH.ID</h2>
        <p className="text-sm text-slate-500">Silakan Login Untuk Melanjutkan</p>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-green-50 text-green-600 text-sm flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-5 h-5" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              placeholder="user@omah.id"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full border border-slate-200 bg-white focus:border-[#070864] focus:ring-1 focus:ring-[#070864] outline-none transition-all placeholder:text-slate-400 text-sm font-medium text-slate-700"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kata Sandi</label>
            <Link href="/reset-password" title='Lupa Password' className="text-[11px] font-bold text-[#070864] hover:text-blue-600 transition-colors">
              Lupa Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full border border-slate-200 bg-white focus:border-[#070864] focus:ring-1 focus:ring-[#070864] outline-none transition-all placeholder:text-slate-400 text-sm font-medium text-slate-700 tracking-widest"
            />
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center gap-3 px-1 pt-1">
          <input 
            type="checkbox" 
            id="remember" 
            className="w-4 h-4 rounded-full border-slate-300 text-[#070864] focus:ring-[#070864]"
          />
          <label htmlFor="remember" className="text-xs font-medium text-slate-500 cursor-pointer">
            Tetap masuk selama 30 hari
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center font-medium">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-4 bg-[#070864] hover:bg-[#0a0c8a] text-white rounded-full font-bold shadow-lg shadow-[#070864]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm tracking-wide"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Masuk"}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <Link href="/register" className="text-xs font-semibold text-slate-500 hover:text-[#070864] transition-colors">
          Belum punya akun? <span className="text-[#070864]">Daftar</span>
        </Link>
      </div>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-[#F7F9FD] overflow-hidden font-sans">
      {/* Soft Blurred Background Gradients */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-200/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#070864] tracking-tight mb-2">OMAH.ID</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Akses Akun Anda</p>
        </div>

        {/* Login Card */}
        <Suspense fallback={
          <div className="w-full bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-slate-50/50 flex justify-center py-20">
             <Loader2 className="w-8 h-8 animate-spin text-[#070864]" />
          </div>
        }>
          <LoginForm />
        </Suspense>

        {/* Decorative Dots below card */}
        <div className="flex gap-4 mt-8">
          <div className="w-3 h-3 rounded-full bg-slate-200"></div>
          <div className="w-3 h-3 rounded-full bg-slate-200"></div>
          <div className="w-3 h-3 rounded-full bg-slate-200"></div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
          © 2026 OMAH.ID
        </p>
      </div>
    </div>
  )
}

