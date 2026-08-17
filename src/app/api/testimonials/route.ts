import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const items = await db.testimonial.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { studentName, grade, content, rating } = body
    if (!studentName || !content) return NextResponse.json({ error: 'الحقول مطلوبة' }, { status: 400 })

    const item = await db.testimonial.create({ data: { studentName, grade, content, rating: rating || 5 } })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    await db.testimonial.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}