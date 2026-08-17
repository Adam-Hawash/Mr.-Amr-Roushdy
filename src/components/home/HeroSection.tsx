'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useStore'

export default function HeroSection() {
  const setAuthModalOpen = useAppStore((s) => s.setAuthModalOpen)
  const setAuthModalTab = useAppStore((s) => s.setAuthModalTab)
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d && typeof d === 'object' && !Array.isArray(d)) {
        setSettings(d)
      }
    }).catch(() => {})
  }, [])

  const heroImage = settings.hero_image || '/hero/hero-banner.png'
  const teacherImage = settings.teacher_image || ''

  return (
    <section className="relative w-full overflow-hidden" dir="rtl">
      {/* Background Banner Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${heroImage}')` }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 sm:py-28 lg:py-36">
        <div className={`flex flex-col ${teacherImage ? 'lg:flex-row' : ''} items-center ${teacherImage ? 'gap-10 lg:gap-14' : ''}`}>
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={`flex-1 text-center ${teacherImage ? 'lg:text-right' : ''}`}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
              منصة القائد التعليمية
            </h1>

            <p className="mt-4 text-lg sm:text-xl text-white/90">
              مع أستاذ عمرو رشدي - الدراسات الاجتماعية والتاريخ
            </p>

            <p className="mt-6 text-base text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
              نقدم لك محتوى تعليمي متميز في الدراسات الاجتماعية والتاريخ بأسلوب مبسط
              وممتع يساعدك على التفوق والنجاح.
            </p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Button
                onClick={() => { setAuthModalTab('register'); setAuthModalOpen(true) }}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-5 rounded-xl text-base cursor-pointer shadow-lg"
              >
                سجل الآن
              </Button>

              <Button
                onClick={() => { setAuthModalTab('login'); setAuthModalOpen(true) }}
                variant="outline"
                size="lg"
                className="px-8 py-5 rounded-xl text-base cursor-pointer bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white"
              >
                تسجيل الدخول
              </Button>
            </motion.div>
          </motion.div>

          {/* Teacher image - only shown if URL exists in settings */}
          {teacherImage && (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="flex-shrink-0"
            >
              <img
                src={teacherImage}
                alt="أ. عمرو رشدي"
                className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>
          )}
        </div>

        {/* Intro Video */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
          className="mt-14 flex flex-col items-center"
        >
          <div className="relative w-[200px] max-w-[200px] aspect-[9/16] rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
            <img src="/hero/hero-1.png" alt="فيديو تعريفي" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/90 text-primary-foreground hover:bg-primary transition-colors">
                <Play className="size-6 fill-current mr-[-2px]" />
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70 text-center max-w-xs">
            شاهد فيديو تعريفي عن المنصة مع أ. عمرو رشدي
          </p>
        </motion.div>
      </div>
    </section>
  )
}
