import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const grade = searchParams.get('grade')
    const type = searchParams.get('type')
    const where: any = { isActive: true }
    if (type) where.type = type
    if (grade) where.grade = { name: grade }
    const content = await db.content.findMany({ where, orderBy: { order: 'asc' }, include: { grade: true } })
    return NextResponse.json(content)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, type, url, thumbnail, gradeId, duration, order } = body
    if (!title || !url || !gradeId) return NextResponse.json({ error: 'الحقول مطلوبة' }, { status: 400 })
    const content = await db.content.create({
      data: { title, description, type, url, thumbnail, gradeId, duration: duration || null, order: order || 0 },
    })
    return NextResponse.json(content, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...data } = await req.json()
    const content = await db.content.update({ where: { id }, data })
    return NextResponse.json(content)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    await db.content.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}