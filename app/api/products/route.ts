import { NextResponse } from 'next/server'
import { getActiveProducts } from '@/lib/products'

export function GET() {
  return NextResponse.json(getActiveProducts())
}
