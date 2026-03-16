import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    const { sessionId, user } = registerUser(email, password, name, (role as 'BUYER' | 'SELLER') || 'BUYER')

    const response = NextResponse.json(
      { user },
      { status: 201 }
    )

    // Set session cookie (HTTP-only)
    response.cookies.set({
      name: 'session_id',
      value: sessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    )
  }
}
