import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const file = request.body || await request.blob()
  const filename = request.headers.get('x-filename') || 'image.jpg'
  const blob = await put(filename, file, { access: 'public' })
  return NextResponse.json({ url: blob.url })
}