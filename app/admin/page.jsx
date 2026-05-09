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
      alert('Producto creado')
    }
    setSubiendo(false)
  }

  const borrarProducto = async (id) => {
    const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' })
    if (res.ok) cargarProductos()
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl mb-8">Admin</h1>
      <form onSubmit={crearProducto} className="mb-8 border p-4 rounded">
        <h2 className="text-xl mb-4">Crear Producto</h2>
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={e => setForm({...form, nombre: e.target.value})}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          placeholder="Descripción"
          value={form.descripcion}
          onChange={e => setForm({...form, descripcion: e.target.value})}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          placeholder="Precio"
          type="number"
          value={form.precio}
          onChange={e => setForm({...form, precio: e.target.value})}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="file"
          accept="image/*"
          ref={inputFileRef}
          onChange={e => setArchivo(e.target.files[0])}
          className="border p-2 w-full mb-4"
          required
        />
        <button
          type="submit"
          disabled={subiendo}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:bg-gray-400"
        >
          {subiendo? 'Subiendo...' : 'Crear Producto'}
        </button>
      </form>

      <h2 className="text-xl mb-4">Productos: {productos.length}</h2>
      {productos.map(p => (
        <div key={p.id} className="border p-4 mb-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={p.imagen} alt={p.nombre} className="w-16 h-16 object-cover"/>
            <span>{p.nombre} - ${p.precio}</span>
          </div>
          <button
            onClick={() => borrarProducto(p.id)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Borrar
          </button>
        </div>
      ))}
    </div>
  )
}