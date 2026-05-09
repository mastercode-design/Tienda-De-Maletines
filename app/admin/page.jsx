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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl">
          Panel Admin - Imperio JG19
        </h1>

        <form onSubmit={crearProducto} className="mb-8 bg-slate-800/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-purple-500/30">
          <h2 className="text-3xl font-bold mb-6 text-white">Crear Nuevo Producto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Nombre del maletín"
              value={form.nombre}
              onChange={e => setForm({...form, nombre: e.target.value})}
              className="bg-white border-2 border-purple-500 focus:border-pink-500 p-4 rounded-xl w-full text-gray-900 font-semibold placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-pink-500/50"
              required
            />
            <input
              placeholder="Precio en COP"
              type="number"
              value={form.precio}
              onChange={e => setForm({...form, precio: e.target.value})}
              className="bg-white border-2 border-purple-500 focus:border-pink-500 p-4 rounded-xl w-full text-gray-900 font-semibold placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-pink-500/50"
              required
            />
          </div>
          <textarea
            placeholder="Descripción del producto"
            value={form.descripcion}
            onChange={e => setForm({...form, descripcion: e.target.value})}
            className="bg-white border-2 border-purple-500 focus:border-pink-500 p-4 rounded-xl w-full mt-4 h-28 text-gray-900 font-semibold placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-pink-500/50"
            required
          />
          <div className="mt-4">
            <label className="block text-white font-bold mb-2 text-lg">Imagen del producto</label>
            <input
              type="file"
              accept="image/*"
              ref={inputFileRef}
              onChange={e => setArchivo(e.target.files[0])}
              className="bg-white border-2 border-purple-500 p-4 rounded-xl w-full text-gray-900 font-semibold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-600 file:text-white file:font-bold hover:file:bg-purple-700 cursor-pointer"
              required
            />
          </div>
          <button
            type="submit"
            disabled={subiendo}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white px-8 py-4 rounded-full font-black mt-6 w-full hover:scale-105 transition-all disabled:opacity-50 shadow-2xl text-lg"
          >
            {subiendo? '⏳ Subiendo imagen...' : '🚀 Crear Producto'}
          </button>
        </form>

        <div className="bg-slate-800/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-purple-500/30">
          <h2 className="text-2xl font-bold mb-6 text-white">Productos Activos: {productos.length}</h2>
          <div className="space-y-4">
            {productos.map(p => (
              <div key={p.id} className="bg-slate-700/60 backdrop-blur border-2 border-purple-500/40 p-4 rounded-2xl flex justify-between items-center hover:bg-slate-700/80 transition-all">
                <div className="flex items-center gap-4">
                  <img src={p.imagen} alt={p.nombre} className="w-20 h-20 object-cover rounded-xl shadow-lg"/>
                  <div>
                    <p className="font-bold text-lg text-white">{p.nombre}</p>
                    <p className="text-pink-400 font-black text-xl">${Number(p.precio).toLocaleString('es-CO')}</p>
                  </div>
                </div>
                <button
                  onClick={() => borrarProducto(p.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-bold transition-all hover:scale-105 shadow-lg"
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