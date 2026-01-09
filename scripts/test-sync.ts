
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/api';

async function testSync() {
    console.log('Testing Sync Endpoint...');

    const payload = {
        uid: 'test-uid-123',
        email: 'test-sync@example.com',
        name: 'Test Sync User',
        picture: 'https://example.com/avatar.jpg'
    };

    try {
        const res = await fetch(`${API_URL}/auth/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log('Sync Response Status:', res.status);
        console.log('Sync Response Data:', data);

        if (!res.ok || !data.success) {
            console.error('Sync FAILED');
        } else {
            console.log('Sync SUCCESS');
        }
    } catch (e) {
        console.error('Sync Network Error:', e);
    }
}

testSync()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
