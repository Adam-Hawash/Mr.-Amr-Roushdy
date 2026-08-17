'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Heart, Send, LogIn, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/store/useStore'
import { toast } from 'sonner'

interface CommunityPost {
  id: number
  authorId: string
  authorName: string
  authorGrade: string
  content: string
  likes: number
  likedByMe: boolean
  createdAt: string
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

function formatRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)

  if (diffSec < 60) return 'الآن'
  if (diffMin < 60) return `منذ ${diffMin} دقيقة`
  if (diffHour < 24) return `منذ ${diffHour} ساعة`
  if (diffDay < 7) return `منذ ${diffDay} يوم`
  if (diffWeek < 4) return `منذ ${diffWeek} أسبوع`
  if (diffMonth < 12) return `منذ ${diffMonth} شهر`
  return `منذ ${Math.floor(diffMonth / 12)} سنة`
}

function PostSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-10" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function Community() {
  const { isLoggedIn, student, setAuthModalOpen } = useAppStore()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [newPostContent, setNewPostContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/community')
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch {
      toast.error('حدث خطأ أثناء تحميل المنشورات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleCreatePost = async () => {
    if (!student || !newPostContent.trim()) return

    try {
      setSubmitting(true)
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: student.name,
          authorGrade: student.gradeName,
          authorId: student.id,
          content: newPostContent.trim(),
        }),
      })

      if (res.ok) {
        const created = await res.json()
        setPosts((prev) => [created, ...prev])
        setNewPostContent('')
        toast.success('تم نشر مشاركتك بنجاح')
      } else {
        toast.error('فشل في نشر المشاركة')
      }
    } catch {
      toast.error('حدث خطأ أثناء النشر')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLike = async (postId: number) => {
    try {
      const res = await fetch('/api/community', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action: 'like' }),
      })

      if (res.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likedByMe: !post.likedByMe,
                  likes: post.likedByMe ? post.likes - 1 : post.likes + 1,
                }
              : post
          )
        )
      }
    } catch {
      toast.error('حدث خطأ أثناء تسجيل الإعجاب')
    }
  }

  return (
    <section className="py-16 sm:py-20 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h2 className="text-2xl font-bold text-foreground">المجتمع</h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center text-muted-foreground mb-10 max-w-lg mx-auto"
        >
          انضم لمجتمعنا التعليمي وتواصل مع زملائك
        </motion.p>

        {/* Not Logged In State */}
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-10">
              <CardContent className="py-10 flex flex-col items-center gap-4 text-center">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <LogIn className="h-6 w-6 text-primary" />
                </div>
                <p className="text-muted-foreground text-base">
                  سجل دخولك للمشاركة في المجتمع
                </p>
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                >
                  سجل الآن
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Logged In - Post Creation */}
        {isLoggedIn && student && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="p-4 flex flex-col gap-3">
                <Textarea
                  rows={3}
                  placeholder="شارك أفكارك مع زملائك..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() || submitting}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        جارٍ النشر...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        نشر
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Posts List */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardContent className="py-12 flex flex-col items-center gap-3 text-center">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <p className="text-muted-foreground text-base">
                  لا توجد منشورات بعد. كن أول من يشارك!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-4"
          >
            {posts.map((post) => (
              <motion.div key={post.id} variants={cardVariants}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-4 sm:p-6 flex flex-col gap-3">
                    {/* Author & Grade */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {post.authorName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-sm">
                            {post.authorName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(post.createdAt)}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-primary bg-primary/10 border-primary/20 text-[10px] sm:text-xs shrink-0"
                      >
                        {post.authorGrade}
                      </Badge>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* Like Button */}
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1.5 text-sm transition-colors cursor-pointer self-start hover:scale-105 active:scale-95"
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          post.likedByMe
                            ? 'text-red-500 fill-red-500'
                            : 'text-muted-foreground'
                        }`}
                      />
                      <span
                        className={
                          post.likedByMe
                            ? 'text-red-500 font-medium'
                            : 'text-muted-foreground'
                        }
                      >
                        {post.likes}
                      </span>
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
