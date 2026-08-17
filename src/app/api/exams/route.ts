import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const grade = searchParams.get('grade')
    const studentId = searchParams.get('studentId')
    const where: any = { isActive: true }
    if (grade) where.grade = { name: grade }

    const exams = await db.exam.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { grade: true, results: studentId ? { where: { studentId } } : false },
    })
    return NextResponse.json(exams)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, type, gradeId, dueDate, fileUrl } = body
    if (!title || !gradeId) return NextResponse.json({ error: 'الحقول مطلوبة' }, { status: 400 })

    const exam = await db.exam.create({
      data: {
        title, description, type: type || 'homework', gradeId,
        dueDate: dueDate ? new Date(dueDate) : null,
        fileUrl: fileUrl || null,
      },
    })
    return NextResponse.json(exam, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, title, description, type, gradeId, dueDate, fileUrl, isActive } = await req.json()
    const exam = await db.exam.update({
      where: { id },
      data: { title, description, type, gradeId, dueDate: dueDate ? new Date(dueDate) : null, fileUrl, isActive },
    })
    return NextResponse.json(exam)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    await db.exam.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}