"use client"
import { useState } from 'react'

export default function Admin() {
  const [form, setForm] = useState({ nombre: '', precio: '', stock: '', imagen: '' })

  async function subirImagen(e) {
  const file = e.target.files[0]
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: file,
    headers: { 'x-filename': file.name }
  })
  const data = await res.json()
  setForm({...form, imagen: data.url})
}

  async function guardarProducto(e) {
    e.preventDefault()
    await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
       ...form,
        precio: Number(form.precio),
        stock: Number(form.stock)
      })
    })
    alert('Producto guardado')
    setForm({ nombre: '', precio: '', stock: '', imagen: '' })
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl mb-8">ADMIN IMPERIO JG19</h1>
      <form onSubmit={guardarProducto} className="max-w-md space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          className="w-full bg-zinc-900 p-3"
          value={form.nombre}
          onChange={e => setForm({...form, nombre: e.target.value})}
        />
        <input
          type="number"
          placeholder="Precio"
          className="w-full bg-zinc-900 p-3"
          value={form.precio}
          onChange={e => setForm({...form, precio: e.target.value})}
        />
        <input
          type="number"
          placeholder="Stock"
          className="w-full bg-zinc-900 p-3"
          value={form.stock}
          onChange={e => setForm({...form, stock: e.target.value})}
        />
        <input type="file" onChange={subirImagen} className="w-full" />
        {form.imagen && <img src={form.imagen} className="w-32" />}
        <button className="w-full bg-yellow-500 text-black p-3">Guardar</button>
      </form>
    </div>
  )
}