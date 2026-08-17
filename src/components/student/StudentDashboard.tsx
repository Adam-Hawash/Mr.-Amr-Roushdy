'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion } from 'framer-motion'
import { BookOpen, FileQuestion, Megaphone, CreditCard, ArrowLeft, Play, Users, CheckCircle2 } from 'lucide-react'

export default function StudentDashboard() {
  const { student, setCurrentView } = useAppStore()
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [contentCount, setContentCount] = useState(0)
  const [examCount, setExamCount] = useState(0)
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!student) return
    Promise.all([
      fetch(`/api/announcements?grade=${student.gradeName}`).then(r => r.json()).catch(() => []),
      fetch(`/api/content?grade=${student.gradeName}`).then(r => r.json()).catch(() => []),
      fetch(`/api/exams?grade=${student.gradeName}`).then(r => r.json()).catch(() => []),
      fetch(`/api/payments?studentId=${student.id}`).then(r => r.json()).catch(() => []),
    ]).then(([a, c, e, p]) => {
      setAnnouncements(Array.isArray(a) ? a : [])
      setContentCount(Array.isArray(c) ? c.length : 0)
      setExamCount(Array.isArray(e) ? e.length : 0)
      if (Array.isArray(p) && p.length > 0) {
        setPaymentStatus(p[0].status)
      }
      setLoading(false)
    })
  }, [student])

  const quickLinks = [
    { label: 'فيديوهاتي', icon: Play, view: 'student-videos' as const, count: contentCount, color: 'text-primary' },
    { label: 'اختباراتي', icon: FileQuestion, view: 'student-exams' as const, count: examCount, color: 'text-green-600' },
    { label: 'المجتمع', icon: Users, view: 'student-community' as const, count: 0, color: 'text-blue-600' },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">مرحباً، {student?.name?.split(' ')[0]}</h1>
          <p className="text-muted-foreground mt-1">منصة القائد التعليمية - أ. عمرو رشدي</p>
        </div>

        {/* Payment Status Banner */}
        {paymentStatus === 'pending' && (
          <Card className="mb-6 border-amber-300 bg-amber-50">
            <CardContent className="flex items-center gap-3 p-4">
              <CreditCard className="h-5 w-5 text-amber-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">دفعتك قيد المراجعة</p>
                <p className="text-xs text-amber-600">انتظر موافقة الأدمن مستر عمرو لتفعيل الاشتراك</p>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentStatus === 'approved' && (
          <Card className="mb-6 border-emerald-300 bg-emerald-50">
            <CardContent className="flex items-center gap-3 p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-800">الاشتراك مفعّل</p>
                <p className="text-xs text-emerald-600">تم قبول دفعتك. استمتع بالمحتوى التعليمي!</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!paymentStatus && (
          <Card className="mb-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('checkout')}>
            <CardContent className="flex items-center gap-3 p-4">
              <CreditCard className="h-5 w-5 text-primary shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">إتمام الاشتراك</p>
                <p className="text-xs text-muted-foreground">اختر طريقة الدفع وارفع إيصال التحويل</p>
              </div>
              <Button size="sm" className="bg-primary text-primary-foreground">ادفع الآن</Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {quickLinks.map((link, i) => {
            const Icon = link.icon
            return (
              <motion.div key={link.view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView(link.view)}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${link.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{link.label}</p>
                      <p className="text-xs text-muted-foreground">{link.count > 0 ? `${link.count} عنصر` : 'دخول'}</p>
                    </div>
                    <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Announcements */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" /> آخر الإعلانات
            </h2>
            {loading ? (
              <div className="space-y-2"><div className="h-16 bg-muted rounded-lg animate-pulse" /><div className="h-16 bg-muted rounded-lg animate-pulse" /></div>
            ) : announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">لا يوجد إعلانات حالياً</p>
            ) : (
              <ScrollArea className="max-h-80">
                <div className="space-y-2">
                  {announcements.slice(0, 5).map((a: any) => (
                    <div key={a.id} className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{a.title}</span>
                        {a.type === 'urgent' && <Badge variant="destructive" className="text-[10px]">عاجل</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
