'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // Cargar carrito de localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) setCart(JSON.parse(saved))
  }, [])

  // Guardar carrito
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) {
        return prev.map(p =>
          p.id === product.id? {...p, cantidad: p.cantidad + 1 } : p
        )
      }
      return [...prev, {...product, cantidad: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id!== id))
  }

  const total = cart.reduce((sum, p) => sum + (p.precio * p.cantidad), 0)
  const cantidadTotal = cart.reduce((sum, p) => sum + p.cantidad, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, total, cantidadTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)