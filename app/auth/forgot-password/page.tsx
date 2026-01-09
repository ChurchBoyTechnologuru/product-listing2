// Forgot Password page - Send password reset email

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/components/ui/use-toast'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const onSubmit = async (data: ForgotPasswordForm) => {
        setIsLoading(true)
        try {
            await resetPassword(data.email)
            setEmailSent(true)
            toast({
                title: 'Email sent!',
                description: 'Check your inbox for password reset instructions.',
            })
        } catch (error: any) {
            toast({
                title: 'Failed to send email',
                description: error.message,
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (emailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <Link href="/auth/login" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to login
                        </Link>
                    </div>

                    <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <CardTitle>Check your email</CardTitle>
                            <CardDescription>
                                We've sent password reset instructions to <strong>{getValues('email')}</strong>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600 text-center">
                                Click the link in the email to reset your password. The link will expire in 1 hour.
                            </p>
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">Didn't receive the email?</p>
                                <Button
                                    variant="outline"
                                    onClick={() => setEmailSent(false)}
                                    className="w-full"
                                >
                                    Try again
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Link href="/auth/login" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to login
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900">Reset your password</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Forgot Password</CardTitle>
                        <CardDescription>
                            We'll send you an email with instructions to reset your password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="pl-10"
                                        {...register('email')}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Send reset link'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Remember your password?{' '}
                                <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
