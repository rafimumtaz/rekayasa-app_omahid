import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check if products already exist
    const count = await prisma.product.count()
    if (count > 0) {
      return NextResponse.json({ message: 'Products already seeded', count })
    }

    const sampleProducts = [
      {
        name: 'Kasur Serenity Premium',
        description: 'Nikmati kenyamanan maksimal dengan tempat tidur yang dirancang untuk gaya hidup modern.',
        price: 3500000,
        category: 'KASUR',
      },
      {
        name: 'Meja Makan Set Minimalis',
        description: 'Meja makan dengan desain minimalis elegan, cocok untuk keluarga kecil.',
        price: 2100000,
        category: 'MEJA MAKAN SET',
      },
      {
        name: 'Rak Serbaguna Kayu Jati',
        description: 'Rak serbaguna tahan lama dari kayu jati asli.',
        price: 850000,
        category: 'RAK SERBAGUNA',
      },
      {
        name: 'Meja Rias Aesthetic',
        description: 'Meja rias dengan lampu LED dan desain aesthetic modern.',
        price: 1250000,
        category: 'MEJA RIAS',
      },
      {
        name: 'Kursi Santai Scandinavian',
        description: 'Kursi santai nyaman dengan gaya scandinavian yang cocok untuk ruang keluarga.',
        price: 750000,
        category: 'KURSI',
      },
    ]

    const created = await prisma.product.createMany({
      data: sampleProducts,
    })

    return NextResponse.json({ message: 'Seeded successfully', created })
  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed products', details: error.message }, { status: 500 })
  }
}
