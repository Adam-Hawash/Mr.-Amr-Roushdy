import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId')
    if (!studentId) return NextResponse.json([])

    const progress = await db.videoProgress.findMany({
      where: { studentId },
      include: { content: { select: { title: true, thumbnail: true, duration: true } } },
    })
    return NextResponse.json(progress)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { studentId, contentId, watchedSeconds, percentage } = await req.json()
    const progress = await db.videoProgress.upsert({
      where: { studentId_contentId: { studentId, contentId } },
      update: { watchedSeconds, percentage, completed: percentage >= 100, lastWatched: new Date() },
      create: { studentId, contentId, watchedSeconds, percentage, completed: percentage >= 100 },
    })
    return NextResponse.json(progress)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}