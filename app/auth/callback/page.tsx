'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Supabase automatically handles the OAuth callback
                // We just need to wait for the session to be established
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Auth callback error:', error);
                    router.push('/auth/login?error=auth_failed');
                    return;
                }

                if (session) {
                    // Session is established, redirect to dashboard
                    router.push('/dashboard');
                } else {
                    router.push('/auth/login?error=no_session');
                }
            } catch (error) {
                console.error('Callback error:', error);
                router.push('/auth/login?error=unknown');
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
    );
}
