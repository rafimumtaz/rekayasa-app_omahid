import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // First, find or create a dummy user
  let user = await prisma.user.findFirst({ where: { role: 'USER' } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'dummy@user.com',
        password: 'password123',
        name: 'Dummy User',
      }
    })
  }

  const dummyData = [
    {
      displayId: 'ORD-00124-C',
      productName: 'Kursi Kerja Jati Minimalis',
      description: 'Sandaran melengkung...',
      materials: 'KAYU JATI SOLID, VELVET',
      dimensions: '55 x 60 x 95 cm',
      estimatedPrice: 3450000,
      status: 'PRODUKSI' as const,
      userId: user.id
    },
    {
      displayId: 'ORD-00125-C',
      productName: 'Meja Makan Oval Gold Accent',
      description: 'Kaki meja menggunaka...',
      materials: 'WALNUT, STAINLESS STEEL',
      dimensions: '220 x 110 x 75 cm',
      estimatedPrice: 12800000,
      status: 'SELESAI' as const,
      userId: user.id
    },
    {
      displayId: 'ORD-00126-C',
      productName: 'Lemari Pajangan Industrial',
      description: 'Pintu kaca tempered...',
      materials: 'PINUS, IRON, GLASS',
      dimensions: '120 x 40 x 200 cm',
      estimatedPrice: 6200000,
      status: 'PENDING' as const,
      userId: user.id
    },
    {
      displayId: 'ORD-00127-C',
      productName: 'Tempat Tidur King "Cloud"',
      description: 'Rangka tempat tidur ful...',
      materials: 'MAHONI, LINEN, FOAM',
      dimensions: '200 x 200 x 45 cm',
      estimatedPrice: 8950000,
      status: 'REVIEW' as const,
      userId: user.id
    }
  ]

  for (const data of dummyData) {
    await prisma.customOrder.upsert({
      where: { displayId: data.displayId },
      update: {},
      create: data
    })
  }

  console.log('Seed completed successfully')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
