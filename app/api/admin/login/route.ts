import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD  = process.env.ADMIN_PASSWORD  ?? ''
const SESSION_SECRET  = process.env.SESSION_SECRET  ?? `mbsess_${ADMIN_PASSWORD}`

export async function POST(req: NextRequest) {
  if (!ADMIN_PASSWORD) return NextResponse.json({ error: 'Admin não configurado' }, { status: 503 })
  const { password } = await req.json()
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', SESSION_SECRET, {
    httpOnly: true,
    secure: true,
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
