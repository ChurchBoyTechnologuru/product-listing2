import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('Supabase Config:', {
    url: supabaseUrl ? 'Present' : 'Missing',
    anonKey: supabaseAnonKey ? 'Present' : 'Missing',
});

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEmailAuth() {
    const email = `test${Date.now()}@example.com`;
    const password = 'TestPassword123!';

    console.log('\n1. Testing Registration...');
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: 'Test User'
                }
            }
        });

        if (error) throw error;

        console.log('✓ Registration successful!');
        console.log('  User ID:', data.user?.id);
        console.log('  Email:', data.user?.email);
    } catch (error: any) {
        console.error('✗ Registration failed:', error.message);
        return;
    }

    console.log('\n2. Testing Login...');
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        console.log('✓ Login successful!');
        console.log('  User ID:', data.user?.id);
        console.log('  Email:', data.user?.email);
    } catch (error: any) {
        console.error('✗ Login failed:', error.message);
    }
}

testEmailAuth().catch(console.error);
