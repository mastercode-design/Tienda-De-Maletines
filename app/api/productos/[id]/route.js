import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    const productos = await kv.get('productos') || [];
    
    // Filtra y quita el producto con ese id
    const nuevosProductos = productos.filter(String(p.id) !== String(id));
    await kv.set('productos', nuevosProductos);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}