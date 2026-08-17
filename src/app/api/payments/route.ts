import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const studentId = searchParams.get('studentId')
    const where: any = {}
    if (status) where.status = status
    if (studentId) where.studentId = studentId

    const payments = await db.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { student: { select: { name: true, phone: true, gradeName: true } } },
    })
    return NextResponse.json(payments)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { studentId, amount, method, receiptUrl, notes } = body
    if (!studentId || !amount || !method) return NextResponse.json({ error: 'الحقول مطلوبة' }, { status: 400 })

    const payment = await db.payment.create({
      data: { studentId, amount, method, receiptUrl, notes, status: 'pending' },
    })

    // Notify admin
    try {
      const student = await db.student.findUnique({ where: { id: studentId } })
      if (student) {
        const { sendNotification } = await import('@/app/api/students/route')
        await sendNotification('دفعة جديدة', `دفعة من ${student.name} - مبلغ: ${amount} - طريقة: ${method}`)
      }
    } catch { /* ignore */ }

    return NextResponse.json(payment, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status } = await req.json()
    if (!id || !status) return NextResponse.json({ error: 'الحقول مطلوبة' }, { status: 400 })

    const payment = await db.payment.update({ where: { id }, data: { status } })

    // If approved, activate student
    if (status === 'approved') {
      const p = await db.payment.findUnique({ where: { id }, include: { student: true } })
      if (p?.student && !p.student.isActive) {
        await db.student.update({ where: { id: p.student.id }, data: { isActive: true } })
      }
    }

    return NextResponse.json(payment)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}