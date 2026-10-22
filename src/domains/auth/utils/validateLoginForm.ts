import type { LoginFormValues } from '@/domains/auth/types/auth.types';

export type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm(values: LoginFormValues): LoginFormErrors {
    const errors: LoginFormErrors = {};
    const email = values.email.trim();

    if (!email) {
        errors.email = 'Please enter your email.';
    } else if (!EMAIL_PATTERN.test(email)) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!values.password) {
        errors.password = 'Please enter your password.';
    }

    return errors;
}
