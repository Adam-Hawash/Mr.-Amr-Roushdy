'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { useAppStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sun, Moon, Menu, Settings, LogOut, GraduationCap, X } from 'lucide-react'
import { toast } from 'sonner'

export default function Navbar() {
   const { currentView, setCurrentView, student, isLoggedIn, isAdmin, login, logout, setAuthModalOpen, setAuthModalTab } = useAppStore()
  const { theme, setTheme } = useTheme()
  const [adminOpen, setAdminOpen] = useState(false)
  const [adminUser, setAdminUser] = useState('')
  const [adminPass, setAdminPass] = useState('')

  const handleAdminLogin = async () => {
    if (adminUser === 'mr.amr26' && adminPass === 'amr2026#$') {
      login({
        id: 'admin-001', name: 'أ. عمرو رشدي', phone: 'admin',
        parentName: '', parentPhone: '', email: 'admin@alqaid.com',
        gradeName: 'admin', isActive: true, role: 'admin',
      })
      setAdminOpen(false)
      setAdminUser('')
      setAdminPass('')
      toast.success('مرحباً بك يا أستاذ عمرو')
    } else {
      toast.error('بيانات الدخول غير صحيحة')
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('تم تسجيل الخروج')
  }

  const openRegister = () => {
    setAuthModalTab('register')
    setAuthModalOpen(true)
  }

  const openLogin = () => {
    setAuthModalTab('login')
    setAuthModalOpen(true)
  }

  const navLinks = [
    { label: 'الرئيسية', view: 'home' as const },
    ...(isAdmin ? [{ label: 'لوحة التحكم', view: 'admin' as const }] : []),
    ...(isLoggedIn && !isAdmin ? [
      { label: 'لوحتي', view: 'student-dashboard' as const },
      { label: 'المجتمع', view: 'student-community' as const },
    ] : []),
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            ق
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-bold leading-tight text-primary">القائد</p>
            <p className="text-[10px] leading-tight text-muted-foreground">أ. عمرو رشدي</p>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button
              key={link.view}
              variant={currentView === link.view ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView(link.view)}
              className="text-sm"
            >
              {link.label}
            </Button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Admin Settings Icon (always visible, subtle) */}
          {!isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAdminOpen(true)}
              className="rounded-full text-muted-foreground/60 hover:text-primary"
              title="لوحة الإدارة"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}

          {/* Guest: Register / Login */}
          {!isLoggedIn && !isAdmin && (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={openLogin} className="text-sm">
                تسجيل الدخول
              </Button>
              <Button size="sm" onClick={openRegister} className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
                سجل الآن
              </Button>
            </div>
          )}

          {/* Student: User Menu */}
          {isLoggedIn && !isAdmin && (
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium max-w-[100px] truncate">{student?.name?.split(' ')[0]}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Admin logout */}
          {isAdmin && (
            <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full">
              <LogOut className="h-4 w-4" />
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="text-right font-bold text-primary">القائد</SheetTitle>
              <nav className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Button
                    key={link.view}
                    variant={currentView === link.view ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-base"
                    onClick={() => setCurrentView(link.view)}
                  >
                    {link.label}
                  </Button>
                ))}
                {!isLoggedIn && !isAdmin && (
                  <div className="mt-2 border-t pt-2 space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={openLogin}>تسجيل الدخول</Button>
                    <Button className="w-full justify-start bg-primary text-primary-foreground" onClick={openRegister}>سجل الآن</Button>
                  </div>
                )}
                {isLoggedIn && !isAdmin && (
                  <div className="mt-2 border-t pt-2">
                    <p className="px-3 text-sm font-semibold text-primary mb-2">{student?.name}</p>
                    <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                      <LogOut className="ml-2 h-4 w-4" /> تسجيل الخروج
                    </Button>
                  </div>
                )}
                {isAdmin && (
                  <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                    <LogOut className="ml-2 h-4 w-4" /> تسجيل الخروج
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Admin Login Dialog */}
      <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">دخول لوحة الإدارة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="admin-user" className="text-sm font-medium">اسم المستخدم</Label>
              <Input
                id="admin-user"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-pass" className="text-sm font-medium">كلمة المرور</Label>
              <Input
                id="admin-pass"
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="text-right"
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
            <Button onClick={handleAdminLogin} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              دخول
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
