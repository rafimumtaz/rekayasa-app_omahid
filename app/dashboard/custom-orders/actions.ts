'use server'
import { prisma } from '@/lib/prisma'

export async function getAllCustomOrders(status?: string) {
  return await prisma.customOrder.findMany({
    where: status ? { status: status as any } : {},
    orderBy: { createdAt: 'desc' },
    include: { images: true }
  })
}

export async function deleteCustomOrder(id: string) {
  await prisma.customOrder.delete({
    where: { id }
  })
}
