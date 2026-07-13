import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mobella2024'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', ADMIN_PASSWORD, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'strict',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('admin_token')
  return res
}
