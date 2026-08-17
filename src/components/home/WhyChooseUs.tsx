'use client'

import { motion } from 'framer-motion'
import {
  BookOpen,
  PlayCircle,
  ClipboardCheck,
  FileQuestion,
  Users,
  Headphones,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type Feature = {
  icon: React.ReactNode
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: <BookOpen className="size-6" />,
    title: 'شرح مبسط وممتع',
    description: 'نعتمد على أسلوب القصة والسرد لجعل التاريخ حياً وممتعاً',
  },
  {
    icon: <PlayCircle className="size-6" />,
    title: 'فيديوهات عالية الجودة',
    description: 'محتوى مرئي مسجل بأعلى جودة لتوضيح كل درس',
  },
  {
    icon: <ClipboardCheck className="size-6" />,
    title: 'متابعة مستمرة',
    description: 'تتبع تقدمك في المشاهدة والاختبارات بشكل دوري',
  },
  {
    icon: <FileQuestion className="size-6" />,
    title: 'اختبارات تفاعلية',
    description: 'اختبارات وواجبات دورية لقياس مستوى الفهم',
  },
  {
    icon: <Users className="size-6" />,
    title: 'مجتمع تعليمي',
    description: 'تواصل مع زملائك وتشاركوا المعرفة والخبرات',
  },
  {
    icon: <Headphones className="size-6" />,
    title: 'دعم مباشر',
    description: 'تواصل مباشر مع أ. عمرو للاستفسار والمساعدة',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function WhyChooseUs() {
  return (
    <section className="py-16 px-4 bg-background" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground">
            لماذا تختار منصة القائد؟
          </h2>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <Card className="h-full py-6 px-5 border-border shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default">
                <CardContent className="p-0 flex flex-col items-center text-center gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                    {feature.icon}
                  </div>

                  <h3 className="text-base font-bold text-foreground">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
