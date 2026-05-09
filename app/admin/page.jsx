'use client'
import { useState, useEffect } from 'react'

export default function Admin() {
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', imagen: '' })

  const cargarProductos = () => {
    fetch('/api/productos')
     .then(res => res.json())
     .then(data => setProductos(data))
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const crearProducto = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    
    if (res.ok) {
      setForm({ nombre: '', descripcion: '', precio: '', imagen: '' })
      cargarProductos() // Recarga la lista
      alert('Producto creado')
    } else {
      alert('Error al crear')
    }
  }

  const borrarProducto = async (id) => {
    const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' })
    if (res.ok) cargarProductos()
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-8">Admin</h1>
      
      <form onSubmit={crearProducto} className="mb-8 border p-4">
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
          placeholder="URL Imagen" 
          value={form.imagen}
          onChange={e => setForm({...form, imagen: e.target.value})}
          className="border p-2 w-full mb-2"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Crear Producto
        </button>
      </form>

      <h2 className="text-xl mb-4">Productos: {productos.length}</h2>
      {productos.map(p => (
        <div key={p.id} className="border p-4 mb-2 flex justify-between">
          <span>{p.nombre} - ${p.precio}</span>
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