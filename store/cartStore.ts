import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ICartItem } from '@/types';

interface CartState {
  items: ICartItem[];
  addItem: (item: ICartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
        );

        if (existingIndex > -1) {
          const newItems = [...items];
          newItems[existingIndex].quantity += item.quantity;
          set({ items: newItems });
        } else {
          set({ items: [...items, item] });
        }
      },

      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (item) => !(item.productId === productId && item.size === size && item.color === color)
          ),
        });
      },

      updateQuantity: (productId, size, color, quantity) => {
        const items = get().items;
        const index = items.findIndex(
          (i) => i.productId === productId && i.size === size && i.color === color
        );

        if (index > -1) {
          const newItems = [...items];
          newItems[index].quantity = quantity;
          set({ items: newItems });
        }
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);