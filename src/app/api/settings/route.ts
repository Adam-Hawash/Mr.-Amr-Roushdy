import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const key = searchParams.get('key')

    if (key) {
      const setting = await db.siteSettings.findUnique({ where: { key } })
      return NextResponse.json(setting || { key, value: '' })
    }

    const settings = await db.siteSettings.findMany()
    const result: Record<string, string> = {}
    settings.forEach(s => { result[s.key] = s.value })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { key, value } = await req.json()
    if (!key) return NextResponse.json({ error: 'المفتاح مطلوب' }, { status: 400 })

    const setting = await db.siteSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
    return NextResponse.json(setting)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}
