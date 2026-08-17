'use client'

import { useState } from 'react'
import { Loader2, UserPlus, Phone, Users, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppStore, type ViewName } from '@/store/useStore'
import { useToast } from '@/hooks/use-toast'

const GRADE_OPTIONS = [
  { value: 'الصف الأول', label: 'الصف الأول' },
  { value: 'الصف الثاني', label: 'الصف الثاني' },
  { value: 'الصف الثالث', label: 'الصف الثالث' },
]

export default function RegisterForm() {
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const login = useAppStore((s) => s.login)
  const { toast } = useToast()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [grade, setGrade] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isValid = fullName.trim().length >= 3 && phone.length === 11 && grade !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid) {
      toast({
        title: 'بيانات غير مكتملة',
        description: 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح',
        variant: 'destructive',
      })
      return
    }

    if (parentPhone && parentPhone.length !== 11) {
      toast({
        title: 'رقم ولي الأمر غير صحيح',
        description: 'يجب أن يتكون رقم الهاتف من 11 رقم',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(),
          phone,
          gradeName: grade,
          parentPhone: parentPhone || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'فشل إنشاء الحساب')
      }

      const student = await res.json()
      login(student)
      toast({
        title: 'تم إنشاء الحساب بنجاح!',
        description: `أهلاً بك ${student.name}، يرجى إتمام عملية الاشتراك`,
      })
      setCurrentView('checkout' as ViewName)
    } catch (err) {
      toast({
        title: 'خطأ في إنشاء الحساب',
        description: err instanceof Error ? err.message : 'حدث خطأ غير متوقع',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="border-gold/20 shadow-lg shadow-gold/5">
          {/* Gold top accent bar */}
          <div className="h-1.5 gradient-gold rounded-t-xl" />

          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
              <UserPlus className="size-8 text-gold" />
            </div>
            <CardTitle className="text-2xl font-bold text-gold">
              إنشاء حساب جديد
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              انضم إلى منصة القائد وابدأ رحلتك التعليمية
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2.5">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  الاسم الكامل <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Users className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pr-10 h-11 border-gold/20 focus-visible:border-gold focus-visible:ring-gold/30"
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2.5">
                <Label htmlFor="phone" className="text-sm font-medium">
                  رقم الهاتف <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    dir="ltr"
                    textAlign="left"
                    placeholder="01xxxxxxxxx"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))
                    }
                    className="pr-10 h-11 border-gold/20 focus-visible:border-gold focus-visible:ring-gold/30"
                    maxLength={11}
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Grade Selection */}
              <div className="space-y-2.5">
                <Label className="text-sm font-medium">
                  الصف الدراسي <span className="text-destructive">*</span>
                </Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="w-full h-11 border-gold/20 focus:ring-gold/30 data-[state=open]:border-gold">
                    <GraduationCap className="size-4 text-muted-foreground ml-2" />
                    <SelectValue placeholder="اختر الصف الدراسي" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADE_OPTIONS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Parent Phone (Optional) */}
              <div className="space-y-2.5">
                <Label htmlFor="parentPhone" className="text-sm font-medium">
                  رقم ولي الأمر
                  <span className="text-muted-foreground font-normal mr-1.5">(اختياري)</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="parentPhone"
                    type="tel"
                    dir="ltr"
                    textAlign="left"
                    placeholder="01xxxxxxxxx"
                    value={parentPhone}
                    onChange={(e) =>
                      setParentPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))
                    }
                    className="pr-10 h-11 border-gold/20 focus-visible:border-gold focus-visible:ring-gold/30"
                    maxLength={11}
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading || !isValid}
                className="w-full h-11 gradient-gold text-white font-semibold text-base rounded-lg shadow-md shadow-gold/25 hover:shadow-lg hover:shadow-gold/35 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin ml-2" />
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  'إنشاء حساب'
                )}
              </Button>
            </form>

            {/* Login link */}
            <div className="mt-6 text-center">
              <span className="text-sm text-muted-foreground">لديك حساب؟ </span>
              <button
                type="button"
                onClick={() => setCurrentView('login')}
                className="text-sm font-semibold text-gold hover:text-gold-dark hover:underline underline-offset-4 transition-colors cursor-pointer"
              >
                تسجيل الدخول
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
