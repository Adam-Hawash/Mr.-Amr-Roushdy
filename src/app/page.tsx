'use client'

import { useAppStore, ViewName } from '@/store/useStore'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AuthModal from '@/components/auth/AuthModal'
import HeroSection from '@/components/home/HeroSection'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import StudyTips from '@/components/home/StudyTips'
import Gallery from '@/components/home/Gallery'
import Testimonials from '@/components/home/Testimonials'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import PendingPage from '@/components/checkout/PendingPage'
import StudentDashboard from '@/components/student/StudentDashboard'
import VideoList from '@/components/student/VideoList'
import ExamList from '@/components/student/ExamList'
import StudentCommunity from '@/components/student/StudentCommunity'
import AdminDashboard from '@/components/admin/AdminDashboard'

function HomeView() {
  return (
    <>
      <HeroSection />
      <WhyChooseUs />
      <StudyTips />
      <Gallery />
      <Testimonials />
    </>
  )
}

const VIEW_MAP: Partial<Record<ViewName, React.ComponentType>> = {
  'student-dashboard': StudentDashboard,
  'student-videos': VideoList,
  'student-exams': ExamList,
  'student-announcements': StudentDashboard,
  'student-community': StudentCommunity,
  'checkout': CheckoutForm,
  'pending': PendingPage,
  'admin': AdminDashboard,
  'admin-students': AdminDashboard,
  'admin-content': AdminDashboard,
  'admin-grades': AdminDashboard,
  'admin-payments': AdminDashboard,
  'admin-exams': AdminDashboard,
  'admin-announcements': AdminDashboard,
  'admin-gallery': AdminDashboard,
  'admin-community': AdminDashboard,
  'admin-testimonials': AdminDashboard,
  'admin-settings': AdminDashboard,
}

export default function Home() {
  const { currentView } = useAppStore()
  const ViewComponent = VIEW_MAP[currentView]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {ViewComponent ? <ViewComponent /> : <HomeView />}
      </main>
      <Footer />
      <AuthModal />
    </div>
  )
}