'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { CreditCard, Smartphone, Phone, Check, Copy, Loader2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface WalletNumber {
  method: string
  number: string
}

const PAYMENT_METHODS = [
  { id: 'fawry', label: 'فوري', icon: CreditCard, recommended: false },
  { id: 'instapay', label: 'إنستاباي', icon: Smartphone, recommended: false },
  { id: 'vodafone_cash', label: 'فودافون كاش', icon: Phone, recommended: true },
  { id: 'orange_cash', label: 'أورانج كاش', icon: Phone, recommended: false },
  { id: 'etisalat_cash', label: 'اتصالات كاش', icon: Phone, recommended: false },
]

export default function CheckoutForm() {
  const { student, setCurrentView, setPendingPaymentId } = useAppStore()
  const [selectedMethod, setSelectedMethod] = useState('vodafone_cash')
  const [walletNumbers, setWalletNumbers] = useState<WalletNumber[]>([])
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/settings?key=wallet_numbers')
      .then(r => r.json())
      .then(d => {
        if (d.value) {
          try { setWalletNumbers(JSON.parse(d.value)) } catch { /* ignore */ }
        }
      })
      .catch(() => {})
  }, [])

  const currentWallet = walletNumbers.find(w => w.method === selectedMethod)

  const copyNumber = (method: string, number: string) => {
    navigator.clipboard.writeText(number).then(() => {
      setCopiedId(method)
      toast.success('تم نسخ الرقم')
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('يرجى رفع صورة فقط')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الملف لا يجب أن يتجاوز 5 ميجا')
      return
    }
    setReceiptFile(file)
    setReceiptPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!receiptFile) {
      toast.error('يرجى رفع إيصال الدفع')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', receiptFile)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error || 'فشل رفع الملف')

      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student?.id,
          method: selectedMethod,
          receiptUrl: uploadData.url,
          amount: 500,
          notes: notes || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'فشل إرسال الدفع')

      setPendingPaymentId(data.id)
      setCurrentView('pending')
      toast.success('تم إرسال إيصال الدفع بنجاح')
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button onClick={() => setCurrentView('student-dashboard')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowRight className="h-4 w-4" /> العودة للوحة الطالب
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-2">إتمام عملية الاشتراك</h1>
      <p className="text-muted-foreground mb-6">اختر طريقة الدفع وارفع إيصال التحويل</p>

      {/* Amount */}
      <Card className="mb-6">
        <CardContent className="flex items-center justify-between p-4">
          <span className="text-muted-foreground">قيمة الاشتراك</span>
          <span className="text-2xl font-bold text-primary">500 جنيه</span>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="space-y-2 mb-6">
        <p className="text-sm font-semibold text-foreground mb-3">اختر طريقة الدفع</p>
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon
          const wallet = walletNumbers.find(w => w.method === method.id)
          const isSelected = selectedMethod === method.id
          return (
            <motion.div
              key={method.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMethod(method.id)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{method.label}</span>
                  {method.recommended && (
                    <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0">
                      موصى به
                    </Badge>
                  )}
                </div>
                {wallet && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground" dir="ltr">{wallet.number}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyNumber(method.id, wallet.number) }}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {copiedId === method.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                )}
              </div>
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-primary' : 'border-muted-foreground/30'}`}>
                {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Receipt Upload */}
      <div className="space-y-2 mb-6">
        <Label className="text-sm font-semibold text-foreground">رفع إيصال الدفع</Label>
        <div className="relative">
          <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
          <div className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${receiptPreview ? 'border-primary/40' : 'border-muted-foreground/30 hover:border-primary/40'}`}>
            {receiptPreview ? (
              <div className="relative">
                <img src={receiptPreview} alt="إيصال" className="max-h-40 rounded-lg object-contain" />
                <p className="text-xs text-muted-foreground mt-2">{receiptFile?.name}</p>
              </div>
            ) : (
              <>
                <CreditCard className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">اضغط لرفع صورة الإيصال</p>
                <p className="text-xs text-muted-foreground/60">PNG, JPG - حد أقصى 5 ميجا</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2 mb-8">
        <Label className="text-sm font-semibold text-foreground">ملاحظات (اختياري)</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="أي ملاحظات إضافية..." className="text-right" rows={2} />
      </div>

      {/* Submit */}
      <Button onClick={handleSubmit} disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base">
        {loading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
        إرسال إيصال الدفع
      </Button>
    </div>
  )
}
