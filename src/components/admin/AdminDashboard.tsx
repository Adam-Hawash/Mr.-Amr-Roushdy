'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAppStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, CreditCard,
  FileQuestion, Megaphone, ImageIcon, UsersRound, Star, Settings,
  Mail, Smartphone, Globe, Link2, Menu, Clock, Plus, Trash2, ImagePlus,
  Lightbulb,
} from 'lucide-react'

const METHOD_LABELS: Record<string,string> = {
  fawry:'فوري', instapay:'إنستاباي', vodafone_cash:'فودافون كاش',
  orange_cash:'أورانج كاش', etisalat_cash:'اتصالات كاش',
}

const PAYMENT_METHODS = ['vodafone_cash','fawry','instapay','orange_cash','etisalat_cash']

const NAV_ITEMS = [
  {id:'admin',label:'الرئيسية',icon:LayoutDashboard},
  {id:'admin-students',label:'إدارة الطلاب',icon:Users},
  {id:'admin-content',label:'المحتوى التعليمي',icon:BookOpen},
  {id:'admin-grades',label:'الصفوف الدراسية',icon:GraduationCap},
  {id:'admin-payments',label:'المدفوعات',icon:CreditCard},
  {id:'admin-exams',label:'الاختبارات',icon:FileQuestion},
  {id:'admin-announcements',label:'الإعلانات',icon:Megaphone},
  {id:'admin-gallery',label:'معرض الوسائط',icon:ImageIcon},
  {id:'admin-community',label:'المجتمع',icon:UsersRound},
  {id:'admin-testimonials',label:'آراء الطلاب',icon:Star},
  {id:'admin-tips',label:'النصائح',icon:Lightbulb},
  {id:'admin-settings',label:'الإعدادات',icon:Settings},
] as const

