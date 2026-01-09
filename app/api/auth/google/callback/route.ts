
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url));
    }

    try {
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`;

        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
            }),
        });

        const tokens = await tokenResponse.json();

        if (!tokens.access_token) {
            console.error('Failed to get access token:', tokens);
            throw new Error('Failed to get access token');
        }

        // Get user info
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });

        const googleUser = await userResponse.json();

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { email: googleUser.email },
        });

        if (!user) {
            // Create new user
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await prisma.user.create({
                data: {
                    email: googleUser.email,
                    name: googleUser.name,
                    password: hashedPassword,
                    avatar: googleUser.picture,
                    isEmailVerified: true,
                    role: 'BUYER', // Default role
                },
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Redirect to frontend with token
        const callbackUrl = new URL('/auth/callback', request.url);
        callbackUrl.searchParams.set('token', token);

        return NextResponse.redirect(callbackUrl);

    } catch (error) {
        console.error('Google auth error:', error);
        return NextResponse.redirect(new URL('/auth/login?error=auth_failed', request.url));
    }
}
