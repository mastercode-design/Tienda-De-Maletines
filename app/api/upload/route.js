import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json({ error: 'Falta filename' }, { status: 400 })
    }

    if (!request.body) {
      return NextResponse.json({ error: 'No hay archivo' }, { status: 400 })
    }

    const blob = await put(filename, request.body, {
      access: 'public',
    })

    return NextResponse.json(blob)
  } catch (error) {
    console.error('Error Blob:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}