import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_id')?.value

    if (!sessionId) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      )
    }

    const session = getSession(sessionId)

    if (!session) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { user: session },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get session' },
      { status: 500 }
    )
  }
}
