import { NextRequest, NextResponse } from 'next/server'
import { logoutUser } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_id')?.value

    if (sessionId) {
      logoutUser(sessionId)
    }

    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    )

    // Clear session cookie
    response.cookies.delete('session_id')

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Logout failed' },
      { status: 400 }
    )
  }
}
