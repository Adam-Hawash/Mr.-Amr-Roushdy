import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const items = await db.galleryItem.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, type, url, thumbnail, order } = body
    if (!type || !url) return NextResponse.json({ error: 'الحقول مطلوبة' }, { status: 400 })

    const item = await db.galleryItem.create({
      data: { title, type, url, thumbnail, order: order || 0 },
    })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    await db.galleryItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}