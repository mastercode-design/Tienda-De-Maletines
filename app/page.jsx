'use client'
import { useEffect, useState } from 'react'
import { useCart } from './context/CartContext'

export default function Home() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart, cantidadTotal } = useCart()

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

  if (loading) return <div className="p-8 text-center">Cargando productos...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tienda de Maletines</h1>
        <div className="bg-green-600 text-white px-4 py-2 rounded">
          Carrito: {cantidadTotal}
        </div>
      </div>

      {productos.length === 0 ? (
        <p className="text-center">No hay productos. Créalo en /admin</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productos.map(p => (
            <div key={p.id} className="border p-4 rounded shadow">
              <img src={p.imagen} alt={p.nombre} className="w-full h-48 object-cover mb-4" />
              <h2 className="text-xl font-bold">{p.nombre}</h2>
              <p className="text-gray-600 mb-2">{p.descripcion}</p>
              <p className="text-2xl font-bold mb-4">${p.precio}</p>
              <button
                onClick={() => {
                  addToCart(p)
                  alert('Agregado al carrito')
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
              >
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}