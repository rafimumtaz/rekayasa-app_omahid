import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, password } = await req.json()
    const updateData: any = {}

    if (name) updateData.name = name
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No data to update' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    })

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email }
    })
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
