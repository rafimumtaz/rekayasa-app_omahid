import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { Save, UploadCloud, FileText, Package, Ruler, Image as ImageIcon } from 'lucide-react'
import SubmitButton from '@/components/SubmitButton'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                    process.env.SUPABASE_SERVICE_ROLE_KEY || 
                    process.env.SUPABASE_BUCKET_SECRET_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function AdminEditCustomOrder({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const customOrder = await prisma.customOrder.findUnique({
    where: { id },
    include: { images: true }
  })

  if (!customOrder) {
    notFound()
  }

  // Parse dimensions
  let pLength = '', pWidth = '', pHeight = ''
  if (customOrder.dimensions) {
    const parts = customOrder.dimensions.replace(' cm', '').split('x').map(s => s.trim())
    if (parts.length === 3) {
      [pLength, pWidth, pHeight] = parts
    }
  }

  async function updateCustomOrderAction(formData: FormData) {
    'use server'
    const productName = formData.get('productName') as string
    const description = formData.get('description') as string
    const materials = formData.get('materials') as string
    
    const len = formData.get('panjang') as string || ''
    const wid = formData.get('lebar') as string || ''
    const hei = formData.get('tinggi') as string || ''
    const dimensions = `${len} x ${wid} x ${hei} cm`
    
    const estimatedPrice = parseFloat(formData.get('estimatedPrice') as string) || 0
    const status = formData.get('status') as any || 'PENDING'
    
    // Process Images
    const imageFiles = formData.getAll('imageFiles') as File[]
    const finalImageUrls: string[] = []

    for (const file of imageFiles) {
      if (file.size > 0) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { error } = await supabase.storage.from('products').upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

        if (!error) {
          const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(fileName)
          finalImageUrls.push(publicUrlData.publicUrl)
        } else {
          console.error('Supabase upload error:', error)
        }
      }
    }

    if (productName) {
      // Prepare update data
      const updateData: any = {
        productName,
        description,
        materials,
        dimensions,
        estimatedPrice,
        status,
      }

      // If new images were uploaded, delete old images and create new ones
      // Or just add them. Let's just add them to the existing ones for now, 
      // or replace them if new ones are uploaded.
      if (finalImageUrls.length > 0) {
        await prisma.customOrderImage.deleteMany({
          where: { customOrderId: id }
        })
        updateData.images = {
          create: finalImageUrls.map(url => ({ url }))
        }
      }

      await prisma.customOrder.update({
        where: { id },
        data: updateData
      })
      
      revalidatePath('/dashboard/custom-orders')
    }
    redirect('/dashboard/custom-orders')
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-8">
      {/* Header & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">
          <Link href="/dashboard/custom-orders" className="hover:text-[#070864] transition-colors">Custom Order</Link>
          <span>›</span>
          <span className="text-[#070864]">Edit Pesanan</span>
        </div>
        <h2 className="text-3xl font-black text-[#070864] font-serif mb-2">Edit Pesanan: {customOrder.displayId}</h2>
        <p className="text-slate-500 font-medium text-sm">Perbarui detail, status, dan harga pesanan kustom pelanggan.</p>
      </div>

      <form action={updateCustomOrderAction}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Wider) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Informasi Utama */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm">
              <h3 className="text-lg font-bold text-[#070864] font-serif mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Informasi Utama
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Produk <span className="text-red-500">*</span></label>
                  <input type="text" name="productName" defaultValue={customOrder.productName} required className="w-full px-4 py-3 rounded-xl border-none bg-slate-50 focus:ring-2 focus:ring-[#070864]/20 outline-none transition-all text-sm font-medium text-slate-900" placeholder="Contoh: Kursi Jati Minimalis 'Akar'" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bahan Material</label>
                  <input type="text" name="materials" defaultValue={customOrder.materials} className="w-full px-4 py-3 rounded-xl border-none bg-slate-50 focus:ring-2 focus:ring-[#070864]/20 outline-none transition-all text-sm font-medium text-slate-900" placeholder="Contoh: Kayu Jati, Rotan" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deskripsi Produk</label>
                  <textarea name="description" defaultValue={customOrder.description} rows={5} className="w-full px-4 py-3 rounded-xl border-none bg-slate-50 focus:ring-2 focus:ring-[#070864]/20 outline-none transition-all text-sm font-medium text-slate-900 resize-none" placeholder="Tuliskan spesifikasi detail, filosofi desain, dan instruksi perawatan..." />
                </div>
              </div>
            </div>

            {/* Harga & Status */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm">
              <h3 className="text-lg font-bold text-[#070864] font-serif mb-6 flex items-center gap-2">
                <Package className="w-5 h-5" /> Harga & Status
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harga Estimasi (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rp</span>
                    <input type="number" name="estimatedPrice" defaultValue={customOrder.estimatedPrice || ''} min="0" className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-slate-50 focus:ring-2 focus:ring-[#070864]/20 outline-none transition-all text-sm font-bold text-[#070864]" placeholder="0" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Pesanan</label>
                  <div className="relative">
                    <select name="status" defaultValue={customOrder.status} className="w-full px-4 py-3 rounded-xl border-none bg-slate-50 focus:ring-2 focus:ring-[#070864]/20 outline-none transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer">
                      <option value="PENDING">Pending (Menunggu Pembayaran)</option>
                      <option value="REVIEW">Review (Peninjauan)</option>
                      <option value="PRODUKSI">Produksi (Dalam Proses)</option>
                      <option value="SELESAI">Selesai (Siap Kirim / Selesai)</option>
                      <option value="BATAL">Batal</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          {/* Right Column (Narrower) */}
          <div className="space-y-8 flex flex-col">
            
            {/* Dimensi */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm">
              <h3 className="text-lg font-bold text-[#070864] font-serif mb-6 flex items-center gap-2">
                <Ruler className="w-5 h-5" /> Dimensi (cm)
              </h3>
              
              <div className="flex items-center gap-2 justify-between mb-2">
                <div className="space-y-1 w-full">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center block">Panjang</label>
                  <input type="text" name="panjang" defaultValue={pLength} className="w-full text-center px-2 py-3 rounded-xl border-none bg-slate-50 focus:ring-2 focus:ring-[#070864]/20 outline-none transition-all text-sm font-medium text-slate-900" placeholder="( )" />
                </div>
                <span className="text-slate-300 font-bold mt-4 text-xs">×</span>
                <div className="space-y-1 w-full">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center block">Lebar</label>
                  <input type="text" name="lebar" defaultValue={pWidth} className="w-full text-center px-2 py-3 rounded-xl border-none bg-slate-50 focus:ring-2 focus:ring-[#070864]/20 outline-none transition-all text-sm font-medium text-slate-900" placeholder="( )" />
                </div>
                <span className="text-slate-300 font-bold mt-4 text-xs">×</span>
                <div className="space-y-1 w-full">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center block">Tinggi</label>
                  <input type="text" name="tinggi" defaultValue={pHeight} className="w-full text-center px-2 py-3 rounded-xl border-none bg-slate-50 focus:ring-2 focus:ring-[#070864]/20 outline-none transition-all text-sm font-medium text-slate-900" placeholder="( )" />
                </div>
              </div>
            </div>

            {/* Galeri Produk */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm flex-1">
              <h3 className="text-lg font-bold text-[#070864] font-serif mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" /> Galeri Produk
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group">
                    <input type="file" name="imageFiles" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer" />
                    {customOrder.images && customOrder.images.length > 0 ? (
                       // eslint-disable-next-line @next/next/no-img-element
                       <img src={customOrder.images[0].url} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" />
                        <span className="text-[9px] font-bold text-slate-400 group-hover:text-blue-500 uppercase tracking-widest text-center">Ganti<br/>Gambar</span>
                      </>
                    )}
                  </label>
                  
                  <div className="aspect-square rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 overflow-hidden">
                    {customOrder.images && customOrder.images.length > 1 ? (
                       // eslint-disable-next-line @next/next/no-img-element
                       <img src={customOrder.images[1].url} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 opacity-20" />
                    )}
                  </div>
                  <div className="aspect-square rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 overflow-hidden">
                    {customOrder.images && customOrder.images.length > 2 ? (
                       // eslint-disable-next-line @next/next/no-img-element
                       <img src={customOrder.images[2].url} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 opacity-20" />
                    )}
                  </div>
                  <label className="aspect-square rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors relative overflow-hidden">
                     <input type="file" name="imageFiles" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer" />
                     <span className="text-xl text-slate-300 font-light">+</span>
                  </label>
                </div>
                <p className="text-[9px] text-slate-400 font-medium italic mt-4 leading-relaxed">
                  Mengupload gambar baru akan menggantikan semua gambar sebelumnya.
                </p>
              </div>
            </div>
            
            {/* Submit Buttons */}
            <div className="flex flex-col gap-4 mt-auto">
              <SubmitButton 
                className="w-full bg-[#070864] text-white px-6 py-4 rounded-xl text-sm font-bold hover:bg-[#0a0c8f] shadow-xl shadow-[#070864]/20 transition-all uppercase tracking-wider flex justify-center items-center"
                icon={<Save className="w-5 h-5 mr-2" />}
              >
                Simpan Perubahan
              </SubmitButton>
              <Link href="/dashboard/custom-orders" className="w-full px-6 py-4 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-colors text-center uppercase tracking-wider">
                Batal
              </Link>
            </div>

          </div>
        </div>
      </form>
    </div>
  )
}
