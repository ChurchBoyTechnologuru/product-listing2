import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    const user = registerUser(email, password, name)

    return NextResponse.json(
      { user, message: 'User registered successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    )
  }
}
