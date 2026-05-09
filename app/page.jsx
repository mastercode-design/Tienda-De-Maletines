'use client'
import { useEffect, useState } from 'react'
import { useCart } from './context/CartContext'

export default function Home() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart, cantidadTotal, carrito } = useCart()

  const cargarProductos = () => {
    setLoading(true)
    fetch('/api/productos', { cache: 'no-store' })
     .then(res => res.json())
     .then(data => {
       setProductos(data)
       setLoading(false)
     })
     .catch(() => setLoading(false))
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const enviarWhatsApp = () => {
    const numero = '573053680666'
    if (carrito.length === 0) return alert('Agrega productos primero')
    
    let mensaje = '¡Hola Imperio JG19! 👋 Quiero hacer este pedido:%0A%0A'
    let total = 0
    
    carrito.forEach(item => {
      mensaje += `👜 *${item.nombre}*%0A`
      mensaje += `   Cantidad: ${item.cantidad}%0A`
      mensaje += `   Subtotal: $${(item.precio * item.cantidad).toLocaleString('es-CO')}%0A%0A`
      total += item.precio * item.cantidad
    })
    
    mensaje += `💰 *TOTAL: $${total.toLocaleString('es-CO')}*%0A%0A`
    mensaje += `¿Cómo coordinamos el pago y envío?`
    
    const url = `https://wa.me/${numero}?text=${mensaje}`
    window.open(url, '_blank')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-2xl font-bold text-purple-600 animate-pulse">Cargando...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Imperio JG19
          </h1>
          <div className="flex gap-3 items-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-full font-bold shadow-lg">
              🛒 {cantidadTotal}
            </div>
            {cantidadTotal > 0 && (
              <button
                onClick={enviarWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg transition-all hover:scale-105"
              >
                Pedir por WhatsApp
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-5xl font-black text-center mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
          Nuestros Maletines
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">Diseños exclusivos para ti</p>
        
        {productos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No hay productos aún</p>
            <p className="text-gray-400 mt-2">Créalos en /admin</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productos.map(p => (
              <div key={p.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 group">
                <div className="relative h-72 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                  <img 
                    src={p.imagen} 
                    alt={p.nombre} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
                    <span className="font-bold text-purple-600">Nuevo</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{p.nombre}</h3>
                  <p className="text-gray-600 mb-4 h-12 overflow-hidden">{p.descripcion}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ${p.precio.toLocaleString('es-CO')}
                    </p>
                    <button
                      onClick={() => {
                        addToCart(p)
                        alert('✅ Agregado al carrito')
                      }}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all hover:scale-105"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}