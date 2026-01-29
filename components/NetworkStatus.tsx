"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export function NetworkStatus() {
  useEffect(() => {
    const handleOnline = () => toast.success("Соединение восстановлено")
    const handleOffline = () => toast.error("Отсутствует интернет-соединение", { duration: Infinity })

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return null
}
