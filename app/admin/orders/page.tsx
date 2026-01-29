"use client"

import { useState, useEffect, useMemo } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Loader2, 
  CheckCircle2, 
  Phone, 
  User, 
  Calendar, 
  Package,
  ArrowLeft,
  ShoppingBag,
  LayoutDashboard,
  LogOut,
  Archive,
  ClipboardList
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface OrderItem {
  id: number
  name: string
  price: number
  sizes: { [key: string]: number }
}

interface Order {
  id: number
  created_at: string
  customer_name: string
  customer_phone: string
  total_price: number
  status: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const pathname = usePathname()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState("active")

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

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error(error)
      toast.error("Ошибка при загрузке заказов")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuth) {
      fetchOrders()
    }
  }, [isAuth])

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      // Optmistic update for smooth UI
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
      
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", id)

      if (error) throw error
      
      toast.success(newStatus === 'completed' ? "Заказ отправлен в архив" : "Статус обновлен")
    } catch (error) {
      console.error(error)
      toast.error("Не удалось обновить статус")
      // Revert if error
      fetchOrders()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/admin"
  }

  // --- Filtered Data ---
  const activeOrders = useMemo(() => orders.filter(o => o.status !== 'completed'), [orders])
  const archivedOrders = useMemo(() => orders.filter(o => o.status === 'completed'), [orders])
  const displayOrders = currentTab === "active" ? activeOrders : archivedOrders

  // --- Stats (always total) ---
  const totalRevenue = useMemo(() => 
    orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + Number(o.total_price), 0), 
  [orders])

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md shadow-sm border-none rounded-3xl p-8 text-center space-y-6">
          <div className="mx-auto bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Доступ ограничен</h2>
          <p className="text-slate-500 font-medium">Пожалуйста, войдите в панель управления, чтобы просматривать заказы.</p>
          <Button asChild className="w-full h-14 rounded-2xl font-bold">
            <Link href="/admin">ПЕРЕЙТИ К ЛОГИНУ</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 lg:p-12 pb-32 md:pb-24">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Link href="/admin" className="hidden md:inline-flex items-center text-slate-400 hover:text-primary transition-colors font-bold gap-2 text-sm uppercase tracking-widest mb-2">
              <ArrowLeft className="h-4 w-4" /> Назад в админку
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-none">ЖУРНАЛ</h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium">Работа с поступающими заказами</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-[2rem] border-2 border-slate-50 shadow-sm flex items-center gap-4">
              <span className="text-slate-400 font-black uppercase tracking-widest text-[10px] md:text-xs">Выручка (архив):</span>
              <span className="text-green-600 font-black text-xl md:text-3xl">{totalRevenue.toFixed(0)} <small className="text-xs">BYN</small></span>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="active" className="w-full" onValueChange={setCurrentTab}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <TabsList className="bg-slate-100 p-1.5 rounded-2xl md:rounded-[1.5rem] h-auto w-full md:w-auto self-start">
              <TabsTrigger 
                value="active" 
                className="rounded-xl md:rounded-[1.2rem] px-6 md:px-10 py-3 md:py-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-black text-sm md:text-base uppercase tracking-tighter transition-all flex items-center gap-2"
              >
                <ClipboardList className="h-4 w-4 md:h-5 md:w-5" />
                АКТИВНЫЕ
                <Badge className="ml-2 bg-primary text-white border-none text-[10px] h-5 min-w-5 flex items-center justify-center p-0">{activeOrders.length}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="archive" 
                className="rounded-xl md:rounded-[1.2rem] px-6 md:px-10 py-3 md:py-4 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-black text-sm md:text-base uppercase tracking-tighter transition-all flex items-center gap-2"
              >
                <Archive className="h-4 w-4 md:h-5 md:w-5" />
                АРХИВ
                <Badge variant="outline" className="ml-2 text-[10px] h-5 min-w-5 flex items-center justify-center p-0">{archivedOrders.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <div className="hidden md:flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-100">
              <Package className="h-3 w-3" /> Всего в базе: {orders.length}
            </div>
          </div>

          <TabsContent value="active" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {renderOrdersList(activeOrders)}
          </TabsContent>
          <TabsContent value="archive" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {renderOrdersList(archivedOrders)}
          </TabsContent>
        </Tabs>
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
            {activeOrders.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse border-2 border-white">{activeOrders.length}</span>
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">Заказы</span>
        </Link>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-slate-400">
          <LogOut className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Выход</span>
        </button>
      </div>
    </div>
  )

  function renderOrdersList(ordersList: Order[]) {
    if (isLoading) {
      return (
        <Card className="border-none shadow-sm rounded-[2rem] bg-white p-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Синхронизация...</p>
        </Card>
      )
    }

    if (ordersList.length === 0) {
      return (
        <Card className="border-none shadow-sm rounded-[3rem] bg-white p-12 md:p-24 flex flex-col items-center justify-center text-center space-y-6">
          <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center">
            <Package className="h-12 w-12 text-slate-200" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Здесь пока пусто</h3>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">
              {currentTab === 'active' ? "Все заказы обработаны. Можно выпить кофе!" : "Архив пуст. Начните завершать заказы."}
            </p>
          </div>
        </Card>
      )
    }

    return (
      <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none">
                  <TableHead className="py-6 px-8 font-black text-slate-400 text-xs uppercase tracking-widest">ID / Дата</TableHead>
                  <TableHead className="py-6 px-8 font-black text-slate-400 text-xs uppercase tracking-widest">Клиент</TableHead>
                  <TableHead className="py-6 px-8 font-black text-slate-400 text-xs uppercase tracking-widest">Состав заказа</TableHead>
                  <TableHead className="py-6 px-8 font-black text-slate-400 text-xs uppercase tracking-widest text-center">Сумма</TableHead>
                  <TableHead className="py-6 px-8 font-black text-slate-400 text-xs uppercase tracking-widest text-center">Статус</TableHead>
                  <TableHead className="py-6 px-8 font-black text-slate-400 text-xs uppercase tracking-widest text-right">Действие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersList.map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50/80 transition-all duration-500 border-b border-slate-50 group">
                    <TableCell className="py-6 px-8">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900">#{order.id}</span>
                        <span className="text-slate-400 text-[10px] font-bold uppercase mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(order.created_at), "dd MMM, HH:mm", { locale: ru })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-8">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-slate-800 flex items-center gap-2 text-base"><User className="h-4 w-4 text-primary" />{order.customer_name}</span>
                        <a href={`tel:${order.customer_phone}`} className="text-primary font-bold text-sm hover:underline flex items-center gap-2"><Phone className="h-3 w-3" />{order.customer_phone}</a>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-8">
                      <div className="max-w-[400px] space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex flex-col gap-1 p-2 bg-slate-50/50 rounded-xl border border-slate-100">
                            <span className="font-black text-slate-900 text-[12px]">{item.name}</span>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(item.sizes).map(([s, q]) => (
                                <Badge key={s} variant="outline" className="bg-white text-[9px] h-5 px-1.5 rounded-md"><span className="font-black mr-1">{s}:</span> {q}</Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-8 text-center">
                      <span className="font-black text-2xl text-slate-900 tracking-tighter">{order.total_price.toFixed(0)} <small className="text-[10px] text-slate-400 uppercase">BYN</small></span>
                    </TableCell>
                    <TableCell className="py-6 px-8 text-center">
                      <Badge className={cn("border-none px-4 py-1.5 text-[10px] font-black rounded-full uppercase", order.status === 'completed' ? "bg-green-500 text-white" : "bg-orange-100 text-orange-600")}>
                        {order.status === 'completed' ? 'Завершен' : 'Новый'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6 px-8 text-right">
                      {order.status !== 'completed' ? (
                        <Button 
                          onClick={() => handleUpdateStatus(order.id, 'completed')} 
                          className="h-12 px-6 rounded-xl font-black text-xs bg-green-600 hover:bg-green-700 text-white shadow-md hover:scale-105 active:scale-95 transition-all"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" /> ЗАВЕРШИТЬ
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost"
                          onClick={() => handleUpdateStatus(order.id, 'new')} 
                          className="h-12 px-6 rounded-xl font-bold text-xs text-slate-400 hover:text-primary transition-all"
                        >
                          ВЕРНУТЬ В РАБОТУ
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-slate-50">
            {ordersList.map((order) => (
              <div key={order.id} className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-slate-900">#{order.id}</span>
                      <Badge className={cn("border-none px-3 py-1 text-[9px] font-black rounded-full uppercase", order.status === 'completed' ? "bg-green-500 text-white" : "bg-rose-500 text-white")}>
                        {order.status === 'completed' ? 'Архив' : 'Новый'}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{format(new Date(order.created_at), "dd MMMM, HH:mm", { locale: ru })}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-primary tracking-tighter">{order.total_price.toFixed(0)} <small className="text-[10px] uppercase">BYN</small></span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"><User className="h-5 w-5 text-slate-400" /></div>
                    <span className="font-black text-slate-800 text-lg">{order.customer_name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-grow h-12 rounded-xl border-2 border-primary/20 text-primary font-black bg-white">
                      <a href={`tel:${order.customer_phone}`}><Phone className="mr-2 h-4 w-4" /> ПОЗВОНИТЬ</a>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Состав заказа:</p>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                      <span className="font-bold text-slate-700 text-sm">{item.name}</span>
                      <div className="flex gap-1">
                        {Object.entries(item.sizes).map(([s, q]) => (
                          <Badge key={s} variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] font-black px-1.5 h-5">{s}: {q}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {order.status !== 'completed' ? (
                  <Button onClick={() => handleUpdateStatus(order.id, 'completed')} className="w-full h-16 rounded-2xl bg-green-600 text-white font-black text-lg shadow-xl shadow-green-100 transition-all active:scale-[0.98]">
                    <CheckCircle2 className="mr-2 h-6 w-6" /> ЗАВЕРШИТЬ ЗАКАЗ
                  </Button>
                ) : (
                  <Button onClick={() => handleUpdateStatus(order.id, 'new')} variant="outline" className="w-full h-14 rounded-2xl border-2 font-bold text-slate-400">
                    ВЕРНУТЬ В РАБОТУ
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
}