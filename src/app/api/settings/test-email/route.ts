import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { apiUrl, apiKey, fromEmail, toEmail, subject, body } = await req.json()
    if (!apiUrl || !toEmail) return NextResponse.json({ error: 'الحقول مطلوبة' }, { status: 400 })

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ from: fromEmail, to: toEmail, subject, body }),
    })

    if (res.ok) return NextResponse.json({ message: 'تم إرسال رسالة الاختبار بنجاح' })
    return NextResponse.json({ error: 'فشل الإرسال' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'خطأ في الاتصال' }, { status: 500 })
  }
}