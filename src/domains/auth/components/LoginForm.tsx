'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { getSupabaseClient } from '@/shared/lib/supabase/client';
import type { LoginFormValues } from '@/domains/auth/types/auth.types';
import {
    validateLoginForm,
    type LoginFormErrors,
} from '@/domains/auth/utils/validateLoginForm';

const INPUT_CLASS_NAME =
    'h-11 rounded-none border-0 border-b border-black/30 px-0 focus-visible:border-black focus-visible:ring-0 aria-invalid:border-red-600 aria-invalid:ring-0';

export default function LoginForm() {
    const router = useRouter();
    const [values, setValues] = useState<LoginFormValues>({
        email: '',
        password: '',
    });
    const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setValues((previousValues) => ({ ...previousValues, [name]: value }));
        // 사용자가 수정을 시작한 필드의 오류는 바로 지워 재입력을 방해하지 않는다.
        setFieldErrors((previousErrors) => ({
            ...previousErrors,
            [name]: undefined,
        }));
    }

    // 비밀번호 복구 페이지가 아직 없어 미구현 안내만 표시한다.
    function handleForgotPassword() {
        setNoticeMessage('Password recovery is not available yet.');
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage(null);
        setNoticeMessage(null);

        const errors = validateLoginForm(values);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }

        const supabase = getSupabaseClient();
        if (!supabase) {
            setErrorMessage(
                'Login is unavailable. Supabase environment variables are not configured.',
            );
            return;
        }

        setIsSubmitting(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: values.email.trim(),
            password: values.password,
        });
        setIsSubmitting(false);

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        router.push('/');
    }

    return (
        <div className="mx-auto flex w-full max-w-[360px] flex-col items-center">
            <Image
                src="/Logo.png"
                alt="ONEPIECE"
                width={2048}
                height={768}
                priority
                className="h-auto w-[180px] md:w-[220px]"
            />

            <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-12 flex w-full flex-col gap-6"
            >
                <label className="flex flex-col gap-1 text-xs tracking-widest">
                    EMAIL
                    <Input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={values.email}
                        onChange={handleChange}
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={
                            fieldErrors.email ? 'login-email-error' : undefined
                        }
                        className={INPUT_CLASS_NAME}
                    />
                    {fieldErrors.email && (
                        <span
                            id="login-email-error"
                            className="text-xs tracking-normal text-red-600"
                        >
                            {fieldErrors.email}
                        </span>
                    )}
                </label>

                <label className="flex flex-col gap-1 text-xs tracking-widest">
                    PASSWORD
                    <Input
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        required
                        value={values.password}
                        onChange={handleChange}
                        aria-invalid={Boolean(fieldErrors.password)}
                        aria-describedby={
                            fieldErrors.password
                                ? 'login-password-error'
                                : undefined
                        }
                        className={INPUT_CLASS_NAME}
                    />
                    {fieldErrors.password && (
                        <span
                            id="login-password-error"
                            className="text-xs tracking-normal text-red-600"
                        >
                            {fieldErrors.password}
                        </span>
                    )}
                </label>

                <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="-mt-2 self-end text-xs text-black/60 underline-offset-4 hover:text-black hover:underline"
                >
                    Forgot password?
                </button>

                {noticeMessage && (
                    <p role="status" className="text-xs text-black/60">
                        {noticeMessage}
                    </p>
                )}

                {errorMessage && (
                    <p role="alert" className="text-xs text-red-600">
                        {errorMessage}
                    </p>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 rounded-none bg-black text-xs tracking-[0.3em] text-white hover:bg-black/80"
                >
                    {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
                </Button>

                <p className="text-center text-xs text-black/60">
                    New to ONEPIECE?{' '}
                    <Link
                        href="/signup"
                        className="font-semibold tracking-widest text-black underline-offset-4 hover:underline"
                    >
                        JOIN
                    </Link>
                </p>
            </form>
        </div>
    );
}
