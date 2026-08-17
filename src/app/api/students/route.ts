import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const grade = searchParams.get('grade')
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    const where: any = {}
    if (grade) where.gradeName = grade
    if (status === 'active') where.isActive = true
    if (status === 'inactive') where.isActive = false
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
      ]
    }

    const students = await db.student.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(students)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, parentName, parentPhone, gradeName } = body

    if (!name || !phone || !parentName || !parentPhone || !gradeName) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    const existing = await db.student.findUnique({ where: { phone } })
    if (existing) {
      return NextResponse.json({ error: 'هذا الرقم مسجل بالفعل' }, { status: 400 })
    }

    const student = await db.student.create({
      data: { name, phone, parentName, parentPhone, gradeName, isActive: false, role: 'student' },
    })

    // Send notification if configured
    sendNotification('تسجيل طالب جديد', `طالب جديد: ${name} - هاتف: ${phone} - صف: ${gradeName}`)

    return NextResponse.json({ student, message: 'تم إرسال طلبك بنجاح' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'فشل التسجيل' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, isActive, ...data } = await req.json()
    const student = await db.student.update({
      where: { id },
      data: { ...data, ...(isActive !== undefined ? { isActive } : {}) },
    })
    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 })
  }
}

// Helper: send email notification via Send API
async function sendNotification(subject: string, body: string) {
  try {
    const settings: any = {}
    const keys = ['send_enabled', 'send_api_url', 'send_api_key', 'from_email', 'to_email']
    const results = await Promise.all(keys.map(k =>
      db.siteSettings.findUnique({ where: { key: k } }).then(r => ({ [k]: r?.value || '' }))
    ))
    results.forEach(r => Object.assign(settings, r))

    if (settings.send_enabled !== 'true' || !settings.send_api_url || !settings.to_email) return

    await fetch(settings.send_api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.send_api_key}`,
      },
      body: JSON.stringify({
        from: settings.from_email,
        to: settings.to_email,
        subject, body,
      }),
    })
  } catch { /* silently fail */ }
}

// Re-export for use in other routes
export { sendNotification }