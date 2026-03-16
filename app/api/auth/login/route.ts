import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { sessionId, user } = loginUser(email, password)

    const response = NextResponse.json(
      { user },
      { status: 200 }
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
      { error: error.message || 'Login failed' },
      { status: 401 }
    )
  }
}

