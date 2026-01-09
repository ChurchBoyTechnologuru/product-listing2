
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDirectDB() {
    console.log('Testing Direct DB Connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@')); // Hide password

    try {
        const count = await prisma.user.count();
        console.log('Connection Successful! User count:', count);
    } catch (e: any) {
        console.error('Connection Failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

testDirectDB();
