'use client'

import { useAppStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Timer } from 'lucide-react'

export default function PendingPage() {
  const { setCurrentView } = useAppStore()

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
        >
          <Timer className="h-10 w-10 text-primary" />
        </motion.div>

        <h1 className="text-2xl font-bold text-primary mb-3">
          انتظر موافقة الأدمن مستر عمرو
        </h1>
        <p className="text-muted-foreground mb-2 leading-relaxed">
          تم استلام إيصال الدفع الخاص بك وسيتم مراجعته قريباً
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          سيتم إشعارك فور الموافقة على اشتراكك
        </p>

        <Button
          onClick={() => setCurrentView('home')}
          variant="outline"
          className="font-semibold"
        >
          العودة للرئيسية
        </Button>
      </motion.div>
    </div>
  )
}
