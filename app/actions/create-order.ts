"use server"

import { supabase } from "@/lib/supabase"

export async function createOrder(
  customerName: string,
  customerPhone: string,
  items: any[],
  totalPrice: number
) {
  try {
    // 1. Save to Database
    const { data, error: dbError } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: customerName,
          customer_phone: customerPhone,
          total_price: totalPrice,
          items: items,
        },
      ])
      .select()

    if (dbError) throw dbError

    // 2. Prepare Telegram Message
    const itemsList = items
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
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, error: "Не удалось оформить заказ" }
  }
}
