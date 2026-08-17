import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const grade = searchParams.get('grade')

    const where: any = { isActive: true }
    if (grade) {
      // Show posts for this grade + posts with no grade (admin general posts)
      where.OR = [
        { authorGrade: grade },
        { authorGrade: null },
      ]
    }

    const posts = await db.communityPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { authorName, authorGrade, authorId, content, imageUrl } = body
    if (!authorName || !content) return NextResponse.json({ error: 'الحقول مطلوبة' }, { status: 400 })

    const post = await db.communityPost.create({
      data: { authorName, authorGrade, authorId, content, imageUrl },
    })
    return NextResponse.json(post, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { postId, action } = await req.json()
    if (action === 'like') {
      const post = await db.communityPost.findUnique({ where: { id: postId } })
      if (!post) return NextResponse.json({ error: 'غير موجود' }, { status: 404 })
      const updated = await db.communityPost.update({
        where: { id: postId },
        data: { likes: post.likes + 1 },
      })
      return NextResponse.json(updated)
    }
    return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    await db.communityPost.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'فشل' }, { status: 500 })
  }
}