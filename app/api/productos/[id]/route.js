export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    console.log('BORRAR ID:', id)

    const productos = await kv.get('productos') || []
    console.log('ANTES:', productos.length)

    const nuevos = productos.filter(function(p) { 
      return String(p.id) !== String(id) 
    })
    
    console.log('DESPUÉS:', nuevos.length)
    await kv.set('productos', nuevos)
    
    return NextResponse.json({ 
      ok: true,
      borrados: productos.length - nuevos.length
    })
    
  } catch (error) {
    console.log('ERROR DELETE:', error.message)
    return NextResponse.json({ 
      ok: false, 
      error: error.message 
    }, { status: 500 })
  }
}