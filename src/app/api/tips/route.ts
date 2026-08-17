import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const tips = await db.studyTip.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(tips)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, imageUrl, order } = body
    if (!title || !description) {
      return NextResponse.json({ error: 'العنوان والوصف مطلوبان' }, { status: 400 })
    }
    const tip = await db.studyTip.create({
      data: {
        title,
        description,
        imageUrl: imageUrl || null,
        order: order ? parseInt(order) : 0,
      },
    })
    return NextResponse.json(tip, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, title, description, imageUrl, order, isActive } = body
    if (!id) return NextResponse.json({ error: 'معرف مطلوب' }, { status: 400 })
    const tip = await db.studyTip.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        ...(order !== undefined && { order: parseInt(order) }),
        ...(isActive !== undefined && { isActive }),
      },
    })
    return NextResponse.json(tip)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'معرف مطلوب' }, { status: 400 })
    await db.studyTip.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
