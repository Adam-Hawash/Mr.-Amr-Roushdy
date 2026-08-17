import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()
    if (!phone) return NextResponse.json({ error: 'رقم الهاتف مطلوب' }, { status: 400 })

    const student = await db.student.findUnique({ where: { phone } })
    if (!student) return NextResponse.json({ error: 'الرقم غير مسجل' }, { status: 404 })
    if (!student.isActive) return NextResponse.json({ error: 'الحساب غير مفعل بعد. انتظر موافقة الأدمن.' }, { status: 403 })

    return NextResponse.json({ student })
  } catch {
    return NextResponse.json({ error: 'خطأ في الدخول' }, { status: 500 })
  }
}