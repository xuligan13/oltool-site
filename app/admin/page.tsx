"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Loader2, 
  Plus, 
  X, 
  LogIn, 
  Save, 
  UploadCloud, 
  Image as ImageIcon, 
  Package, 
  Flame,
  ChevronRight,
  LogOut,
  Trash2,
  Sparkles,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  BarChart3,
  Search as SearchIcon,
  Eye,
  AlertCircle,
  LayoutDashboard,
  Box,
  Settings
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface Product {
  id: number
  name: string
  description: string
  retail_price: string
  wholesale_price: string
  sizes: string[]
  is_bestseller: boolean
  is_hit: boolean
  is_new: boolean
  category: string
  image_url: string | null
  material: string
  country: string
  product_type: string
  delivery_info: string
  views_count: number
}

interface Order {
  id: number
  total_price: number
  status: string
  items: any[]
}

interface UserLog {
  event_type: string
  session_id: string
  payload: any
}

export default function AdminPage() {
  const pathname = usePathname()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isAuth, setIsAuth] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [userLogs, setUserLogs] = useState<UserLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- STATS CALCULATION ---
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + Number(o.total_price || 0), 0)
  
  const totalOrdersCount = orders.length
  const completedOrdersCount = orders.filter(o => o.status === 'completed').length
  const avgOrderValue = completedOrdersCount > 0 ? totalRevenue / completedOrdersCount : 0
  const totalProductsCount = products.length

  const viewLogs = userLogs.filter(log => log.event_type === "view")
  const getUniqueViews = (pid: number) => {
    const sessions = new Set(viewLogs.filter(l => Number(l.payload?.product_id) === pid).map(l => l.session_id))
    return sessions.size
  }

  const mostPopularProduct = [...products].sort((a, b) => getUniqueViews(b.id) - getUniqueViews(a.id))[0]
  
  const searchQueries = userLogs
    .filter(log => log.event_type === "search")
    .map(log => ({ query: log.payload?.query, session: log.session_id }))
    .filter(l => l.query)
  
  const uniqueSearches = Array.from(new Set(searchQueries.map(s => `${s.query.toLowerCase()}_${s.session}`)))
    .map(s => s.split('_')[0])

  const topSearch = uniqueSearches.length > 0 
    ? Object.entries(uniqueSearches.reduce((acc: any, q) => {
        acc[q] = (acc[q] || 0) + 1
        return acc
      }, {})).sort((a: any, b: any) => b[1] - a[1])[0][0]
    : "Нет данных"

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsAuth(true)
      }
      setInitialLoading(false)
    }
    checkSession()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setFetchError(null)

      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("КРИТИЧЕСКАЯ ОШИБКА: NEXT_PUBLIC_SUPABASE_URL не найден")
      }
      
      const [pRes, oRes] = await Promise.all([
        supabase.from("products").select("*").order("id", { ascending: true }),
        supabase.from("orders").select("*")
      ])

      if (pRes.error) throw pRes.error
      if (oRes.error) throw oRes.error

      setProducts(pRes.data || [])
      setOrders(oRes.data || [])

      try {
        const { data: logsData, error: logsError } = await supabase
          .from("user_logs")
          .select("*")
          .order('created_at', { ascending: false })
          .limit(2000)
        
        if (!logsError) {
          setUserLogs(logsData || [])
        }
      } catch (e) {}

    } catch (error: any) {
      setFetchError(error.message || "Ошибка загрузки данных")
      toast.error("Ошибка базы данных")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuth) {
      fetchData()
    }
  }, [isAuth])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setAuthLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setIsAuth(true)
      toast.success("Доступ разрешен")
    } catch (error: any) {
      toast.error(error.message || "Ошибка авторизации")
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuth(false)
    toast.success("Вы вышли из системы")
  }

  const handleAddNew = () => {
    setSelectedProduct({
      id: 0,
      name: "",
      description: "",
      retail_price: "",
      wholesale_price: "",
      sizes: ["S", "M", "L"],
      is_bestseller: false,
      is_hit: false,
      is_new: true,
      category: "collars",
      image_url: null,
      material: "Полипропилен",
      country: "Беларусь",
      product_type: "Защитный воротник",
      delivery_info: "По всей Беларуси",
      views_count: 0
    })
    setIsDrawerOpen(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct({ ...product })
    setIsDrawerOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)

      if (error) throw error
      toast.success("Товар успешно удален")
      fetchData()
    } catch (error) {
      console.error(error)
      toast.error("Ошибка при удалении")
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedProduct) return

    try {
      setIsUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('PRODUCTS')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('PRODUCTS')
        .getPublicUrl(filePath)

      setSelectedProduct({ ...selectedProduct, image_url: publicUrl })
      toast.success("Фото загружено")
    } catch (error) {
      console.error(error)
      toast.error("Ошибка при загрузке фото")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    if (!selectedProduct || isUploading) return

    try {
      setIsSaving(true)
      
      const productData = {
        name: selectedProduct.name,
        description: selectedProduct.description,
        retail_price: selectedProduct.retail_price,
        wholesale_price: selectedProduct.wholesale_price,
        sizes: selectedProduct.sizes,
        is_bestseller: selectedProduct.is_bestseller,
        is_hit: selectedProduct.is_hit,
        is_new: selectedProduct.is_new,
        category: selectedProduct.category,
        image_url: selectedProduct.image_url,
        material: selectedProduct.material,
        country: selectedProduct.country,
        product_type: selectedProduct.product_type,
        delivery_info: selectedProduct.delivery_info,
      }

      if (selectedProduct.id === 0) {
        const { data, error } = await supabase
          .from("products")
          .insert([productData])
          .select()

        if (error) throw error
        if (data) setProducts(prev => [...prev, data[0]])
        toast.success("Товар успешно создан")
      } else {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", selectedProduct.id)

        if (error) throw error
        toast.success("Товар успешно обновлен")
        setProducts(prev => 
          prev.map(p => p.id === selectedProduct.id ? selectedProduct : p)
        )
      }
      
      setIsDrawerOpen(false)
    } catch (error) {
      console.error(error)
      toast.error("Ошибка при сохранении")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleSize = (size: string) => {
    if (!selectedProduct) return
    const newSizes = selectedProduct.sizes.includes(size)
      ? selectedProduct.sizes.filter(s => s !== size)
      : [...selectedProduct.sizes, size]
    setSelectedProduct({ ...selectedProduct, sizes: newSizes })
  }

  const addSize = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault()
      const newSize = e.currentTarget.value.trim()
      if (selectedProduct && !selectedProduct.sizes.includes(newSize)) {
        setSelectedProduct({
          ...selectedProduct,
          sizes: [...selectedProduct.sizes, newSize]
        })
      }
      e.currentTarget.value = ""
    }
  }

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md shadow-sm border-none overflow-hidden rounded-3xl">
          <div className="h-3 bg-primary w-full" />
          <CardHeader className="space-y-2 text-center pt-10">
            <div className="mx-auto bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-4">
               <Package className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black text-slate-900">ADMIN LOGIN</CardTitle>
            <p className="text-slate-500 font-medium text-lg">Введите данные для входа</p>
          </CardHeader>
          <CardContent className="pb-10 px-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-bold text-slate-700 ml-1">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 text-base md:text-xl border-2 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                  placeholder="admin@oltunol.by"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" title="Пароль" className="text-base font-bold text-slate-700 ml-1">Пароль</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 text-base md:text-xl border-2 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={authLoading}
                className="w-full h-16 text-xl font-black rounded-2xl shadow-sm hover:shadow-md transition-all"
              >
                {authLoading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <LogIn className="mr-3 h-6 w-6" />}
                ВОЙТИ В ПАНЕЛЬ
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 lg:p-12 pb-32 md:pb-24">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
        
        {/* CRITICAL: Error Display */}
        {fetchError && (
          <div className="bg-destructive/10 border-2 border-destructive/20 p-6 rounded-3xl flex items-center gap-4 text-destructive animate-pulse">
            <AlertCircle className="h-8 w-8 shrink-0" />
            <div className="flex-grow min-w-0">
              <h4 className="font-black uppercase tracking-widest text-sm truncate">Ошибка базы данных</h4>
              <p className="font-bold text-base md:text-lg truncate">{fetchError}</p>
            </div>
            <Button onClick={fetchData} variant="outline" size="sm" className="border-destructive/30 hover:bg-destructive hover:text-white transition-all rounded-xl font-black shrink-0">
              ПОВТОРИТЬ
            </Button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-none">DASHBOARD</h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium">Управление бизнесом</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              type="button"
              className="flex-grow md:flex-grow-0 bg-green-600 hover:bg-green-700 h-14 px-6 md:px-8 rounded-2xl font-black text-base md:text-lg shadow-sm hover:shadow-md transition-all"
              onClick={handleAddNew}
            >
              <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" /> ДОБАВИТЬ ТОВАР
            </Button>
            <Button 
              type="button"
              variant="ghost" 
              size="lg" 
              className="text-slate-400 hover:text-destructive font-bold text-base md:text-lg h-14 px-6 rounded-2xl border-2 border-transparent hover:border-destructive/10 transition-all"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" /> Выйти
            </Button>
          </div>
        </div>

        {/* 📊 Analytics Cards - 2x2 on Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="border-none shadow-sm hover:shadow-md rounded-[2rem] overflow-hidden bg-white group transition-all duration-300">
            <CardContent className="p-4 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
              <div className="bg-green-100 text-green-600 p-3 md:p-5 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                <DollarSign className="h-6 w-6 md:h-10 md:w-10" />
              </div>
              <div className="min-w-0">
                <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest truncate">Выручка</p>
                <h3 className="text-xl md:text-3xl font-black text-slate-900 leading-none mt-1 truncate">{totalRevenue.toFixed(0)} <small className="text-[10px] font-bold text-slate-400">BYN</small></h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md rounded-[2rem] overflow-hidden bg-white group transition-all duration-300">
            <CardContent className="p-4 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
              <div className="bg-blue-100 text-blue-600 p-3 md:p-5 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShoppingBag className="h-6 w-6 md:h-10 md:w-10" />
              </div>
              <div className="min-w-0">
                <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest truncate">Заказов</p>
                <h3 className="text-xl md:text-3xl font-black text-slate-900 leading-none mt-1 truncate">{totalOrdersCount}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md rounded-[2rem] overflow-hidden bg-white group transition-all duration-300">
            <CardContent className="p-4 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
              <div className="bg-purple-100 text-purple-600 p-3 md:p-5 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <TrendingUp className="h-6 w-6 md:h-10 md:w-10" />
              </div>
              <div className="min-w-0">
                <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest truncate">Средний</p>
                <h3 className="text-xl md:text-3xl font-black text-slate-900 leading-none mt-1 truncate">{avgOrderValue.toFixed(0)} <small className="text-[10px] font-bold text-slate-400">BYN</small></h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md rounded-[2rem] overflow-hidden bg-white group transition-all duration-300">
            <CardContent className="p-4 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
              <div className="bg-orange-100 text-orange-600 p-3 md:p-5 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Package className="h-6 w-6 md:h-10 md:w-10" />
              </div>
              <div className="min-w-0">
                <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest truncate">Товаров</p>
                <h3 className="text-xl md:text-3xl font-black text-slate-900 leading-none mt-1 truncate">{totalProductsCount}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🕵️‍♂️ Surveillance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Card className="border-none shadow-sm hover:shadow-md rounded-[2rem] overflow-hidden bg-white group transition-all duration-300">
            <CardContent className="p-6 md:p-8 flex items-center gap-4 md:gap-6">
              <div className="bg-slate-100 text-slate-600 p-4 md:p-5 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <SearchIcon className="h-8 w-8 md:h-10 md:w-10" />
              </div>
              <div className="min-w-0">
                <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest">Топ поиска</p>
                <h3 className="text-lg md:text-2xl font-black text-slate-900 leading-tight mt-1 truncate">«{topSearch}»</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md rounded-[2rem] overflow-hidden bg-white group transition-all duration-300">
            <CardContent className="p-6 md:p-8 flex items-center gap-4 md:gap-6">
              <div className="bg-rose-100 text-rose-600 p-4 md:p-5 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Eye className="h-8 w-8 md:h-10 md:w-10" />
              </div>
              <div className="min-w-0">
                <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest">Лидер внимания</p>
                <h3 className="text-lg md:text-2xl font-black text-slate-900 leading-tight mt-1 truncate">
                  {mostPopularProduct?.name || "Нет данных"}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 📈 List Container */}
        <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white transition-all">
          <CardHeader className="p-6 md:p-8 border-b border-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="w-2 h-6 md:h-8 bg-primary rounded-full" />
              СПИСОК ТОВАРОВ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none">
                    <TableHead className="py-6 px-8 font-black text-slate-400 text-sm uppercase tracking-widest">Товар</TableHead>
                    <TableHead className="py-6 px-8 font-black text-slate-400 text-sm uppercase tracking-widest text-center">Просмотры</TableHead>
                    <TableHead className="py-6 px-8 font-black text-slate-400 text-sm uppercase tracking-widest">Опт. цена</TableHead>
                    <TableHead className="py-6 px-8 font-black text-slate-400 text-sm uppercase tracking-widest">Розница</TableHead>
                    <TableHead className="py-6 px-8 font-black text-slate-400 text-sm uppercase tracking-widest text-center">Статус</TableHead>
                    <TableHead className="py-6 px-8 font-black text-slate-400 text-sm uppercase tracking-widest text-right">Действие</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={6} className="h-64 text-center"><Loader2 className="h-12 w-12 animate-spin mx-auto text-primary opacity-20" /></TableCell></TableRow>
                  ) : products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 group">
                      <TableCell className="py-6 px-8">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex-shrink-0 relative overflow-hidden border-2 border-slate-50">
                            {product.image_url ? <Image src={product.image_url} alt={product.name} fill className="object-cover" /> : <ImageIcon className="m-auto h-8 w-8 text-slate-300" />}
                          </div>
                          <span className="font-black text-xl text-slate-800 group-hover:text-primary transition-colors">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-8 text-center">
                        <div className="flex items-center justify-center gap-2"><Eye className="h-4 w-4 text-slate-300" /><span className="font-black text-slate-900">{getUniqueViews(product.id)}</span></div>
                      </TableCell>
                      <TableCell className="py-6 px-8"><span className="font-bold text-xl text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">{product.wholesale_price}</span></TableCell>
                      <TableCell className="py-6 px-8"><span className="font-black text-xl text-slate-900">{product.retail_price}</span></TableCell>
                      <TableCell className="py-6 px-8 text-center">
                        <div className="flex flex-col gap-1 items-center">
                          {(product.is_hit || product.is_bestseller) && <Badge className="bg-orange-500 text-white border-none px-3 py-0.5 text-[10px] font-black rounded-full uppercase">ХИТ</Badge>}
                          {product.is_new && <Badge className="bg-green-500 text-white border-none px-3 py-0.5 text-[10px] font-black rounded-full uppercase">NEW</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-8 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="default" size="lg" className="h-14 px-8 rounded-2xl font-black text-lg shadow-sm" onClick={() => handleEdit(product)}>ИЗМЕНИТЬ</Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button variant="destructive" size="icon" className="h-14 w-14 rounded-2xl shadow-sm"><Trash2 className="h-6 w-6" /></Button></AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl border-none shadow-lg">
                              <AlertDialogHeader><AlertDialogTitle className="text-2xl font-black text-slate-900">Вы уверены?</AlertDialogTitle></AlertDialogHeader>
                              <AlertDialogFooter className="gap-2 pt-4">
                                <AlertDialogCancel className="h-14 rounded-2xl font-bold border-2">Отмена</AlertDialogCancel>
                                <AlertDialogAction className="h-14 rounded-2xl font-black bg-destructive text-white hover:bg-destructive/90" onClick={() => handleDelete(product.id)}>УДАЛИТЬ</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-slate-50">
              {isLoading ? (
                <div className="p-12 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary opacity-20" /></div>
              ) : products.map((product) => (
                <div key={product.id} className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 relative overflow-hidden border-2 border-slate-100 flex-shrink-0">
                      {product.image_url ? <Image src={product.image_url} alt={product.name} fill className="object-cover" /> : <ImageIcon className="m-auto h-6 w-6 text-slate-200" />}
                    </div>
                    <div className="min-w-0 flex-grow">
                      <h4 className="font-black text-slate-900 truncate uppercase tracking-tighter">{product.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-primary font-black text-lg">{product.retail_price} <small className="text-[8px] uppercase">BYN</small></span>
                        <div className="flex items-center gap-1 text-slate-400 font-bold text-xs"><Eye className="h-3 w-3" /> {getUniqueViews(product.id)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-grow h-12 rounded-xl font-bold text-sm" onClick={() => handleEdit(product)}>ИЗМЕНИТЬ</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" className="h-12 w-12 rounded-xl"><Trash2 className="h-5 w-5" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-3xl mx-4">
                        <AlertDialogHeader><AlertDialogTitle>Удалить товар?</AlertDialogTitle></AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="h-12 rounded-xl">Отмена</AlertDialogCancel>
                          <AlertDialogAction className="h-12 rounded-xl bg-destructive" onClick={() => handleDelete(product.id)}>УДАЛИТЬ</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 📱 Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-4 flex justify-between items-center z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <Link href="/admin" className={cn("flex flex-col items-center gap-1 transition-all", pathname === "/admin" ? "text-primary scale-110" : "text-slate-400")}>
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Главная</span>
        </Link>
        <Link href="/admin/orders" className={cn("flex flex-col items-center gap-1 transition-all", pathname === "/admin/orders" ? "text-primary scale-110" : "text-slate-400")}>
          <div className="relative">
            <ShoppingBag className="h-6 w-6" />
            {orders.filter(o => o.status === 'new').length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse border-2 border-white">{orders.filter(o => o.status === 'new').length}</span>
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">Заказы</span>
        </Link>
        <button onClick={handleAddNew} className="flex flex-col items-center gap-1 text-slate-400">
          <Plus className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Добавить</span>
        </button>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-slate-400">
          <LogOut className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Выход</span>
        </button>
      </div>

      {/* Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[96vh] rounded-t-3xl border-none shadow-lg">
          <div className="mx-auto w-full max-w-4xl overflow-y-auto px-6 pb-16">
            <div className="w-20 h-2 bg-slate-200 rounded-full mx-auto mt-6 mb-10" />
            <DrawerHeader className="px-0 py-0 mb-8 md:mb-10 text-left"><DrawerTitle className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">{selectedProduct?.id === 0 ? "Добавление" : "Редактирование"}</DrawerTitle></DrawerHeader>
            {selectedProduct && (
              <div className="space-y-8 md:space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
                   <div className="space-y-3">
                      <Label className="text-sm font-black text-slate-700 uppercase tracking-wider">Фото</Label>
                      <div className="relative aspect-square rounded-3xl bg-slate-100 border-4 border-white shadow-sm overflow-hidden group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        {selectedProduct.image_url ? <Image src={selectedProduct.image_url} alt="Preview" fill className="object-cover" /> : <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400"><ImageIcon className="h-12 w-12 mb-2" /><span className="text-[10px] font-bold">НЕТ ФОТО</span></div>}
                        {isUploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                   </div>
                   <div className="md:col-span-2 space-y-6">
                      <div className="space-y-2"><Label htmlFor="name" className="text-sm font-black text-slate-700 uppercase">Название</Label><Input id="name" value={selectedProduct.name} onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})} className="h-14 text-base font-bold rounded-xl border-2" /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl border-2 bg-orange-50/30 flex items-center justify-between"><Label htmlFor="ishit" className="text-[10px] font-black">ХИТ</Label><Switch id="ishit" checked={selectedProduct.is_hit || selectedProduct.is_bestseller} onCheckedChange={(checked) => setSelectedProduct({...selectedProduct, is_hit: checked, is_bestseller: checked})} /></div>
                        <div className="p-3 rounded-xl border-2 bg-green-50/30 flex items-center justify-between"><Label htmlFor="isnew" className="text-[10px] font-black">NEW</Label><Switch id="isnew" checked={selectedProduct.is_new} onCheckedChange={(checked) => setSelectedProduct({...selectedProduct, is_new: checked})} /></div>
                      </div>
                   </div>
                </div>
                <div className="space-y-2"><Label htmlFor="description" className="text-sm font-black text-slate-700 uppercase">Описание</Label><Textarea id="description" value={selectedProduct.description} onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})} className="min-h-[100px] text-base font-medium rounded-xl border-2 p-4" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="text-xs font-black uppercase">Опт (BYN)</Label><Input value={selectedProduct.wholesale_price} onChange={(e) => setSelectedProduct({...selectedProduct, wholesale_price: e.target.value})} className="h-14 text-base font-black rounded-xl border-2" /></div>
                  <div className="space-y-2"><Label className="text-xs font-black uppercase">Розница (BYN)</Label><Input value={selectedProduct.retail_price} onChange={(e) => setSelectedProduct({...selectedProduct, retail_price: e.target.value})} className="h-14 text-base font-black rounded-xl border-2" /></div>
                </div>
              </div>
            )}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={handleSave} disabled={isSaving || isUploading} className="h-16 text-lg font-black rounded-2xl bg-primary text-white">{isSaving ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Save className="mr-2 h-6 w-6" />}СОХРАНИТЬ</Button>
              <Button type="button" variant="outline" onClick={() => setIsDrawerOpen(false)} className="h-16 text-lg font-bold border-2 rounded-2xl text-slate-400">ОТМЕНА</Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
