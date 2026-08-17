'use client'

import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Send, Loader2, Image as ImageIcon, Users, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface Post {
  id: string
  authorName: string
  authorGrade: string | null
  authorId: string | null
  content: string
  imageUrl: string | null
  likes: number
  createdAt: string
}

export default function StudentCommunity() {
   const { student, setCurrentView, isAdmin } = useAppStore()
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const gradeName = student?.gradeName || ''

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/community${gradeName ? `?grade=${encodeURIComponent(gradeName)}` : ''}`)
      if (res.ok) {
        const data = await res.json()
        setPosts(Array.isArray(data) ? data : [])
      }
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchPosts() }, [gradeName])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [posts])

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url)
    if (url.trim()) {
      setImagePreview(url.trim())
    } else {
      setImagePreview(null)
    }
  }

  const handleSubmitPost = async () => {
    if (!newPost.trim() && !imageUrl.trim()) return
    if (!student) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: isAdmin ? 'أ. عمرو رشدي' : student.name,
          authorGrade: gradeName || null,
          authorId: student.id,
          content: newPost.trim(),
          imageUrl: imageUrl.trim() || null,
        }),
      })
      if (res.ok) {
        setNewPost('')
        setImageUrl('')
        setImagePreview(null)
        fetchPosts()
        toast.success('تم إرسال الرسالة')
      } else {
        toast.error('فشل في إرسال الرسالة')
      }
    } catch {
      toast.error('خطأ في الاتصال')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isMe = (post: Post) => student && post.authorId === student.id
  const isAdminPost = (post: Post) => post.authorName === 'أ. عمرو رشدي'

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <button
          onClick={() => setCurrentView('student-dashboard')}
          className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">مجموعة الصف</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              {gradeName || 'جميع الصفوف'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-thin">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className="max-w-[75%] bg-muted rounded-2xl px-4 py-3 h-16 animate-pulse" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Users className="h-8 w-8 text-primary/50" />
            </div>
            <p className="text-muted-foreground text-sm">لا توجد رسائل بعد. كن أول من يشارك!</p>
          </div>
        ) : (
          posts.map((post, i) => {
            const me = isMe(post)
            const admin = isAdminPost(post)
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex ${me ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  me
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : admin
                    ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-br-sm'
                    : 'bg-muted rounded-br-sm'
                }`}>
                  {/* Author name */}
                  <div className={`flex items-center gap-1.5 mb-1 ${me ? 'justify-end' : ''}`}>
                    <span className={`text-xs font-semibold ${me ? 'text-primary-foreground/80' : admin ? 'text-amber-700 dark:text-amber-400' : 'text-muted-foreground'}`}>
                      {post.authorName}
                    </span>
                    {admin && (
                      <Badge className="text-[8px] px-1 py-0 h-4 bg-amber-500 text-white border-0">معلّم</Badge>
                    )}
                  </div>

                  {/* Content */}
                  <p className={`text-sm leading-relaxed whitespace-pre-wrap ${me ? 'text-primary-foreground' : ''}`}>
                    {post.content}
                  </p>

                  {/* Image */}
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt=""
                      className="max-h-48 rounded-lg mt-2 object-contain"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  )}

                  {/* Time */}
                  <p className={`text-[10px] mt-1 ${me ? 'text-primary-foreground/60' : 'text-muted-foreground/60'}`}>
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </motion.div>
            )
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border rounded-2xl bg-card p-3">
        {imagePreview && (
          <div className="relative mb-2 inline-block">
            <img src={imagePreview} alt="preview" className="max-h-32 rounded-lg object-contain" onContextMenu={(e) => e.preventDefault()} />
            <button
              onClick={() => { setImageUrl(''); setImagePreview(null) }}
              className="absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white text-xs hover:bg-black/70"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmitPost()
              }
            }}
            placeholder="اكتب رسالتك..."
            className="text-right min-h-[44px] max-h-32 resize-none flex-1 border-0 focus-visible:ring-0 p-2"
            rows={1}
          />
          <div className="flex flex-col gap-1">
            <Button
              onClick={() => {
                const url = prompt('أدخل رابط الصورة:')
                if (url) handleImageUrlChange(url)
              }}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              title="إضافة صورة برابط"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSubmitPost}
              disabled={submitting || (!newPost.trim() && !imageUrl.trim())}
              size="icon"
              className="h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
