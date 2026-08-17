'use client'

import { motion } from 'framer-motion'
import { Image as ImageIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function Gallery() {
  return (
    <section className="py-16 sm:py-20 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground">
            معرض الصور والفيديوهات
          </h2>
        </motion.div>

        {/* Placeholder Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card className="border-dashed">
            <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-7 w-7 text-primary" />
              </div>
              <p className="text-lg text-muted-foreground">
                سيتم عرض صور طلابي وفيديوهاتهم قريباً
              </p>
              <p className="text-sm text-muted-foreground/70">
                تابعونا لمعرفة آخر التحديثات
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
