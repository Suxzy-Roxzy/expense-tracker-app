export type passwordResetRequest = {
    email: string;
}

// Assuming UserModel has these basic Fields
export interface UserModel {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_verified: boolean;
    profile_completed: boolean;
}

export interface BaseResponse {
    message: string;
}

export interface CreateUserResponse extends BaseResponse {
    user: UserModel
}

export interface TokenResponse{
    access_token: string;
}



export type passwordReset = {
    confirm_new_password: string;
    new_password: string;
    old_password: string;
}

export type verify2FA = {
    code: string;
}

export interface VerificationResponse extends BaseResponse {
    requires_verification: boolean;
}

export interface TwoFactorResponse extends BaseResponse {
    requires_2fa: boolean;
    users : {
        email: string;
        uid: string;
    }
}

export interface LoginSuccessResponse extends BaseResponse {
    user: UserModel;
    access_token: string;
    refresh_token: string;
}


export type LoginResponse =
  | VerificationResponse
  | TwoFactorResponse
  | LoginSuccessResponse;