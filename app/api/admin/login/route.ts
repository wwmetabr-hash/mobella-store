import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || 'Mobella@2026').replace(/^﻿/, '').trim()
const SESSION_SECRET = (process.env.SESSION_SECRET || `mbsess_${ADMIN_PASSWORD}`).replace(/^﻿/, '').trim()

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (password.trim() !== ADMIN_PASSWORD) {
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
