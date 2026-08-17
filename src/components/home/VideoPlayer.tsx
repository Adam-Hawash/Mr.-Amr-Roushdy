'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function VideoPlayer() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            تعرّف على <span className="text-primary">المنصة</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative mx-auto w-full max-w-[280px] sm:max-w-[300px] md:max-w-[320px] rounded-2xl overflow-hidden shadow-2xl shadow-black/20 group cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div
            className="relative w-full bg-muted"
            style={{ aspectRatio: '9 / 16', maxHeight: '500px' }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/hero/hero-1.png')" }}
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center justify-center size-16 sm:size-20 rounded-full bg-primary/90 text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Play className="size-7 sm:size-8 mr-[-3px]" fill="currentColor" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed"
        >
          شاهد فيديو تعريفي قصير عن منصة القائد مع أ. عمرو رشدي
        </motion.p>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="relative bg-card rounded-2xl overflow-hidden shadow-2xl w-full max-w-[380px]"
              style={{ aspectRatio: '9 / 16', maxHeight: '80vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/hero/hero-1.png')" }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="size-16 mx-auto mb-3 text-primary" fill="rgba(184,134,11,0.8)" />
                  <p className="text-sm text-white/80">سيتم إضافة الفيديو قريباً</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 left-3 z-10 text-white bg-black/40 hover:bg-black/60 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}