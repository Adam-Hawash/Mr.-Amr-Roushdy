import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const grade = searchParams.get('grade')
    const type = searchParams.get('type')
    const where: any = { isActive: true }
    if (type) where.type = type
    if (grade) where.gradeId = grade

    const items = await db.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, content, type, gradeId } = body
    if (!title || !content) return NextResponse.json({ error: 'الحقول مطلوبة' }, { status: 400 })

    const item = await db.announcement.create({
      data: { title, content, type: type || 'general', gradeId: type === 'grade_specific' ? gradeId : null },
    })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, title, content, type, gradeId, isActive } = await req.json()
    const item = await db.announcement.update({
      where: { id },
      data: { title, content, type, gradeId: type === 'grade_specific' ? gradeId : null, isActive },
    })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    await db.announcement.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}