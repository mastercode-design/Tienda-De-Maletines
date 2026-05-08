'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [subiendo, setSubiendo] = useState(false)
  const router = useRouter()

  // CARGAR PRODUCTOS - SIN CACHÉ
  const cargarProductos = async () => {
    try {
      const res = await fetch('/api/productos', { 
        cache: 'no-store' // ← IMPORTANTE: Mata el caché
      })
      const data = await res.json()
      setProductos(data || [])
    } catch (error) {
      console.log(error)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  // CREAR PRODUCTO
  const crearProducto = async (e) => {
    e.preventDefault()
    setSubiendo(true)
    
    try {
      const formData = new FormData(e.target)
      const res = await fetch('/api/productos', {
        method: 'POST',
        body: formData
      })
      
      if (res.ok) {
        e.target.reset() // Limpia el form
        router.refresh() // ← Recarga datos del servidor
        await cargarProductos() // ← Y actualiza el state
      }
    } catch (error) {
      console.log(error)
      alert('Error al crear producto')
    }
    
    setSubiendo(false)
  }

  // ELIMINAR PRODUCTO - FIX PRINCIPAL
  const eliminarProducto = async (id, nombre) => {
    if (!confirm(`¿Borrar "${nombre}"?`)) return
    
    try {
      const res = await fetch(`/api/productos/${id}`, { 
        method: 'DELETE' 
      })
      
      if (res.ok) {
        // OPCIÓN 1: Filtra en el state - más rápido
        setProductos(productos.filter(p => p.id !== id))
        
        // OPCIÓN 2: Recarga del servidor - más seguro
        // router.refresh()
        // await cargarProductos()
      }
    } catch (error) {
      console.log(error)
      alert('Error al eliminar')
    }
  }

  if (cargando) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-slate-900 flex items-center justify-center">
      <p className="text-white text-xl">Cargando...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
          Panel Admin - Tienda de Maletines
        </h1>

        {/* FORM PARA CREAR */}
        <form onSubmit={crearProducto} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl mb-10 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Agregar Producto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input 
              name="nombre" 
              placeholder="Nombre del producto" 
              required 
              className="bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400"
            />
            <input 
              name="precio" 
              type="number" 
              placeholder="Precio" 
              required 
              className="bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400"
            />
          </div>
          <input 
            name="imagen" 
            type="file" 
            accept="image/*"
            className="bg-white/10 border border-white/20 rounded-lg p-3 text-white w-full mb-4"
          />
          <button 
            type="submit" 
            disabled={subiendo}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
          >
            {subiendo ? 'Subiendo...' : 'Crear Producto'}
          </button>
        </form>

        {/* LISTA DE PRODUCTOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              {producto.imagen && (
                <img 
                  src={producto.imagen} 
                  alt={producto.nombre}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-bold text-white mb-2">{producto.nombre}</h3>
              <p className="text-2xl font-black text-pink-400 mb-4">${producto.precio}</p>
              <button
                onClick={() => eliminarProducto(producto.id, producto.nombre)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-full"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        {productos.length === 0 && (
          <p className="text-center text-gray-400 text-xl mt-10">No hay productos todavía</p>
        )}
      </div>
    </div>
  )
}