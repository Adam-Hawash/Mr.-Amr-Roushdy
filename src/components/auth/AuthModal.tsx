'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Loader2, UserPlus, LogIn } from 'lucide-react'

function validateArabicLetters(str: string, minParts: number): boolean {
  const parts = str.trim().split(/\s+/)
  if (parts.length < minParts) return false
  const arabicRegex = /^[\u0600-\u06FF\s]+$/
  return arabicRegex.test(str.trim())
}

function validatePhone(str: string): boolean {
  return /^01[0-9]{9}$/.test(str.trim())
}

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authModalTab, setAuthModalTab, login } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [grades, setGrades] = useState<{ name: string; displayName: string }[]>([])

  // Register fields
  const [regName, setRegName] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regParentName, setRegParentName] = useState('')
  const [regParentPhone, setRegParentPhone] = useState('')
  const [regGrade, setRegGrade] = useState('')

  // Login fields
  const [loginPhone, setLoginPhone] = useState('')

  useEffect(() => {
    if (authModalOpen) {
      fetch('/api/grades')
        .then(r => r.json())
        .then(d => setGrades(Array.isArray(d) ? d : []))
        .catch(() => setGrades([
          { name: 'grade-1', displayName: 'الصف الأول الثانوي' },
          { name: 'grade-2', displayName: 'الصف الثاني الثانوي' },
          { name: 'grade-3', displayName: 'الصف الثالث الثانوي' },
        ]))
    }
  }, [authModalOpen])

  const resetFields = () => {
    setLoginPhone('')
    setRegName('')
    setRegPhone('')
    setRegParentName('')
    setRegParentPhone('')
    setRegGrade('')
  }

  const getRegErrors = () => {
    const errs: string[] = []
    if (!validateArabicLetters(regName, 4)) errs.push('اسم الطالب يجب أن يكون 4 أجزاء بالعربية على الأقل')
    if (!validatePhone(regPhone)) errs.push('رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 01')
    if (!validateArabicLetters(regParentName, 2)) errs.push('اسم ولي الأمر يجب أن يكون جزأين بالعربية على الأقل')
    if (!validatePhone(regParentPhone)) errs.push('رقم هاتف ولي الأمر يجب أن يكون 11 رقم ويبدأ بـ 01')
    if (!regGrade) errs.push('اختر الصف الدراسي')
    return errs
  }

  const handleRegister = async () => {
    const errs = getRegErrors()
    if (errs.length > 0) {
      errs.forEach(e => toast.error(e))
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          phone: regPhone.trim(),
          parentName: regParentName.trim(),
          parentPhone: regParentPhone.trim(),
          gradeName: regGrade,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setAuthModalOpen(false)
        toast.success('تم إرسال طلبك بنجاح، انتظر موافقة الأدمن (مستر عمرو) لتفعيل الحساب')
        resetFields()
      } else {
        toast.error(data.error || 'حدث خطأ أثناء التسجيل')
      }
    } catch {
      toast.error('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!validatePhone(loginPhone)) {
      toast.error('رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 01')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/students/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginPhone.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        login(data.student)
        toast.success(`مرحباً ${data.student.name}`)
        setLoginPhone('')
      } else {
        toast.error(data.error || 'بيانات الدخول غير صحيحة')
      }
    } catch {
      toast.error('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={authModalOpen} onOpenChange={(open) => { setAuthModalOpen(open); if (!open) resetFields() }}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-foreground">
            منصة القائد التعليمية
          </DialogTitle>
        </DialogHeader>

        <Tabs value={authModalTab} onValueChange={(v) => setAuthModalTab(v as 'login' | 'register')} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register" className="text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UserPlus className="ml-1 h-4 w-4" /> إنشاء حساب جديد
            </TabsTrigger>
            <TabsTrigger value="login" className="text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <LogIn className="ml-1 h-4 w-4" /> تسجيل دخولك
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="space-y-3 mt-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">اسم الطالب الرباعي</Label>
              <Input value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="مثال: أحمد محمد علي حسن" className="text-right" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">رقم هاتف الطالب</Label>
              <Input value={regPhone} onChange={(e) => setRegPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))} placeholder="01XXXXXXXXX" className="text-right" dir="ltr" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">اسم ولي الأمر</Label>
              <Input value={regParentName} onChange={(e) => setRegParentName(e.target.value)} placeholder="مثال: محمد علي حسن" className="text-right" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">رقم هاتف ولي الأمر</Label>
              <Input value={regParentPhone} onChange={(e) => setRegParentPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))} placeholder="01XXXXXXXXX" className="text-right" dir="ltr" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">الصف الدراسي</Label>
              <select value={regGrade} onChange={(e) => setRegGrade(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">اختر الصف...</option>
                {grades.map(g => <option key={g.name} value={g.name}>{g.displayName}</option>)}
              </select>
            </div>
            <Button onClick={handleRegister} disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11">
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              إنشاء حساب
            </Button>
          </TabsContent>

          <TabsContent value="login" className="space-y-3 mt-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">رقم الهاتف</Label>
              <Input value={loginPhone} onChange={(e) => setLoginPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))} placeholder="01XXXXXXXXX" className="text-right" dir="ltr" onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
            </div>
            <Button onClick={handleLogin} disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11">
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              تسجيل الدخول
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
