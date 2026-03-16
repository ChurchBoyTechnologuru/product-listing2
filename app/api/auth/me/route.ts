import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_id')?.value

    if (!sessionId) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      )
    }

    const user = getUser(sessionId)

    if (!user) {
      return NextResponse.json(
        { error: 'Session expired or invalid' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

