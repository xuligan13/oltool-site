import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  name: string
  price: number
  image_url: string | null
  sizes: { [size: string]: number }
}

interface CartState {
  items: CartItem[]
  addItem: (product: any, selectedSizes: { [size: string]: number }) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, size: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, selectedSizes) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex((item) => item.id === product.id)
          
          if (existingItemIndex > -1) {
            const newItems = [...state.items]
            const existingItem = newItems[existingItemIndex]
            
            // Merge sizes
            const updatedSizes = { ...existingItem.sizes }
            Object.entries(selectedSizes).forEach(([size, qty]) => {
              updatedSizes[size] = (updatedSizes[size] || 0) + qty
            })
            
            newItems[existingItemIndex] = { ...existingItem, sizes: updatedSizes }
            return { items: newItems }
          }
          
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                price: parseFloat(product.retail_price),
                image_url: product.image_url,
                sizes: selectedSizes,
              },
            ],
          }
        })
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }))
      },
      
      updateQuantity: (productId, size, quantity) => {
        set((state) => {
          const newItems = state.items.map((item) => {
            if (item.id === productId) {
              const updatedSizes = { ...item.sizes }
              if (quantity <= 0) {
                delete updatedSizes[size]
              } else {
                updatedSizes[size] = quantity
              }
              
              // If no sizes left, this logic will keep the item with empty sizes.
              // Usually we might want to remove the item if all sizes are 0.
              return { ...item, sizes: updatedSizes }
            }
            return item
          }).filter(item => Object.keys(item.sizes).length > 0)
          
          return { items: newItems }
        })
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          return total + Object.values(item.sizes).reduce((sum, qty) => sum + qty, 0)
        }, 0)
      },
      
      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          const itemQty = Object.values(item.sizes).reduce((sum, qty) => sum + qty, 0)
          return total + item.price * itemQty
        }, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
