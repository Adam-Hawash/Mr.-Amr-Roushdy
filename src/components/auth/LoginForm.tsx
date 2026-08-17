'use client'

import { useState, useRef } from 'react'
import { Loader2, Phone, Lock, ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useAppStore } from '@/store/useStore'
import { useToast } from '@/hooks/use-toast'

export default function LoginForm() {
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const login = useAppStore((s) => s.login)
  const { toast } = useToast()

  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [phoneSubmitted, setPhoneSubmitted] = useState(false)
  const phoneInputRef = useRef<HTMLInputElement>(null)

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length < 11) {
      toast({
        title: 'رقم الهاتف غير صحيح',
        description: 'يرجى إدخال رقم هاتف صحيح مكون من 11 رقم',
        variant: 'destructive',
      })
      return
    }
    setPhoneSubmitted(true)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pin.length < 4) {
      toast({
        title: 'رمز الدخول غير مكتمل',
        description: 'يرجى إدخال الرمز المكون من 4 أرقام',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/students/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, pin }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'فشل تسجيل الدخول')
      }

      const student = await res.json()
      login(student)
      toast({
        title: 'مرحباً بك!',
        description: `تم تسجيل الدخول بنجاح، أهلاً ${student.name}`,
      })
    } catch (err) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: err instanceof Error ? err.message : 'حدث خطأ غير متوقع',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setPhoneSubmitted(false)
    setPin('')
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
              <Lock className="size-8 text-gold" />
            </div>
            <CardTitle className="text-2xl font-bold text-gold">
              تسجيل الدخول
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              أدخل بياناتك للوصول إلى حسابك
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            {!phoneSubmitted ? (
              /* Step 1: Phone number */
              <form onSubmit={handlePhoneSubmit} className="space-y-5">
                <div className="space-y-2.5">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    رقم الهاتف
                  </Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      ref={phoneInputRef}
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

                <Button
                  type="submit"
                  className="w-full h-11 gradient-gold text-white font-semibold text-base rounded-lg shadow-md shadow-gold/25 hover:shadow-lg hover:shadow-gold/35 transition-all cursor-pointer"
                >
                  التالي
                  <ArrowLeft className="size-4 mr-2" />
                </Button>
              </form>
            ) : (
              /* Step 2: PIN */
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2.5 text-center">
                  <p className="text-sm text-muted-foreground">
                    أدخل رمز الدخول المكون من 4 أرقام
                  </p>
                  <p className="text-xs text-gold font-medium" dir="ltr">
                    {phone}
                  </p>
                </div>

                <div className="flex justify-center py-3">
                  <InputOTP
                    maxLength={4}
                    value={pin}
                    onChange={setPin}
                    dir="ltr"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-14 w-14 text-xl border-gold/30 data-[active=true]:border-gold data-[active=true]:ring-gold/30" />
                      <InputOTPSlot index={1} className="h-14 w-14 text-xl border-gold/30 data-[active=true]:border-gold data-[active=true]:ring-gold/30" />
                      <InputOTPSlot index={2} className="h-14 w-14 text-xl border-gold/30 data-[active=true]:border-gold data-[active=true]:ring-gold/30" />
                      <InputOTPSlot index={3} className="h-14 w-14 text-xl border-gold/30 data-[active=true]:border-gold data-[active=true]:ring-gold/30" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="h-11 flex-1 border-gold/20 text-gold hover:bg-gold/5 cursor-pointer"
                  >
                    <ArrowRight className="size-4 ml-2" />
                    رجوع
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading || pin.length < 4}
                    className="h-11 flex-[2] gradient-gold text-white font-semibold text-base rounded-lg shadow-md shadow-gold/25 hover:shadow-lg hover:shadow-gold/35 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin ml-2" />
                        جاري تسجيل الدخول...
                      </>
                    ) : (
                      'تسجيل الدخول'
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Register link */}
            <div className="mt-6 text-center">
              <span className="text-sm text-muted-foreground">ليس لديك حساب؟ </span>
              <button
                type="button"
                onClick={() => setCurrentView('register')}
                className="text-sm font-semibold text-gold hover:text-gold-dark hover:underline underline-offset-4 transition-colors cursor-pointer"
              >
                سجل الآن
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
