export type passwordResetRequest = {
    email: string;
}

export type passwordReset = {
    confirm_new_password: string;
    new_password: string;
    old_password: string;
}

export type verify2FA = {
    code: string;
}