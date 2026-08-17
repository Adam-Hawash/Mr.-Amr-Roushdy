'use client'

import { Facebook, Youtube, Send } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                ق
              </div>
              <span className="text-lg font-bold text-primary">القائد</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              منصة تعليمية متخصصة في الدراسات الاجتماعية والتاريخ مع الأستاذ عمرو رشدي.
              نساعد الطلاب على التفوق والنجاح بأسلوب مبسط وممتع.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-foreground">روابط سريعة</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">الرئيسية</li>
              <li className="hover:text-primary transition-colors cursor-pointer">الفيديوهات التعليمية</li>
              <li className="hover:text-primary transition-colors cursor-pointer">الاختبارات</li>
              <li className="hover:text-primary transition-colors cursor-pointer">تسجيل الدخول</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-foreground">تواصل معنا</h3>
            <div className="flex gap-3">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
 © 2026 القائد - أ. عمرو رشدي. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  )
}
