'use client'
import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([])

  const addToCart = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id)
      if (existe) {
        return prev.map(p => 
          p.id === producto.id ? {...p, cantidad: p.cantidad + 1} : p
        )
      }
      return [...prev, {...producto, cantidad: 1}]
    })
  }

  const cantidadTotal = carrito.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <CartContext.Provider value={{ carrito, addToCart, cantidadTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)