import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to verify JWT token
function verifyToken(request: NextRequest): { userId: string; email: string; role: string } | null {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
        return decoded;
    } catch (error) {
        return null;
    }
}

// GET /api/user/profile - Get current user profile
export async function GET(request: NextRequest) {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                shop: true,
                businessInfo: true,
                bankDetails: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Remove password
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            data: userWithoutPassword,
        });
    } catch (error) {
        console.error('[Profile API] GET error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { name, phone, avatar } = await request.json();

        // Build update object with only provided fields
        const updates: any = {};
        if (name !== undefined) updates.name = name;
        if (phone !== undefined) updates.phone = phone;
        if (avatar !== undefined) updates.avatar = avatar;

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { success: false, message: 'No fields to update' },
                { status: 400 }
            );
        }

        console.log('[Profile API] Updating user:', decoded.userId, 'with:', updates);

        const user = await prisma.user.update({
            where: { id: decoded.userId },
            data: updates,
            include: {
                shop: true,
                businessInfo: true,
                bankDetails: true,
            },
        });

        // Remove password
        const { password: _, ...userWithoutPassword } = user;

        console.log('[Profile API] User updated successfully');

        return NextResponse.json({
            success: true,
            data: userWithoutPassword,
        });
    } catch (error) {
        console.error('[Profile API] PUT error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
