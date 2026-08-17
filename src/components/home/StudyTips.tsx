'use client'

import { motion } from 'framer-motion'
import { Lightbulb, ImageOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'

type Tip = {
  id: string
  title: string
  description: string
  imageUrl: string | null
  order: number
}

const DEFAULT_TIPS: Tip[] = [
  {
    id: 'default-1',
    title: 'خطط لوقتك',
    description: 'قسّم وقت الدراسة على المواد المختلفة وحدد أوقاتاً ثابتة لكل مادة. الالتزام بالجدول هو سر النجاح.',
    imageUrl: null,
    order: 0,
  },
  {
    id: 'default-2',
    title: 'المراجعة المستمرة',
    description: 'لا تنتظر الامتحان لتبدأ المراجعة. راجع دروسك يومياً حتى لو لمدة 15 دقيقة فقط.',
    imageUrl: null,
    order: 1,
  },
  {
    id: 'default-3',
    title: 'اكتب ملاحظاتك',
    description: 'دوّن أهم النقاط أثناء الشرح. الملاحظات بخط يدك تساعد في التذكر بشكل أسرع.',
    imageUrl: null,
    order: 2,
  },
  {
    id: 'default-4',
    title: 'اسأل دائماً',
    description: 'لا تتردد في السؤال عن أي نقطة غير واضحة. الفهم الجيد أساس الحفظ الجيد.',
    imageUrl: null,
    order: 3,
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function StudyTips() {
  const [tips, setTips] = useState<Tip[]>(DEFAULT_TIPS)
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/tips')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTips(data)
        }
      })
      .catch(() => {})
  }, [])

  const handleImgError = (id: string) => {
    setImgErrors((prev) => new Set(prev).add(id))
  }

  return (
    <section className="py-8 px-4 pb-16 bg-background" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Decorative divider */}
        <div className="flex items-center justify-center my-8">
          <span className="w-16 border-t border-border" />
          <span className="mx-3 h-3 w-3 rotate-45 bg-primary rounded-sm" />
          <span className="w-16 border-t border-border" />
        </div>

        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-3"
        >
          <h2 className="text-2xl font-bold text-foreground">نصائح للدراسة</h2>
        </motion.div>

        {/* Section description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center text-muted-foreground mb-10 max-w-lg mx-auto"
        >
          نصائح ذهبية من أ. عمرو رشدي لمساعدتك في التحصيل والتفوق
        </motion.p>

        {/* Tip cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {tips.map((tip) => (
            <motion.div key={tip.id} variants={cardVariants}>
              <Card className="h-full border-t-4 border-t-primary border-border py-6 px-5 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    {/* Image or icon */}
                    {tip.imageUrl && !imgErrors.has(tip.id) ? (
                      <div className="flex-shrink-0 h-20 w-20 rounded-xl overflow-hidden border bg-muted">
                        <img
                          src={tip.imageUrl}
                          alt={tip.title}
                          className="h-full w-full object-cover"
                          onError={() => handleImgError(tip.id)}
                        />
                      </div>
                    ) : tip.imageUrl && imgErrors.has(tip.id) ? (
                      <div className="flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-xl border bg-muted text-muted-foreground">
                        <ImageOff className="size-5" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-full bg-primary/10 text-primary">
                        <Lightbulb className="size-6" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-foreground mb-2">
                        {tip.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
