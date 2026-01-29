"use server"

import { supabase } from "@/lib/supabase"

export async function createOrder(
  customerName: string,
  customerPhone: string,
  items: any[],
  totalPrice: number
) {
  try {
    // 🛡 VALIDATION: Protect against malicious data injections
    if (!customerName || customerName.length < 2 || customerName.length > 100) {
      throw new Error("Некорректное имя клиента")
    }
    
    if (!customerPhone || customerPhone.length < 7) {
      throw new Error("Некорректный номер телефона")
    }

    if (!items || items.length === 0) {
      throw new Error("Корзина пуста")
    }

    // 🛡 NEGATIVE QUANTITY CHECK: Stop bypass attempts
    const validatedItems = items.map(item => {
      const sizes = { ...item.sizes }
      Object.keys(sizes).forEach(size => {
        if (sizes[size] <= 0) {
          delete sizes[size]
        }
      })
      if (Object.keys(sizes).length === 0) {
        throw new Error(`Товар ${item.name} имеет нулевое количество`)
      }
      return { ...item, sizes }
    })

    // 1. Save to Database
    const { data, error: dbError } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          total_price: totalPrice,
          items: validatedItems,
          status: 'new'
        },
      ])
      .select()

    if (dbError) throw dbError

    // 2. Prepare Telegram Message
    const itemsList = validatedItems
      .map((item) => {
        const sizes = Object.entries(item.sizes)
          .map(([size, qty]) => `${size}: ${qty}шт`)
          .join(", ")
        return `📦 ${item.name} (${sizes})`
      })
      .join("\n")

    const message = `🚨 *НОВЫЙ ЗАКАЗ!*\n\n👤 *Клиент:* ${customerName}\n📞 *Телефон:* ${customerPhone}\n💰 *Сумма:* ${totalPrice.toFixed(2)} BYN\n\n*🛒 Товары:*
${itemsList}`

    // 3. Send to Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (botToken && chatId) {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown",
          }),
        }
      )

      if (!response.ok) {
        console.error("Telegram API error:", await response.text())
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error creating order:", error)
    return { success: false, error: error.message || "Не удалось оформить заказ" }
  }
}