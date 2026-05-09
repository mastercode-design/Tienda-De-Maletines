'use client'
import { useState, useEffect, useRef } from 'react'

export default function Admin() {
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '' })
  const [archivo, setArchivo] = useState(null)
  const [subiendo, setSubiendo] = useState(false)
  const inputFileRef = useRef(null)

  const cargarProductos = () => {
    fetch('/api/productos', { cache: 'no-store' })
    .then(res => res.json())
    .then(data => setProductos(data))
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const crearProducto = async (e) => {
    e.preventDefault()
    if (!archivo) return alert('Sube una imagen')

    setSubiendo(true)

    const response = await fetch(`/api/upload?filename=${archivo.name}`, {
      method: 'POST',
      body: archivo,
    })
    const blob = await response.json()

    const res = await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...form, imagen: blob.url })
    })

    if (res.ok) {
      setForm({ nombre: '', descripcion: '', precio: '' })
      setArchivo(null)
      inputFileRef.current.value = ''
      cargarProductos()
      alert('✅ Producto creado')
    }
    setSubiendo(false)
  }

  const borrarProducto = async (id) => {
    if (!confirm('¿Seguro que quieres borrarlo?')) return
    const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' })
    if (res.ok) cargarProductos()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Panel Admin - Imperio JG19
        </h1>
        
        <form onSubmit={crearProducto} className="mb-8 bg-white p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Nombre del maletín"
              value={form.nombre}
              onChange={e => setForm({...form, nombre: e.target.value})}
              className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-xl w-full"
              required
            />
            <input
              placeholder="Precio en COP"
              type="number"
              value={form.precio}
              onChange={e => setForm({...form, precio: e.target.value})}
              className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-xl w-full"
              required
            />
          </div>
          <textarea
            placeholder="Descripción"
            value={form.descripcion}
            onChange={e => setForm({...form, descripcion: e.target.value})}
            className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-xl w-full mt-4 h-24"
            required
          />
          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2">Imagen del producto</label>
            <input
              type="file"
              accept="image/*"
              ref={inputFileRef}
              onChange={e => setArchivo(e.target.files[0])}
              className="border-2 border-purple-200 p-3 rounded-xl w-full"
              required
            />
          </div>
          <button
            type="submit"
            disabled={subiendo}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-bold mt-6 w-full hover:scale-105 transition-all disabled:opacity-50"
          >
            {subiendo? 'Subiendo imagen...' : 'Crear Producto'}
          </button>
        </form>

        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Productos Activos: {productos.length}</h2>
          <div className="space-y-4">
            {productos.map(p => (
              <div key={p.id} className="border-2 border-purple-100 p-4 rounded-2xl flex justify-between items-center hover:shadow-lg transition-all">
                <div className="flex items-center gap-4">
                  <img src={p.imagen} alt={p.nombre} className="w-20 h-20 object-cover rounded-xl"/>
                  <div>
                    <p className="font-bold text-lg">{p.nombre}</p>
                    <p className="text-purple-600 font-bold">${Number(p.precio).toLocaleString('es-CO')}</p>
                  </div>
                </div>
                <button
                  onClick={() => borrarProducto(p.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold transition-all"
                >
                  Borrar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}