'use server'
import { prisma } from '@/lib/prisma'

export async function getDashboardReportData() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    orderBy: { createdAt: 'desc' },
    include: { items: true, user: true }
  })
  
  const customOrders = await prisma.customOrder.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  })
  
  return { orders, customOrders }
}
