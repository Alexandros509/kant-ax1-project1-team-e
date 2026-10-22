import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Route Handlers only: token refresh can write cookies to the response.
export async function getSupabaseRouteClient() {
    const cookieStore = await cookies();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) throw new Error('Supabase is not configured');
    return createServerClient(url, key, {
        cookies: {
            getAll: () => cookieStore.getAll(),
            setAll: (values) =>
                values.forEach(({ name, value, options }) =>
                    cookieStore.set(name, value, options),
                ),
        },
    });
}

// Never share this client with browser code or attach a member session to it.
export function getSupabaseAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;
    if (!url || !key) return null;
    return createClient(url, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    });
}
