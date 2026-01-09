
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
    try {
        const { uid, email, name, picture, phone } = await request.json();

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
        }

        console.log('[Auth Sync] Syncing user:', { email, name, hasAvatar: !!picture, hasPhone: !!phone });

        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { email },
            include: {
                shop: true,
                businessInfo: true,
                bankDetails: true,
            },
        });

        if (!user) {
            // Create new user
            console.log('[Auth Sync] Creating new user');
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || email.split('@')[0],
                    password: 'supabase-managed',
                    avatar: picture || null,
                    phone: phone || null,
                    isEmailVerified: true,
                    role: 'BUYER',
                },
                include: {
                    shop: true,
                    businessInfo: true,
                    bankDetails: true,
                },
            });
            console.log('[Auth Sync] User created successfully');
        } else {
            // Update existing user if data has changed
            const updates: any = {};

            if (name && name !== user.name) {
                updates.name = name;
            }

            if (picture !== undefined && picture !== user.avatar) {
                updates.avatar = picture;
            }

            if (phone !== undefined && phone !== user.phone) {
                updates.phone = phone;
            }

            // Only update if there are changes
            if (Object.keys(updates).length > 0) {
                console.log('[Auth Sync] Updating user with:', updates);
                user = await prisma.user.update({
                    where: { email },
                    data: updates,
                    include: {
                        shop: true,
                        businessInfo: true,
                        bankDetails: true,
                    },
                });
                console.log('[Auth Sync] User updated successfully');
            } else {
                console.log('[Auth Sync] No changes detected, skipping update');
            }
        }

        // Generate JWT token (same as login route)
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Remove password
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            data: {
                token,
                user: userWithoutPassword,
            },
        });
    } catch (error) {
        console.error('[Auth Sync] Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
