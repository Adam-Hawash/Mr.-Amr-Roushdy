'use client'

import { create } from 'zustand'

export type ViewName =
  | 'home'
  | 'student-dashboard'
  | 'student-videos'
  | 'student-exams'
  | 'student-announcements'
  | 'student-community'
  | 'checkout'
  | 'pending'
  | 'admin'
  | 'admin-students'
  | 'admin-content'
  | 'admin-grades'
  | 'admin-payments'
  | 'admin-exams'
  | 'admin-announcements'
  | 'admin-gallery'
  | 'admin-community'
  | 'admin-testimonials'
  | 'admin-tips'
  | 'admin-settings'

export interface StudentData {
  id: string
  name: string
  phone: string
  parentName: string
  parentPhone: string
  email: string | null
  gradeName: string
  isActive: boolean
  role: string
}

interface AppState {
  currentView: ViewName
  setCurrentView: (view: ViewName) => void

  student: StudentData | null
  isLoggedIn: boolean
  isAdmin: boolean
  login: (student: StudentData) => void
  logout: () => void

  authModalOpen: boolean
  setAuthModalOpen: (open: boolean) => void
  authModalTab: 'login' | 'register'
  setAuthModalTab: (tab: 'login' | 'register') => void

  pendingPaymentId: string | null
  setPendingPaymentId: (id: string | null) => void

  selectedGrade: string | null
  setSelectedGrade: (grade: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'home',
  setCurrentView: (view) => set({ currentView: view }),

  student: null,
  isLoggedIn: false,
  isAdmin: false,
  login: (student) =>
    set({
      student,
      isLoggedIn: true,
      isAdmin: student.role === 'admin',
      authModalOpen: false,
      currentView: student.role === 'admin' ? 'admin' : 'student-dashboard',
    }),
  logout: () =>
    set({
      student: null,
      isLoggedIn: false,
      isAdmin: false,
      currentView: 'home',
    }),

  authModalOpen: false,
  setAuthModalOpen: (open) => set({ authModalOpen: open }),
  authModalTab: 'register',
  setAuthModalTab: (tab) => set({ authModalTab: tab }),

  pendingPaymentId: null,
  setPendingPaymentId: (id) => set({ pendingPaymentId: id }),

  selectedGrade: null,
  setSelectedGrade: (grade) => set({ selectedGrade: grade }),
}))
