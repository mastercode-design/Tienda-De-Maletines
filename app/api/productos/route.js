import { kv } from '@vercel/kv'
import { createProductsDAL } from '../../lib/dal/products'

const dal = createProductsDAL({ db: kv })

export async function GET() {
  const productos = await dal.getAll()
  return Response.json(productos)
}

export async function DELETE(req) {
  const { id } = await req.json()
  await dal.delete(id)
  return Response.json({ success: true })
}