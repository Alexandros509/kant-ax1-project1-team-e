'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

import { getSupabaseClient } from '@/shared/lib/supabase/client';

export default function useAuthUser() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const supabase = getSupabaseClient();
        if (!supabase) return;

        // 로그인, 로그아웃, 토큰 갱신 시 현재 사용자를 다시 반영한다.
        // 구독 직후 INITIAL_SESSION 이벤트로 저장된 세션도 함께 전달된다.
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    async function signOut() {
        await getSupabaseClient()?.auth.signOut();
    }

    return { user, signOut };
}
