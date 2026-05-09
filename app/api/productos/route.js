import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET - Listar productos
export async function GET() {
  try {
    const productos = await kv.get('productos') || []
    return NextResponse.json(productos)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Crear producto
export async function POST(request) {
  try {
    const body = await request.json()
    const productos = await kv.get('productos') || []
    
    const nuevo = {
      id: Date.now().toString(),
      ...body
    }
    
    productos.push(nuevo)
    await kv.set('productos', productos)
    
    return NextResponse.json(nuevo)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}