"use client"

import { useState, useEffect } from "react"
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
import { 
  Loader2, 
  CheckCircle2, 
  Phone, 
  User, 
  Calendar, 
  Package,
  ArrowLeft,
  ShoppingBag
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"

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
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

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
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", id)

      if (error) throw error
      
      toast.success("Статус заказа обновлен")
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
    } catch (error) {
      console.error(error)
      toast.error("Не удалось обновить статус")
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
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Link href="/admin" className="inline-flex items-center text-slate-400 hover:text-primary transition-colors font-bold gap-2 text-sm uppercase tracking-widest mb-2">
              <ArrowLeft className="h-4 w-4" /> Назад в админку
            </Link>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900">ЗАКАЗЫ</h1>
            <p className="text-slate-500 text-xl font-medium">Управление поступившими заявками</p>
          </div>
          <div className="bg-white px-8 py-4 rounded-[2rem] border-2 border-slate-50 shadow-sm inline-flex items-center gap-4">
            <span className="text-slate-400 font-black uppercase tracking-widest text-xs">Всего заказов:</span>
            <span className="text-primary font-black text-3xl">{orders.length}</span>
          </div>
        </div>

        {/* Orders Table */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full" />
              ЖУРНАЛ ЗАКАЗОВ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary opacity-20" />
                        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest">Загружаем заказы...</p>
                      </TableCell>
                    </TableRow>
                  ) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Package className="h-10 w-10 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-black text-xl uppercase tracking-tighter">Заказов пока нет, ждем Фимозова</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 group">
                        <TableCell className="py-6 px-8">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900">#{order.id}</span>
                            <span className="text-slate-400 text-[10px] font-bold uppercase mt-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(order.created_at), "dd MMM yyyy, HH:mm", { locale: ru })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-8">
                          <div className="flex flex-col gap-1">
                            <span className="font-black text-slate-800 flex items-center gap-2 text-base">
                              <User className="h-4 w-4 text-primary" />
                              {order.customer_name}
                            </span>
                            <a href={`tel:${order.customer_phone}`} className="text-primary font-bold text-sm hover:underline flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              {order.customer_phone}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-8">
                          <div className="max-w-[400px] space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex flex-col gap-1.5 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <span className="font-black text-slate-900 text-sm leading-tight">{item.name}</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {Object.entries(item.sizes).map(([s, q]) => (
                                    <Badge key={s} variant="outline" className="bg-white border-slate-200 text-slate-600 font-bold text-[10px] py-0 h-6 px-2 rounded-lg">
                                      <span className="text-slate-900 font-black mr-1">{s}:</span> {q} шт
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-8 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-black text-2xl text-slate-900 tracking-tighter">
                              {order.total_price.toFixed(2)}
                            </span>
                            <span className="text-slate-400 font-black text-[10px] uppercase">BYN</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-8 text-center">
                          <Badge className={cn(
                            "border-none px-4 py-1.5 text-[10px] font-black rounded-full uppercase shadow-sm",
                            order.status === 'completed' 
                              ? "bg-green-500 text-white" 
                              : "bg-orange-100 text-orange-600"
                          )}>
                            {order.status === 'completed' ? 'Завершен' : 'Новый'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-6 px-8 text-right">
                          {order.status !== 'completed' && (
                            <Button 
                              onClick={() => handleUpdateStatus(order.id, 'completed')}
                              className="h-12 px-6 rounded-2xl font-black text-sm bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-green-200 transition-all hover:scale-105"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              ЗАВЕРШИТЬ
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}