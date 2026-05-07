import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET() {
  const productos = await kv.get('productos') || []
  return NextResponse.json(productos)
}

export async function POST(request) {
  const nuevoProducto = await request.json()
  const productos = await kv.get('productos') || []
  nuevoProducto.id = Date.now()
  productos.push(nuevoProducto)
  await kv.set('productos', productos)
  return NextResponse.json(nuevoProducto)
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = Number(searchParams.get('id'))
  const productos = await kv.get('productos') || []
  const nuevosProductos = productos.filter(p => p.id!== id)
  await kv.set('productos', nuevosProductos)
  return NextResponse.json({ ok: true })
}

export async function PUT(request) {
  const productoEditado = await request.json()
  const productos = await kv.get('productos') || []
  const nuevosProductos = productos.map(p => p.id === productoEditado.id? productoEditado : p)
  await kv.set('productos', nuevosProductos)
  return NextResponse.json(productoEditado)
}