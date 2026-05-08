import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
  const idUrl = params.id
  console.log('BORRAR ID:', idUrl)

  const productos = await kv.get('productos') || []
  console.log('ANTES:', productos.length, 'IDS:', productos.map(p => p.id))

  const nuevos = productos.filter(p => String(p.id) !== String(idUrl))
  console.log('DESPUÉS:', nuevos.length)
  
  await kv.set('productos', nuevos)
  
  console.log('GUARDADO. BORRADOS:', productos.length - nuevos.length)
  
  return NextResponse.json({ 
    borrados: productos.length - nuevos.length,
    quedan: nuevos.length 
  })
}