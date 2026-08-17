'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Testimonial {
  id?: number
  studentName: string
  grade: string
  content: string
  rating: number
}

const defaultTestimonials: Testimonial[] = [
  {
    studentName: 'أحمد محمود',
    grade: 'الصف الثالث الثانوي',
    content:
      'منصة القائد غيّرت طريقة دراستي للتاريخ تماماً. الشرح مبسط والفيديوهات واضحة جداً. حصلت على 48 من 50 في آخر امتحان!',
    rating: 5,
  },
  {
    studentName: 'فاطمة علي',
    grade: 'الصف الثاني الثانوي',
    content:
      'أحب أسلوب أ. عمرو في الشرح. يجعل التاريخ ممتعاً ومشوقاً. المنصة سهلة الاستخدام والمحتوى منظم بشكل رائع.',
    rating: 5,
  },
  {
    studentName: 'محمد إبراهيم',
    grade: 'الصف الأول الثانوي',
    content:
      'كنت كره مادة الدراسات الاجتماعية لكن بعد ما اشتركت في المنصة بقيت أحبها. الاختبارات والمراجعات ساعدتني كثيراً.',
    rating: 4,
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
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? 'text-primary fill-primary'
              : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch('/api/testimonials')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setTestimonials(data)
          } else {
            setTestimonials(defaultTestimonials)
          }
        } else {
          setTestimonials(defaultTestimonials)
        }
      } catch {
        setTestimonials(defaultTestimonials)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  return (
    <section className="py-16 sm:py-20 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h2 className="text-2xl font-bold text-foreground">
            آراء الطلاب في المنصة
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center text-muted-foreground mb-10 sm:mb-14 max-w-lg mx-auto"
        >
          تعرف على تجارب طلابنا مع منصة القائد
        </motion.p>

        {/* Testimonials Grid */}
        {!loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={testimonial.id ?? index} variants={cardVariants}>
                <Card className="h-full relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Quote Decoration */}
                  <span className="absolute top-3 left-4 text-4xl leading-none text-primary/20 select-none">
                    ❝
                  </span>

                  <CardContent className="p-5 sm:p-6 flex flex-col gap-3 relative">
                    {/* Star Rating */}
                    <StarRating rating={testimonial.rating} />

                    {/* Content */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {testimonial.content}
                    </p>

                    {/* Author */}
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="font-bold text-foreground text-sm">
                        {testimonial.studentName}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-primary bg-primary/10 border-primary/20 text-[10px] sm:text-xs shrink-0"
                      >
                        {testimonial.grade}
                      </Badge>
                    </div>
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
