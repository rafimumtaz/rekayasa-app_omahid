import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { ArrowLeft, Save, UploadCloud, Trash2 } from 'lucide-react'
import SubmitButton from '@/components/SubmitButton'
import DeleteImageButton from '@/components/DeleteImageButton'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                    process.env.SUPABASE_SERVICE_ROLE_KEY || 
                    process.env.SUPABASE_BUCKET_SECRET_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
console.log('Supabase Key used (prefix):', supabaseKey.substring(0, 10) + '...')
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function AdminEditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true }
  })

  if (!product) {
    notFound()
  }

  async function updateProduct(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string) || 0
    const description = formData.get('description') as string
    
    // Multiple images
    const imageFiles = formData.getAll('imageFiles') as File[]
    const imageUrlsInput = formData.get('imageUrls') as string
    
    const newImageUrls: string[] = []
    
    console.log('Form data keys:', Array.from(formData.keys()))
    console.log('Files received:', imageFiles.length)

    // Process file uploads
    for (const file of imageFiles) {
      if (file.size > 0) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        console.log(`Uploading new file: ${fileName}, size: ${file.size}`)
        const { data, error } = await supabase
          .storage
          .from('products')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (!error) {
          const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(fileName)
          console.log(`Upload success! New URL: ${publicUrlData.publicUrl}`)
          newImageUrls.push(publicUrlData.publicUrl)
        } else {
          console.error('Supabase upload error detail (Edit):', error)
        }
      }
    }

    if (imageUrlsInput) {
      const urls = imageUrlsInput.split(',').map(url => url.trim()).filter(url => url !== '')
      newImageUrls.push(...urls)
    }

    console.log('Final new image URLs to save:', newImageUrls)

    // Update product
    await prisma.product.update({
      where: { id },
      data: {
        name,
        category,
        price,
        stock,
        description,
        images: {
          create: newImageUrls.map(url => ({ url }))
        }
      }
    })
    revalidatePath('/dashboard/products')
    revalidatePath(`/dashboard/products/${id}/edit`)
    revalidatePath('/search')
    revalidatePath('/')

    redirect('/dashboard/products')
  }

  async function deleteImage(imageId: string) {
    'use server'
    await prisma.productImage.delete({
      where: { id: imageId }
    })
    revalidatePath(`/dashboard/products/${id}/edit`)
    revalidatePath('/dashboard/products')
    // No easy way to revalidate in a server action without refresh or redirecting
    // but we can redirect back to the same page
    redirect(`/dashboard/products/${id}/edit`)
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-4xl mx-auto text-slate-900">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
        <Link href="/dashboard/products" className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Edit Produk</h3>
          <p className="text-slate-500 text-sm mt-1">Perbarui informasi produk {product.name}.</p>
        </div>
      </div>

      <form action={updateProduct} className="space-y-8">
        {/* Info Dasar */}
        <div>
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
             Info Dasar
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Produk <span className="text-red-500">*</span></label>
              <input type="text" name="name" defaultValue={product.name} required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#070864] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium text-slate-900" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
              <input type="text" name="category" defaultValue={product.category || ''} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#070864] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium text-slate-900 uppercase" />
            </div>
          </div>
        </div>

        {/* Harga & Stok */}
        <div>
          <h4 className="font-bold text-slate-800 mb-4">Harga & Stok</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Harga (Rp) <span className="text-red-500">*</span></label>
              <input type="number" name="price" defaultValue={product.price} required min="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#070864] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-bold text-[#070864]" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stok</label>
              <input type="number" name="stock" defaultValue={product.stock} min="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#070864] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-bold text-[#070864]" />
            </div>
          </div>
        </div>

        {/* Media & Deskripsi */}
        <div>
          <h4 className="font-bold text-slate-800 mb-4">Media & Deskripsi</h4>
          <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            {/* Existing Images */}
            {product.images.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gambar Saat Ini</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {product.images.map((img) => (
                    <div key={img.id} className="relative group aspect-square bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                      <DeleteImageButton 
                        imageId={img.id} 
                        onDelete={deleteImage} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <UploadCloud className="w-4 h-4" /> Tambah Gambar Baru
              </label>
              <input type="file" name="imageFiles" accept="image/*" multiple className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#070864] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#070864] hover:file:bg-blue-100 text-slate-900" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                 Atau Tambah URL Gambar (Pisahkan dengan koma)
              </label>
              <input type="text" name="imageUrls" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#070864] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm text-slate-900" placeholder="https://url1.com, https://url2.com" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi Lengkap</label>
              <textarea name="description" defaultValue={product.description} rows={5} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#070864] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm resize-none text-slate-900" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100">
          <Link href="/dashboard/products" className="px-6 py-3 text-slate-500 font-semibold text-sm hover:text-slate-800 transition-colors mr-4">Batal</Link>
          <SubmitButton 
            className="bg-[#070864] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-900 shadow-xl shadow-blue-900/20 transition-all"
            icon={<Save className="w-5 h-5" />}
          >
            Perbarui Produk
          </SubmitButton>
        </div>
      </form>
    </div>
  )
}
