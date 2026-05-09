import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const productos = await kv.get('productos') || []
    return NextResponse.json(productos)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const productos = await kv.get('productos') || []
    
    const nuevo = {
      id: Date.now().toString(),
      nombre: body.nombre,
      descripcion: body.descripcion,
      precio: Number(body.precio),
      imagen: body.imagen
    }
    
    productos.push(nuevo)
    await kv.set('productos', productos)
    
    return NextResponse.json(nuevo)
  } catch (error) {
    console.log('ERROR POST:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}