function ImageUploader({ label, settingKey, currentUrl, onSaved }: { label: string; settingKey: string; currentUrl: string; onSaved?: (url: string) => void }) {
  const [url, setUrl] = useState(currentUrl || '')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!url.trim()) {
      // Allow clearing the image
      setSaving(true)
      try {
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: settingKey, value: '' }),
        })
        toast.success('تم إزالة الصورة')
        onSaved?.('')
      } catch { toast.error('فشل') }
      finally { setSaving(false) }
      return
    }
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: settingKey, value: url.trim() }),
      })
      toast.success('تم حفظ الرابط')
      onSaved?.(url.trim())
    } catch { toast.error('فشل') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          dir="ltr"
          className="flex-1"
        />
        <Button size="sm" disabled={saving || url === currentUrl} onClick={save}>
          {saving ? '...' : 'حفظ'}
        </Button>
      </div>
      {currentUrl && (
        <div className="flex items-center gap-3 mt-2">
          <img src={currentUrl} alt={label} className="h-16 w-16 rounded-lg object-cover border" />
          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => { setUrl(''); save() }}>
            إزالة
          </Button>
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const {currentView, setCurrentView} = useAppStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-64 border-l bg-card transform transition-transform duration-200 lg:sticky lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 overflow-y-auto scrollbar-thin`}>
        <div className="p-4">
          <h2 className="text-lg font-bold text-primary mb-4">لوحة التحكم</h2>
          <nav className="space-y-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon
              const active = currentView === item.id
              return (
                <button key={item.id} onClick={() => {setCurrentView(item.id as any); setSidebarOpen(false)}} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  <Icon className="h-4 w-4" />{item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-4 lg:p-6 min-w-0">
        <button className="lg:hidden mb-4 p-2 rounded-lg bg-muted" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-5 w-5" />
        </button>
        <AdminContent />
      </main>
    </div>
  )
}

function AdminContent() {
  const {currentView} = useAppStore()
  switch(currentView) {
    case 'admin': return <AdminHome />
    case 'admin-students': return <StudentsSection />
    case 'admin-content': return <ContentSection />
    case 'admin-grades': return <GradesSection />
    case 'admin-payments': return <PaymentsSection />
    case 'admin-exams': return <ExamsSection />
    case 'admin-announcements': return <AnnouncementsSection />
    case 'admin-gallery': return <GallerySection />
    case 'admin-community': return <CommunitySection />
    case 'admin-testimonials': return <TestimonialsSection />
    case 'admin-tips': return <TipsSection />
    case 'admin-settings': return <SettingsSection />
    default: return <AdminHome />
  }
}

/* ========== ADMIN HOME ========== */
function AdminHome() {
  const [stats,setStats] = useState({students:0,pending:0,content:0,approved:0})
  useEffect(() => {
    Promise.all([
      fetch('/api/students').then(r=>r.json()),
      fetch('/api/payments?status=pending').then(r=>r.json()),
      fetch('/api/content').then(r=>r.json()),
      fetch('/api/payments?status=approved').then(r=>r.json()),
    ]).then(([s,p,c,a]) => setStats({
      students: Array.isArray(s)?s.length:0,
      pending: Array.isArray(p)?p.length:0,
      content: Array.isArray(c)?c.length:0,
      approved: Array.isArray(a)?a.length:0,
    })).catch(()=>{})
  },[])

  const cards = [
    {label:'إجمالي الطلاب',value:stats.students,icon:Users},
    {label:'مدفوعات معلقة',value:stats.pending,icon:Clock},
    {label:'المحتوى التعليمي',value:stats.content,icon:BookOpen},
    {label:'مدفوعات مكتملة',value:stats.approved,icon:CreditCard},
  ]

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">مرحباً بك يا أستاذ عمرو</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => {
          const Icon = c.icon
          return (
            <Card key={c.label}><CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-primary"><Icon className="h-5 w-5"/></div>
              <div><p className="text-2xl font-bold">{c.value}</p><p className="text-xs text-muted-foreground">{c.label}</p></div>
            </CardContent></Card>
          )
        })}
      </div>
    </div>
  )
}

/* ========== STUDENTS ========== */
function StudentsSection() {
  const [students,setStudents] = useState<any[]>([])
  const [search,setSearch] = useState('')
  const [loading,setLoading] = useState(true)

  const refresh = () => {
    fetch('/api/students').then(r=>r.json()).then(d=>{setStudents(Array.isArray(d)?d:[])}).catch(()=>{setStudents([])}).finally(()=>{setLoading(false)})
  }
  useEffect(()=>{refresh()},[])

  const toggleActive = async(id:string, current:boolean) => {
    await fetch('/api/students',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,isActive:!current})})
    toast.success('تم التحديث'); refresh()
  }

  const filtered = students.filter(s => !search || s.name.includes(search) || s.phone.includes(search))

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">إدارة الطلاب</h1>
      <Input placeholder="بحث بالاسم أو الهاتف..." value={search} onChange={e=>setSearch(e.target.value)} className="mb-4 max-w-sm" />
      <Card><CardContent className="p-0">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/50"><th className="p-3 text-right font-medium">الاسم</th><th className="p-3 text-right font-medium">الهاتف</th><th className="p-3 text-right font-medium">ولي الأمر</th><th className="p-3 text-right font-medium">الصف</th><th className="p-3 text-right font-medium">الحالة</th><th className="p-3 text-right font-medium">إجراء</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">جاري التحميل...</td></tr> :
            filtered.length === 0 ? <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">لا يوجد طلاب</td></tr> :
            filtered.map(s => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3" dir="ltr">{s.phone}</td>
                <td className="p-3">{s.parentName}</td>
                <td className="p-3">{s.gradeName}</td>
                <td className="p-3"><Badge variant={s.isActive?'default':'secondary'}>{s.isActive?'مفعل':'معلق'}</Badge></td>
                <td className="p-3"><Button size="sm" variant={s.isActive?'destructive':'default'} onClick={()=>toggleActive(s.id,s.isActive)}>{s.isActive?'تعطيل':'تفعيل'}</Button></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </CardContent></Card>
    </div>
  )
}

/* ========== CONTENT ========== */
function ContentSection() {
  const [items,setItems] = useState<any[]>([])
  const [grades,setGrades] = useState<any[]>([])
  const [open,setOpen] = useState(false)
  const [form,setForm] = useState({title:'',description:'',type:'video',url:'',thumbnail:'',gradeId:'',duration:'',order:'0'})
  const [editId,setEditId] = useState<string|null>(null)
  const load = () => { fetch('/api/content').then(r=>r.json()).then(d=>setItems(Array.isArray(d)?d:[])); fetch('/api/grades').then(r=>r.json()).then(d=>setGrades(Array.isArray(d)?d:[])) }
  useEffect(load,[])

  const save = async () => {
    const body = {...form, duration: form.duration ? parseInt(form.duration) : null, order: parseInt(form.order)}
    if (editId) { await fetch('/api/content',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:editId,...body})}) }
    else { await fetch('/api/content',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}) }
    toast.success('تم الحفظ'); setOpen(false); setEditId(null); load()
  }
  const remove = async(id:string) => { await fetch('/api/content',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); toast.success('تم الحذف'); load() }

  return (
    <div>
      <div className="flex items-center justify-between mb-4"><h1 className="text-xl font-bold">المحتوى التعليمي</h1><Button onClick={()=>{setForm({title:'',description:'',type:'video',url:'',thumbnail:'',gradeId:'',duration:'',order:'0'});setEditId(null);setOpen(true)}}>إضافة محتوى</Button></div>
      <Card><CardContent className="p-0">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/50"><th className="p-3 text-right">العنوان</th><th className="p-3 text-right">النوع</th><th className="p-3 text-right">الصف</th><th className="p-3 text-right">الترتيب</th><th className="p-3 text-right">إجراء</th></tr></thead>
          <tbody>
            {items.length===0?<tr><td colSpan={5} className="p-6 text-center text-muted-foreground">لا يوجد محتوى</td></tr>:
            items.map(c=>(
              <tr key={c.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{c.title}</td>
                <td className="p-3"><Badge variant="secondary">{c.type}</Badge></td>
                <td className="p-3">{grades.find(g=>g.id===c.gradeId)?.displayName||c.gradeId}</td>
                <td className="p-3">{c.order}</td>
                <td className="p-3 flex gap-1">
                  <Button size="sm" variant="outline" onClick={()=>{setForm({title:c.title,description:c.description||'',type:c.type,url:c.url,thumbnail:c.thumbnail||'',gradeId:c.gradeId,duration:c.duration?.toString()||'',order:c.order.toString()});setEditId(c.id);setOpen(true)}}>تعديل</Button>
                  <Button size="sm" variant="destructive" onClick={()=>remove(c.id)}>حذف</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </CardContent></Card>
      <Dialog open={open} onOpenChange={setOpen}><DialogContent dir="rtl"><DialogHeader><DialogTitle>{editId?'تعديل المحتوى':'إضافة محتوى'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>العنوان</Label><Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
          <div><Label>الوصف</Label><Textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>النوع</Label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="video">فيديو</option><option value="pdf">PDF</option><option value="image">صورة</option></select></div>
            <div><Label>الصف</Label><select value={form.gradeId} onChange={e=>setForm({...form,gradeId:e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">اختر...</option>{grades.map(g=><option key={g.id} value={g.id}>{g.displayName}</option>)}</select></div>
          </div>
          <div><Label>رابط المحتوى</Label><Input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} dir="ltr" /></div>
          <div><Label>رابط الصورة المصغرة</Label><Input value={form.thumbnail} onChange={e=>setForm({...form,thumbnail:e.target.value})} dir="ltr" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>المدة (ثواني)</Label><Input type="number" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} /></div>
            <div><Label>الترتيب</Label><Input type="number" value={form.order} onChange={e=>setForm({...form,order:e.target.value})} /></div>
          </div>
          <Button onClick={save} className="w-full">حفظ</Button>
        </div>
      </DialogContent></Dialog>
    </div>
  )
}

/* ========== GRADES ========== */
function GradesSection() {
  const [grades,setGrades] = useState<any[]>([])
  const [open,setOpen] = useState(false)
  const [form,setForm] = useState({name:'',displayName:''})
  const [editId,setEditId] = useState<string|null>(null)
  const load = () => { fetch('/api/grades').then(r=>r.json()).then(d=>setGrades(Array.isArray(d)?d:[])) }
  useEffect(load,[])
  const save = async () => {
    if (editId) { await fetch('/api/grades',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:editId,...form})}) }
    else { await fetch('/api/grades',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}) }
    toast.success('تم الحفظ'); setOpen(false); setEditId(null); load()
  }
  const remove = async(id:string) => { await fetch('/api/grades',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); toast.success('تم الحذف'); load() }

  return (
    <div>
      <div className="flex items-center justify-between mb-4"><h1 className="text-xl font-bold">الصفوف الدراسية</h1><Button onClick={()=>{setForm({name:'',displayName:''});setEditId(null);setOpen(true)}}>إضافة صف</Button></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {grades.map(g=>(
          <Card key={g.id}><CardContent className="p-4 flex items-center justify-between">
            <div><p className="font-bold">{g.displayName}</p><p className="text-xs text-muted-foreground">{g.name}</p></div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={()=>{setForm({name:g.name,displayName:g.displayName});setEditId(g.id);setOpen(true)}}>تعديل</Button>
              <Button size="sm" variant="destructive" onClick={()=>remove(g.id)}>حذف</Button>
            </div>
          </CardContent></Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}><DialogContent dir="rtl"><DialogHeader><DialogTitle>{editId?'تعديل الصف':'إضافة صف'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>اسم الصف (إنجليزي)</Label><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="grade-1" dir="ltr" /></div>
          <div><Label>اسم العرض (عربي)</Label><Input value={form.displayName} onChange={e=>setForm({...form,displayName:e.target.value})} placeholder="الصف الأول الثانوي" /></div>
          <Button onClick={save} className="w-full">حفظ</Button>
        </div>
      </DialogContent></Dialog>
    </div>
  )
}

/* ========== PAYMENTS ========== */
function PaymentsSection() {
  const [payments,setPayments] = useState<any[]>([])
  const [filter,setFilter] = useState('all')
  const load = () => { const q = filter==='all'?'':`?status=${filter}`; fetch(`/api/payments${q}`).then(r=>r.json()).then(d=>setPayments(Array.isArray(d)?d:[])) }
  useEffect(load,[filter])
  const updateStatus = async(id:string,status:string) => {
    await fetch('/api/payments',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})})
    toast.success(`تم ${status==='approved'?'الموافقة':'الرفض'}`); load()
  }
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">المدفوعات</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all','pending','approved','rejected'].map(s=>(
          <Button key={s} size="sm" variant={filter===s?'default':'outline'} onClick={()=>setFilter(s)}>
            {s==='all'?'الكل':s==='pending'?'معلق':s==='approved'?'مقبول':'مرفوض'}
          </Button>
        ))}
      </div>
      <Card><CardContent className="p-0">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/50"><th className="p-3 text-right">الطالب</th><th className="p-3 text-right">المبلغ</th><th className="p-3 text-right">الطريقة</th><th className="p-3 text-right">الحالة</th><th className="p-3 text-right">الإيصال</th><th className="p-3 text-right">إجراء</th></tr></thead>
          <tbody>
            {payments.length===0?<tr><td colSpan={6} className="p-6 text-center text-muted-foreground">لا يوجد مدفوعات</td></tr>:
            payments.map(p=>(
              <tr key={p.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{p.student?.name||'—'}</td>
                <td className="p-3">{p.amount} جنيه</td>
                <td className="p-3">{METHOD_LABELS[p.method]||p.method}</td>
                <td className="p-3"><Badge variant={p.status==='approved'?'default':p.status==='rejected'?'destructive':'secondary'}>{p.status==='approved'?'مقبول':p.status==='rejected'?'مرفوض':'معلق'}</Badge></td>
                <td className="p-3">{p.receiptUrl?<a href={p.receiptUrl} target="_blank" className="text-primary underline">عرض</a>:'—'}</td>
                <td className="p-3 flex gap-1">{p.status==='pending'&&<><Button size="sm" onClick={()=>updateStatus(p.id,'approved')}>قبول</Button><Button size="sm" variant="destructive" onClick={()=>updateStatus(p.id,'rejected')}>رفض</Button></>}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </CardContent></Card>
    </div>
  )
}

/* ========== EXAMS ========== */
function ExamsSection() {
  const [exams,setExams] = useState<any[]>([])
  const [grades,setGrades] = useState<any[]>([])
  const [open,setOpen] = useState(false)
  const [form,setForm] = useState({title:'',description:'',type:'homework',gradeId:'',dueDate:'',fileUrl:''})
  const [editId,setEditId] = useState<string|null>(null)
  const load = () => { fetch('/api/exams').then(r=>r.json()).then(d=>setExams(Array.isArray(d)?d:[])); fetch('/api/grades').then(r=>r.json()).then(d=>setGrades(Array.isArray(d)?d:[])) }
  useEffect(load,[])
  const save = async () => {
    const body = {...form, dueDate: form.dueDate||null}
    if (editId) { await fetch('/api/exams',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:editId,...body})}) }
    else { await fetch('/api/exams',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}) }
    toast.success('تم الحفظ'); setOpen(false); setEditId(null); load()
  }
  const remove = async(id:string) => { await fetch('/api/exams',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); toast.success('تم الحذف'); load() }
  return (
    <div>
      <div className="flex items-center justify-between mb-4"><h1 className="text-xl font-bold">الاختبارات والواجبات</h1><Button onClick={()=>{setForm({title:'',description:'',type:'homework',gradeId:'',dueDate:'',fileUrl:''});setEditId(null);setOpen(true)}}>إضافة</Button></div>
      <Card><CardContent className="p-0">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/50"><th className="p-3 text-right">العنوان</th><th className="p-3 text-right">النوع</th><th className="p-3 text-right">الصف</th><th className="p-3 text-right">تاريخ التسليم</th><th className="p-3 text-right">إجراء</th></tr></thead>
          <tbody>
            {exams.length===0?<tr><td colSpan={5} className="p-6 text-center text-muted-foreground">لا يوجد اختبارات</td></tr>:
            exams.map(e=>(
              <tr key={e.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{e.title}</td>
                <td className="p-3"><Badge variant="secondary">{e.type==='exam'?'اختبار':'واجب'}</Badge></td>
                <td className="p-3">{grades.find(g=>g.id===e.gradeId)?.displayName||e.gradeId}</td>
                <td className="p-3">{e.dueDate?new Date(e.dueDate).toLocaleDateString('ar-EG'):'—'}</td>
                <td className="p-3 flex gap-1">
                  <Button size="sm" variant="outline" onClick={()=>{setForm({title:e.title,description:e.description||'',type:e.type,gradeId:e.gradeId,dueDate:e.dueDate?.split('T')[0]||'',fileUrl:e.fileUrl||''});setEditId(e.id);setOpen(true)}}>تعديل</Button>
                  <Button size="sm" variant="destructive" onClick={()=>remove(e.id)}>حذف</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </CardContent></Card>
      <Dialog open={open} onOpenChange={setOpen}><DialogContent dir="rtl"><DialogHeader><DialogTitle>{editId?'تعديل':'إضافة اختبار/واجب'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>العنوان</Label><Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
          <div><Label>الوصف</Label><Textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>النوع</Label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="homework">واجب</option><option value="exam">اختبار</option></select></div>
            <div><Label>الصف</Label><select value={form.gradeId} onChange={e=>setForm({...form,gradeId:e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">اختر...</option>{grades.map(g=><option key={g.id} value={g.id}>{g.displayName}</option>)}</select></div>
          </div>
          <div><Label>تاريخ التسليم</Label><Input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} /></div>
          <div><Label>رابط الملف</Label><Input value={form.fileUrl} onChange={e=>setForm({...form,fileUrl:e.target.value})} dir="ltr" /></div>
          <Button onClick={save} className="w-full">حفظ</Button>
        </div>
      </DialogContent></Dialog>
    </div>
  )
}

/* ========== ANNOUNCEMENTS ========== */
function AnnouncementsSection() {
  const [items,setItems] = useState<any[]>([])
  const [open,setOpen] = useState(false)
  const [form,setForm] = useState({title:'',content:'',type:'general',gradeId:''})
  const [editId,setEditId] = useState<string|null>(null)
  const [grades,setGrades] = useState<any[]>([])
  const load = () => { fetch('/api/announcements').then(r=>r.json()).then(d=>setItems(Array.isArray(d)?d:[])); fetch('/api/grades').then(r=>r.json()).then(d=>setGrades(Array.isArray(d)?d:[])) }
  useEffect(load,[])
  const save = async () => {
    const body = {...form, gradeId: form.type==='grade_specific'?form.gradeId:null}
    if (editId) { await fetch('/api/announcements',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:editId,...body})}) }
    else { await fetch('/api/announcements',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}) }
    toast.success('تم الحفظ'); setOpen(false); setEditId(null); load()
  }
  const remove = async(id:string) => { await fetch('/api/announcements',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); toast.success('تم الحذف'); load() }
  return (
    <div>
      <div className="flex items-center justify-between mb-4"><h1 className="text-xl font-bold">الإعلانات</h1><Button onClick={()=>{setForm({title:'',content:'',type:'general',gradeId:''});setEditId(null);setOpen(true)}}>إضافة إعلان</Button></div>
      <div className="space-y-3">
        {items.length===0?<Card><CardContent className="p-6 text-center text-muted-foreground">لا يوجد إعلانات</CardContent></Card>:
        items.map(a=>(
          <Card key={a.id}><CardContent className="p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1"><span className="font-bold">{a.title}</span><Badge variant={a.type==='urgent'?'destructive':'secondary'}>{a.type==='urgent'?'عاجل':a.type==='grade_specific'?'لصف معين':'عام'}</Badge></div>
              <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button size="sm" variant="outline" onClick={()=>{setForm({title:a.title,content:a.content,type:a.type,gradeId:a.gradeId||''});setEditId(a.id);setOpen(true)}}>تعديل</Button>
              <Button size="sm" variant="destructive" onClick={()=>remove(a.id)}>حذف</Button>
            </div>
          </CardContent></Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}><DialogContent dir="rtl"><DialogHeader><DialogTitle>{editId?'تعديل الإعلان':'إضافة إعلان'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>العنوان</Label><Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
          <div><Label>المحتوى</Label><Textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} rows={3} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>النوع</Label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="general">عام</option><option value="urgent">عاجل</option><option value="grade_specific">لصف معين</option></select></div>
            {form.type==='grade_specific'&&<div><Label>الصف</Label><select value={form.gradeId} onChange={e=>setForm({...form,gradeId:e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">اختر...</option>{grades.map(g=><option key={g.id} value={g.id}>{g.displayName}</option>)}</select></div>}
          </div>
          <Button onClick={save} className="w-full">حفظ</Button>
        </div>
      </DialogContent></Dialog>
    </div>
  )
}

/* ========== GALLERY ========== */
function GallerySection() {
  const [items,setItems] = useState<any[]>([])
  const [open,setOpen] = useState(false)
  const [form,setForm] = useState({title:'',type:'image',url:'',thumbnail:'',order:'0'})
  const load = () => { fetch('/api/gallery').then(r=>r.json()).then(d=>setItems(Array.isArray(d)?d:[])) }
  useEffect(load,[])
  const save = async () => {
    await fetch('/api/gallery',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,order:parseInt(form.order)})})
    toast.success('تم الحفظ'); setOpen(false); load()
  }
  const remove = async(id:string) => { await fetch('/api/gallery',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); toast.success('تم الحذف'); load() }
  return (
    <div>
      <div className="flex items-center justify-between mb-4"><h1 className="text-xl font-bold">معرض الوسائط</h1><Button onClick={()=>{setForm({title:'',type:'image',url:'',thumbnail:'',order:'0'});setOpen(true)}}>إضافة عنصر</Button></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map(i=>(
          <Card key={i.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {i.thumbnail?<img src={i.thumbnail} alt={i.title||''} className="h-full w-full object-cover"/>:<div className="h-full w-full flex items-center justify-center text-muted-foreground">{i.type==='video'?'▶':'🖼'}</div>}
              <Badge className="absolute top-2 left-2">{i.type==='video'?'فيديو':'صورة'}</Badge>
            </div>
            <CardContent className="p-3 flex items-center justify-between">
              <span className="text-sm font-medium truncate max-w-[120px]">{i.title||'—'}</span>
              <Button size="sm" variant="destructive" onClick={()=>remove(i.id)}>حذف</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}><DialogContent dir="rtl"><DialogHeader><DialogTitle>إضافة عنصر للمعرض</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>العنوان</Label><Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
          <div><Label>النوع</Label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="image">صورة</option><option value="video">فيديو</option></select></div>
          <div><Label>الرابط</Label><Input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} dir="ltr" /></div>
          <div><Label>الصورة المصغرة</Label><Input value={form.thumbnail} onChange={e=>setForm({...form,thumbnail:e.target.value})} dir="ltr" /></div>
          <div><Label>الترتيب</Label><Input type="number" value={form.order} onChange={e=>setForm({...form,order:e.target.value})} /></div>
          <Button onClick={save} className="w-full">حفظ</Button>
        </div>
      </DialogContent></Dialog>
    </div>
  )
}

/* ========== COMMUNITY ========== */
function CommunitySection() {
  const [posts,setPosts] = useState<any[]>([])
  const load = () => { fetch('/api/community').then(r=>r.json()).then(d=>setPosts(Array.isArray(d)?d:[])) }
  useEffect(load,[])
  const remove = async(id:string) => { await fetch('/api/community',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); toast.success('تم الحذف'); load() }
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">إدارة المجتمع</h1>
      <div className="space-y-3">
        {posts.length===0?<Card><CardContent className="p-6 text-center text-muted-foreground">لا يوجد منشورات</CardContent></Card>:
        posts.map(p=>(
          <Card key={p.id}><CardContent className="p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1"><span className="font-bold text-sm">{p.authorName}</span>{p.authorGrade&&<Badge variant="secondary" className="text-xs">{p.authorGrade}</Badge>}</div>
              <p className="text-sm text-muted-foreground">{p.content}</p>
            </div>
            <Button size="sm" variant="destructive" onClick={()=>remove(p.id)}>حذف</Button>
          </CardContent></Card>
        ))}
      </div>
    </div>
  )
}

/* ========== TESTIMONIALS ========== */
function TestimonialsSection() {
  const [items,setItems] = useState<any[]>([])
  const [open,setOpen] = useState(false)
  const [form,setForm] = useState({studentName:'',grade:'',content:'',rating:'5'})
  const load = () => { fetch('/api/testimonials').then(r=>r.json()).then(d=>setItems(Array.isArray(d)?d:[])) }
  useEffect(load,[])
  const save = async () => {
    await fetch('/api/testimonials',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,rating:parseInt(form.rating)})})
    toast.success('تم الحفظ'); setOpen(false); load()
  }
  const remove = async(id:string) => { await fetch('/api/testimonials',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); toast.success('تم الحذف'); load() }
  return (
    <div>
      <div className="flex items-center justify-between mb-4"><h1 className="text-xl font-bold">آراء الطلاب</h1><Button onClick={()=>{setForm({studentName:'',grade:'',content:'',rating:'5'});setOpen(true)}}>إضافة رأي</Button></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(t=>(
          <Card key={t.id}><CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2"><span className="font-bold text-sm">{t.studentName}</span><Badge variant="secondary" className="text-xs">{t.grade}</Badge></div>
            <p className="text-sm text-muted-foreground mb-2">{t.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex">{Array.from({length:5}).map((_,i)=><Star key={i} className={`h-4 w-4 ${i<t.rating?'text-primary fill-primary':'text-muted-foreground/30'}`}/>)}</div>
              <Button size="sm" variant="destructive" onClick={()=>remove(t.id)}>حذف</Button>
            </div>
          </CardContent></Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}><DialogContent dir="rtl"><DialogHeader><DialogTitle>إضافة رأي طالب</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>اسم الطالب</Label><Input value={form.studentName} onChange={e=>setForm({...form,studentName:e.target.value})} /></div>
          <div><Label>الصف</Label><Input value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})} /></div>
          <div><Label>الرأي</Label><Textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} rows={3} /></div>
          <div><Label>التقييم (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={e=>setForm({...form,rating:e.target.value})} /></div>
          <Button onClick={save} className="w-full">حفظ</Button>
        </div>
      </DialogContent></Dialog>
    </div>
  )
}

/* ========== SETTINGS ========== */
function SettingsSection() {
  const [settings, setSettings] = useState<Record<string,string>>({
    send_api_url:'', send_api_key:'', from_email:'', to_email:'', send_enabled:'false',
    site_name:'القائد', site_description:'منصة القائد التعليمية',
    hero_image:'/hero/hero-banner.png', teacher_image:'', logo_url:'/hero/hero-3.png',
    facebook_url:'', youtube_url:'', telegram_url:'',
    wallet_numbers: JSON.stringify(PAYMENT_METHODS.map(m=>({method:m,number:''}))),
    site_sections: JSON.stringify(['hero','why_choose_us','study_tips','gallery','testimonials']),
  })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then(r=>r.json()).then(d => {
      if (d && typeof d === 'object' && !Array.isArray(d)) {
        const s:Record<string,string> = {}
        for (const [k,v] of Object.entries(d)) { if (typeof v === 'string') s[k] = v }
        if (Object.keys(s).length > 0) setSettings(prev => ({...prev,...s}))
      }
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }, [])

  const parsedWallets = useMemo(() => {
    if (!loaded) return []
    try { return JSON.parse(settings.wallet_numbers || '[]') } catch { return [] }
  }, [settings.wallet_numbers, loaded])
  const [wallets, setWallets] = useState<any[]>([])
  useEffect(() => { setWallets(parsedWallets) }, [parsedWallets])

  const parsedSections = useMemo(() => {
    try { return JSON.parse(settings.site_sections || '[]') } catch { return ['hero','why_choose_us','study_tips','gallery','testimonials'] }
  }, [settings.site_sections])
  const [sections, setSections] = useState<string[]>([])
  useEffect(() => { setSections(parsedSections) }, [parsedSections])

  const updateSetting = async(key:string, value:string) => {
    setSettings(prev=>({...prev,[key]:value}))
    await fetch('/api/settings',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({key,value})})
  }

  const saveWallets = async(newWallets:any[]) => {
    const val = JSON.stringify(newWallets)
    setWallets(newWallets)
    await updateSetting('wallet_numbers', val)
    toast.success('تم حفظ أرقام المحافظ')
  }

  const updateWallet = (idx:number, field:string, value:string) => {
    const nw = [...wallets]; nw[idx] = {...nw[idx], [field]: value}; setWallets(nw)
  }

  const addSection = () => {
    const name = prompt('اسم القسم الجديد (إنجليزي):')
    if (name) {
      const updated = [...sections, name]
      setSections(updated)
      updateSetting('site_sections', JSON.stringify(updated))
      toast.success('تم إضافة القسم')
    }
  }

  const removeSection = (idx: number) => {
    const updated = sections.filter((_, i) => i !== idx)
    setSections(updated)
    updateSetting('site_sections', JSON.stringify(updated))
    toast.success('تم حذف القسم')
  }

  const testEmail = async() => {
    try {
      const res = await fetch('/api/settings/test-email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        apiUrl: settings.send_api_url, apiKey: settings.send_api_key,
        fromEmail: settings.from_email, toEmail: settings.to_email,
        subject: 'اختبار من منصة القائد', body: 'هذا رسالة اختبار من منصة القائد التعليمية',
      })})
      const d = await res.json()
      toast.success(d.message || 'تم إرسال رسالة الاختبار')
    } catch { toast.error('فشل إرسال رسالة الاختبار') }
  }

  const SECTION_LABELS: Record<string, string> = {
    hero: 'البطل (Hero)',
    why_choose_us: 'لماذا تختارنا',
    study_tips: 'نصائح الدراسة',
    gallery: 'معرض الصور',
    testimonials: 'آراء الطلاب',
    video_player: 'مشغل الفيديو',
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">الإعدادات والروابط</h1>

      {/* Site Images */}
      <Card className="mb-6"><CardHeader><CardTitle className="flex items-center gap-2"><ImagePlus className="h-5 w-5 text-primary" /> صور الموقع</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <ImageUploader label="صورة البانر الرئيسي (Hero)" settingKey="hero_image" currentUrl={settings.hero_image} onSaved={(url) => setSettings(p=>({...p, hero_image: url}))} />
          <ImageUploader label="صورة الأستاذ (البروفايل)" settingKey="teacher_image" currentUrl={settings.teacher_image} onSaved={(url) => setSettings(p=>({...p, teacher_image: url}))} />
          <ImageUploader label="شعار الموقع" settingKey="logo_url" currentUrl={settings.logo_url} onSaved={(url) => setSettings(p=>({...p, logo_url: url}))} />
        </CardContent>
      </Card>

      {/* Section Management */}
      <Card className="mb-6"><CardHeader><CardTitle className="flex items-center gap-2"><LayoutDashboard className="h-5 w-5 text-primary" /> إدارة أقسام الصفحة الرئيسية</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">أضف أو احذف أقسام الصفحة الرئيسية. الترتيب يحدد ظهور الأقسام.</p>
          <div className="space-y-2">
            {sections.map((sec, idx) => (
              <div key={`${sec}-${idx}`} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium bg-muted px-2 py-0.5 rounded">{idx + 1}</span>
                  <span className="text-sm font-medium">{SECTION_LABELS[sec] || sec}</span>
                </div>
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => removeSection(idx)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4" onClick={addSection}><Plus className="h-4 w-4 ml-1" /> إضافة قسم جديد</Button>
        </CardContent>
      </Card>

      {/* Send API Email */}
      <Card className="mb-6"><CardHeader><CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /> إعدادات البريد الإلكتروني (Send API)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between"><Label>تفعيل الإشعارات</Label><Switch checked={settings.send_enabled==='true'} onCheckedChange={v=>updateSetting('send_enabled',v?'true':'false')} /></div>
          <div><Label>رابط API</Label><Input value={settings.send_api_url} onChange={e=>updateSetting('send_api_url',e.target.value)} placeholder="https://api.sendgrid.com/..." dir="ltr" className="mt-1" /></div>
          <div><Label>مفتاح API</Label><Input type="password" value={settings.send_api_key} onChange={e=>updateSetting('send_api_key',e.target.value)} placeholder="SG.xxxxx" dir="ltr" className="mt-1" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>من (البريد)</Label><Input value={settings.from_email} onChange={e=>updateSetting('from_email',e.target.value)} placeholder="noreply@alqaid.com" dir="ltr" className="mt-1" /></div>
            <div><Label>إلى (بريد أ. عمرو)</Label><Input value={settings.to_email} onChange={e=>updateSetting('to_email',e.target.value)} placeholder="mr.amr@example.com" dir="ltr" className="mt-1" /></div>
          </div>
          <Button variant="outline" onClick={testEmail}>إرسال رسالة اختبار</Button>
        </CardContent>
      </Card>

      {/* Wallet Numbers */}
      <Card className="mb-6"><CardHeader><CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5 text-primary" /> أرقام المحافظ الإلكترونية</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {wallets.map((w,i) => (
            <div key={w.method} className="flex items-center gap-3">
              <span className="text-sm font-medium w-32 shrink-0">{METHOD_LABELS[w.method]||w.method}</span>
              <Input value={w.number} onChange={e=>updateWallet(i,'number',e.target.value)} placeholder="رقم المحفظة" dir="ltr" className="flex-1" />
            </div>
          ))}
          <Button onClick={()=>saveWallets(wallets)}>حفظ الأرقام</Button>
        </CardContent>
      </Card>

      {/* Site Content */}
      <Card className="mb-6"><CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> محتوى الموقع</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>اسم الموقع</Label><Input value={settings.site_name} onChange={e=>updateSetting('site_name',e.target.value)} className="mt-1" /></div>
          <div><Label>وصف الموقع</Label><Textarea value={settings.site_description} onChange={e=>updateSetting('site_description',e.target.value)} className="mt-1" rows={2} /></div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Link2 className="h-5 w-5 text-primary" /> روابط التواصل الاجتماعي</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>فيسبوك</Label><Input value={settings.facebook_url} onChange={e=>updateSetting('facebook_url',e.target.value)} placeholder="https://facebook.com/..." dir="ltr" className="mt-1" /></div>
          <div><Label>يوتيوب</Label><Input value={settings.youtube_url} onChange={e=>updateSetting('youtube_url',e.target.value)} placeholder="https://youtube.com/..." dir="ltr" className="mt-1" /></div>
          <div><Label>تيليجرام</Label><Input value={settings.telegram_url} onChange={e=>updateSetting('telegram_url',e.target.value)} placeholder="https://t.me/..." dir="ltr" className="mt-1" /></div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ========== TIPS ========== */
function TipsSection() {
  const [tips, setTips] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', imageUrl: '', order: '0' })
  const [editId, setEditId] = useState<string | null>(null)

  const load = () => {
    fetch('/api/tips')
      .then((r) => r.json())
      .then((d) => setTips(Array.isArray(d) ? d : []))
  }
  useEffect(load, [])

  const save = async () => {
    const body = { ...form, order: parseInt(form.order) }
    if (editId) {
      await fetch('/api/tips', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, ...body }),
      })
    } else {
      await fetch('/api/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }
    toast.success('تم الحفظ'); setOpen(false); setEditId(null); load()
  }

  const remove = async (id: string) => {
    await fetch('/api/tips', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    toast.success('تم الحذف'); load()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await fetch('/api/tips', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !current }),
    })
    toast.success('تم التحديث'); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">إدارة النصائح</h1>
        <Button onClick={() => {
          setForm({ title: '', description: '', imageUrl: '', order: '0' })
          setEditId(null); setOpen(true)
        }}>
          <Plus className="h-4 w-4 ml-1" /> إضافة نصيحة
        </Button>
      </div>

      {tips.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">
          لا يوجد نصائح بعد. أضف أول نصيحة!
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => (
            <Card key={tip.id} className={!tip.isActive ? 'opacity-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  {tip.imageUrl ? (
                    <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border bg-muted">
                      <img src={tip.imageUrl} alt={tip.title} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded">ترتيب: {tip.order}</span>
                      {!tip.isActive && <Badge variant="secondary" className="text-xs">معطّل</Badge>}
                    </div>
                    <p className="font-bold text-sm truncate">{tip.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{tip.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 pt-3 border-t">
                  <Button size="sm" variant="outline" onClick={() => {
                    setForm({
                      title: tip.title,
                      description: tip.description,
                      imageUrl: tip.imageUrl || '',
                      order: tip.order.toString(),
                    })
                    setEditId(tip.id); setOpen(true)
                  }}>تعديل</Button>
                  <Button size="sm" variant="outline" onClick={() => toggleActive(tip.id, tip.isActive)}>
                    {tip.isActive ? 'تعطيل' : 'تفعيل'}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(tip.id)}>حذف</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>{editId ? 'تعديل النصيحة' : 'إضافة نصيحة'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>العنوان</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مثال: خطط لوقتك" />
            </div>
            <div>
              <Label>الوصف</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="اكتب النصيحة هنا..." rows={3} />
            </div>
            <div>
              <Label>رابط الصورة (اختياري)</Label>
              <Input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" dir="ltr" />
              {form.imageUrl && (
                <div className="mt-2">
                  <img src={form.imageUrl} alt="معاينة" className="h-20 w-20 rounded-lg object-cover border" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
            </div>
            <div>
              <Label>الترتيب</Label>
              <Input type="number" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} />
            </div>
            <Button onClick={save} className="w-full">حفظ</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
