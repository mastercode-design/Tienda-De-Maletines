import { kv } from '@vercel/kv'
import { createProductsDAL } from '../../../../lib/dal/products'
import { NextResponse } from 'next/server'

const dal = createProductsDAL({ db: kv })

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    console.log('Borrando producto ID:', id)
    
    await dal.delete(id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}