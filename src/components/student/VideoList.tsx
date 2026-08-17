'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Clock, CheckCircle2, Video, ArrowRight, Maximize2, Minimize2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/store/useStore'
import { toast } from 'sonner'

type VideoItem = {
  id: string
  title: string
  description: string | null
  url: string
  thumbnail: string | null
  duration: number | null
  order: number
  grade: { name: string; displayName: string } | null
}

export default function VideoList() {
  const { student, setCurrentView } = useAppStore()
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const grade = student?.gradeName || ''

  const fetchVideos = useCallback(async () => {
    if (!grade) return
    setLoading(true)
    try {
      const res = await fetch(`/api/content?grade=${encodeURIComponent(grade)}&type=video`)
      if (res.ok) {
        const data = await res.json()
        setVideos(Array.isArray(data) ? data : [])
      } else {
        setVideos([])
      }
    } catch {
      toast.error('تعذر تحميل المحتوى التعليمي')
      setVideos([])
    } finally {
      setLoading(false)
    }
  }, [grade])

  const fetchProgress = useCallback(async () => {
    if (!student?.id) return
    try {
      const res = await fetch(`/api/activity?studentId=${student.id}`)
      if (res.ok) {
        const data = await res.json()
        const map: Record<string, number> = {}
        if (Array.isArray(data)) {
          data.forEach((item: any) => {
            if (item.contentId) map[item.contentId] = item.percentage || 0
          })
        }
        setProgressMap(map)
      }
    } catch { /* ignore */ }
  }, [student?.id])

  useEffect(() => { fetchVideos(); fetchProgress() }, [fetchVideos, fetchProgress])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const getProgress = (id: string) => progressMap[id] ?? 0
  const isCompleted = (id: string) => (progressMap[id] ?? 0) >= 100
  const totalCompleted = videos.filter((v) => isCompleted(v.id)).length
  const overallProgress = videos.length > 0 ? Math.round((totalCompleted / videos.length) * 100) : 0

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return ''
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen()
      try { await videoRef.current?.play() } catch { /* ignore autoplay restrictions */ }
    } else {
      await document.exitFullscreen()
    }
  }

  const openVideo = (video: VideoItem) => {
    setSelectedVideo(video)
    setIsFullscreen(false)
  }

  const closeVideo = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    setSelectedVideo(null)
  }

  if (!selectedVideo) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setCurrentView('student-dashboard')}
            className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold">فيديوهاتي</h1>
            <p className="text-sm text-muted-foreground">{totalCompleted} من {videos.length} فيديو مكتمل</p>
          </div>
        </div>

        {/* Overall Progress */}
        {!loading && videos.length > 0 && (
          <Card className="p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">التقدم الإجمالي</span>
              <Badge variant="secondary" className="text-primary bg-primary/10 border-0 font-semibold">{overallProgress}%</Badge>
            </div>
            <Progress value={overallProgress} className="h-2.5" />
          </Card>
        )}

        {/* Video Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Video className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">لا توجد فيديوهات حالياً</h3>
            <p className="max-w-sm text-sm text-muted-foreground">لم يتم إضافة محتوى تعليمي لهذه المرحلة بعد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => {
              const progress = getProgress(video.id)
              const completed = isCompleted(video.id)
              return (
                <Card
                  key={video.id}
                  className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all"
                  onClick={() => openVideo(video)}
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/5">
                        <Video className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100">
                        <Play className="h-5 w-5 fill-current mr-[-2px]" />
                      </div>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-1.5 py-0.5 text-xs text-white">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDuration(video.duration)}</span>
                      </div>
                    )}
                    {completed && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-emerald-500 text-white border-0 shadow-sm">
                          <CheckCircle2 className="ml-1 h-3 w-3" /> مكتمل
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2 text-sm font-semibold line-clamp-2">{video.title}</h3>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{completed ? 'تم المشاهدة' : 'قيد المشاهدة'}</span>
                      <span className={`font-semibold ${completed ? 'text-emerald-600' : 'text-primary'}`}>{progress}%</span>
                    </div>
                    <Progress value={progress} className={`h-1.5 mt-1.5 ${completed ? '[&>div]:bg-emerald-500' : ''}`} />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Full video player view
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={closeVideo}
          className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold">{selectedVideo.title}</h1>
          <p className="text-sm text-muted-foreground">{selectedVideo.description || 'لا يوجد وصف'}</p>
        </div>
      </div>

      {/* Video Player */}
      <div
        ref={containerRef}
        className={`relative bg-black overflow-hidden rounded-2xl ${isFullscreen ? 'fixed inset-0 z-50 rounded-none flex flex-col' : 'aspect-video'}`}
        style={isFullscreen ? { background: '#000' } : {}}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          controls
          autoPlay
          controlsList="nodownload"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          poster={selectedVideo.thumbnail || undefined}
        >
          <source src={selectedVideo.url} type="video/mp4" />
        </video>

        {/* Center fullscreen toggle - disappears when fullscreen */}
        {!isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute inset-0 flex items-center justify-center z-10 group/fs"
            title="تكبير الشاشة"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm opacity-0 group-hover/fs:opacity-100 transition-opacity duration-300">
              <Maximize2 className="w-8 h-8 text-white" />
            </div>
          </button>
        )}
      </div>

      {/* Video info below */}
      {!isFullscreen && (
        <div className="mt-4 flex items-center gap-3">
          {selectedVideo.duration && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" /> {formatDuration(selectedVideo.duration)}
            </Badge>
          )}
          <Badge variant="secondary" className={isCompleted(selectedVideo.id) ? 'bg-emerald-500/10 text-emerald-600' : 'bg-primary/10 text-primary'}>
            {isCompleted(selectedVideo.id) ? <CheckCircle2 className="ml-1 h-3 w-3" /> : null}
            {isCompleted(selectedVideo.id) ? 'مكتمل' : `${getProgress(selectedVideo.id)}%`}
          </Badge>
        </div>
      )}
    </div>
  )
}
