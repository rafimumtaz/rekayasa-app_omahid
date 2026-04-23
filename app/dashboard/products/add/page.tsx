import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { ArrowLeft, Save, UploadCloud, X } from 'lucide-react'
import SubmitButton from '@/components/SubmitButton'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                    process.env.SUPABASE_BUCKET_SECRET_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function AdminAddProduct() {
  async function createProduct(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string) || 0
    const description = formData.get('description') as string
    
    // Multiple images
    const imageFiles = formData.getAll('imageFiles') as File[]
    const imageUrlsInput = formData.get('imageUrls') as string // Comma separated URLs
    
    const finalImageUrls: string[] = []

    // Process file uploads
    for (const file of imageFiles) {
      if (file.size > 0) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        console.log(`Uploading file: ${fileName}, size: ${file.size}`)
        const { data, error } = await supabase
          .storage
          .from('products')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (!error) {
          const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(fileName)
          console.log(`Upload success! URL: ${publicUrlData.publicUrl}`)
          finalImageUrls.push(publicUrlData.publicUrl)
        } else {
          console.error('Supabase upload error detail:', error)
        }
      }
    }

    // Process manual URLs
    if (imageUrlsInput) {
      const urls = imageUrlsInput.split(',').map(url => url.trim()).filter(url => url !== '')
      finalImageUrls.push(...urls)
    }

    if (name && !isNaN(price)) {
      await prisma.product.create({
        data: { 
          name, 
          category, 
          price, 
          stock, 
          description,
          images: {
            create: finalImageUrls.map(url => ({ url }))
          }
        }
      })
      revalidatePath('/dashboard/products')
      revalidatePath('/search')
      revalidatePath('/')
    }
    redirect('/dashboard/products')
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
        <Link href="/dashboard/products" className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Tambah Produk Baru</h3>
          <p className="text-slate-500 text-sm mt-1">Masukkan detail produk untuk ditambahkan ke katalog Anda.</p>
        </div>
      </div>

      <form action={createProduct} className="space-y-8" encType="multipart/form-data">
        {/* Info Dasar */}
        <div>
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
             Info Dasar
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Produk <span className="text-red-500">*</span></label>
              <input type="text" name="name" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#070864] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium text-slate-900" placeholder="Contoh: Kasur Serenity Premium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
              <input type="text" name="category" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#070864] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium text-slate-900 uppercase" placeholder="KASUR" />
            </div>
          </div>
        </div>

        {/* Harga & Stok */}
        <div>
          <h4 className="font-bold text-slate-800 mb-4">Harga & Stok</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Harga (Rp) <span className="text-red-500">*</span></label>
              <input type="number" name="price" required min="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#070864] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-bold text-[#070864]" placeholder="1500000" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stok Awal</label>
              <input type="number" name="stock" defaultValue="0" min="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#070864] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-bold text-[#070864]" />
            </div>
          </div>
        </div>

        {/* Media & Deskripsi */}
        <div>
          <h4 className="font-bold text-slate-800 mb-4">Media & Deskripsi</h4>
          <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <UploadCloud className="w-4 h-4" /> Upload Gambar (Bisa pilih banyak)
              </label>
              <input 
                type="file" 
                name="imageFiles" 
                accept="image/*" 
                multiple
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#070864] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#070864] hover:file:bg-blue-100 text-slate-900" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                 Atau Gunakan URL Gambar (Pisahkan dengan koma jika lebih dari satu)
              </label>
              <input type="text" name="imageUrls" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#070864] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm text-slate-900" placeholder="https://url1.com, https://url2.com" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi Lengkap</label>
              <textarea name="description" rows={5} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#070864] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm resize-none text-slate-900" placeholder="Tuliskan spesifikasi, ukuran, dan deskripsi bahan..." />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100">
          <Link href="/dashboard/products" className="px-6 py-3 text-slate-500 font-semibold text-sm hover:text-slate-800 transition-colors mr-4">Batal</Link>
          <SubmitButton 
            className="bg-[#070864] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-900 shadow-xl shadow-blue-900/20 transition-all"
            icon={<Save className="w-5 h-5" />}
          >
            Simpan Produk
          </SubmitButton>
        </div>
      </form>
    </div>
  )
}
