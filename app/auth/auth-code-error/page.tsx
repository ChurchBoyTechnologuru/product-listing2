'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Authentication Error</h1>
          <p className="text-muted-foreground">
            There was an error during the authentication process. This could happen if the confirmation link expired or there was a technical issue.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Please try to:</p>
            <ol className="text-sm text-muted-foreground text-left space-y-1 list-decimal list-inside">
              <li>Sign up again with your email</li>
              <li>Check your email for a new confirmation link</li>
              <li>Click the confirmation link within 24 hours</li>
            </ol>
          </div>
          <div className="flex gap-2 pt-4">
            <Button asChild className="flex-1">
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
