import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const grades = await db.grade.findMany({ orderBy: { order: 'asc' }, include: { _count: { select: { students: true, content: true } } } })
    return NextResponse.json(grades)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, displayName, order } = await req.json()
    if (!name || !displayName) return NextResponse.json({ error: 'الاسم مطلوب' }, { status: 400 })
    const grade = await db.grade.create({ data: { name, displayName, order: order || 0 } })
    return NextResponse.json(grade, { status: 201 })
  } catch (e: any) {
    if (e.code === 'P2002') return NextResponse.json({ error: 'الاسم موجود بالفعل' }, { status: 400 })
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, displayName, order, isActive } = await req.json()
    const grade = await db.grade.update({ where: { id }, data: { name, displayName, order, isActive } })
    return NextResponse.json(grade)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    await db.grade.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 })
  }
}