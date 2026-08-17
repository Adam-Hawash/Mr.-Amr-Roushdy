'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { ArrowRight, FileText, ClipboardList, Calendar, Upload, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useAppStore } from '@/store/useStore'
import { toast } from 'sonner'

type ExamItem = {
  id: string
  title: string
  description: string | null
  type: string
  gradeId: string
  dueDate: string | null
  fileUrl: string | null
  results?: ExamResultItem[]
}

type ExamResultItem = {
  id: string
  examId: string
  score: number | null
  feedback: string | null
  submittedAt: string | null
}

export default function ExamList() {
  const { student, setCurrentView } = useAppStore()
  const [exams, setExams] = useState<ExamItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState<ExamItem | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const grade = student?.gradeName || ''

  const fetchExams = useCallback(async () => {
    if (!grade) return
    setLoading(true)
    try {
      const res = await fetch(`/api/exams?grade=${encodeURIComponent(grade)}&studentId=${student?.id || ''}`)
      if (res.ok) {
        const data = await res.json()
        setExams(Array.isArray(data) ? data : [])
      } else {
        setExams([])
      }
    } catch {
      toast.error('تعذر تحميل الاختبارات')
      setExams([])
    } finally {
      setLoading(false)
    }
  }, [grade, student?.id])

  useEffect(() => { fetchExams() }, [fetchExams])

  const getResultForExam = (exam: ExamItem): ExamResultItem | undefined => {
    return exam.results?.[0]
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const handleUploadClick = (exam: ExamItem) => {
    const result = getResultForExam(exam)
    if (result?.submittedAt) {
      toast.info('تم تسليم هذا الواجب بالفعل')
      return
    }
    setSelectedExam(exam)
    setSelectedFile(null)
    setUploadOpen(true)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      toast.error('يرجى رفع ملف PDF أو صورة فقط')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('حجم الملف لا يجب أن يتجاوز 10 ميجا')
      return
    }
    setSelectedFile(file)
  }

  const handleUploadSubmit = async () => {
    if (!selectedExam || !selectedFile || !student?.id) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error('فشل رفع الملف')

      await fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          contentId: selectedExam.id,
          watchedSeconds: 0,
          percentage: 0,
        }),
      })

      toast.success(`تم تسليم "${selectedExam.title}" بنجاح`)
      setUploadOpen(false)
      setSelectedFile(null)
      setSelectedExam(null)
      fetchExams()
    } catch {
      toast.error('فشل في رفع الملف')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setCurrentView('student-dashboard')}
          className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold">اختباراتي</h1>
          <p className="text-sm text-muted-foreground">الاختبارات والواجبات المنزلية</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4"><div className="flex items-start gap-4"><Skeleton className="h-10 w-10 rounded-xl shrink-0" /><div className="flex-1 space-y-2"><Skeleton className="h-5 w-1/2" /><Skeleton className="h-4 w-1/3" /></div></div></Card>
          ))}
        </div>
      ) : exams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <ClipboardList className="h-10 w-10 text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">لا توجد اختبارات حالياً</h3>
          <p className="max-w-sm text-sm text-muted-foreground">لم يتم إضافة اختبارات لهذه المرحلة بعد.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => {
            const result = getResultForExam(exam)
            const submitted = !!result?.submittedAt
            const graded = !!result?.score
            const overdue = isOverdue(exam.dueDate) && !submitted

            return (
              <Card key={exam.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${exam.type === 'exam' ? 'bg-primary/10' : 'bg-muted'}`}>
                      {exam.type === 'exam' ? <FileText className="h-5 w-5 text-primary" /> : <ClipboardList className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{exam.title}</h3>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {exam.type === 'exam' ? 'اختبار' : 'واجب'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {exam.dueDate && (
                          <span className={`flex items-center gap-1 ${overdue ? 'text-red-500 font-medium' : ''}`}>
                            <Calendar className="h-3 w-3" />
                            {overdue ? 'منتهي الميعاد' : `تسليم: ${formatDate(exam.dueDate)}`}
                          </span>
                        )}
                        {result?.submittedAt && (
                          <span className="flex items-center gap-1"><Upload className="h-3 w-3" /> تسليم: {formatDate(result.submittedAt)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      {graded && result?.score !== null && (
                        <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-bold text-emerald-700">{result.score}</span>
                        </div>
                      )}
                      <Badge className={graded ? 'bg-emerald-100 text-emerald-700' : submitted ? 'bg-sky-100 text-sky-700' : 'bg-yellow-100 text-yellow-700'}>
                        {graded ? 'تم التصحيح' : submitted ? 'تم التسليم' : 'قيد الانتظار'}
                      </Badge>
                      {exam.type === 'homework' && !graded && (
                        <Button size="sm" variant="outline" onClick={() => handleUploadClick(exam)}>
                          <Upload className="h-3.5 ml-1" />{submitted ? 'إعادة رفع' : 'رفع الحل'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">رفع حل الواجب</DialogTitle>
            <DialogDescription className="text-right">{selectedExam?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div
              className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${selectedFile ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}`}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={handleFileSelect} />
              {selectedFile ? (
                <>
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-7 w-7 text-primary" />
                  </div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} ميجابايت</p>
                </>
              ) : (
                <>
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <Upload className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">اضغط لاختيار ملف</p>
                  <p className="mt-1 text-xs text-muted-foreground">PDF, JPG, PNG — بحد أقصى 10 ميجابايت</p>
                </>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setUploadOpen(false)} disabled={uploading} className="flex-1">إلغاء</Button>
            <Button onClick={handleUploadSubmit} disabled={!selectedFile || uploading} className="flex-1 bg-primary text-primary-foreground">
              {uploading ? <><Loader2 className="h-4 animate-spin" /> جاري الرفع...</> : <><Upload className="h-4" /> رفع الحل</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
