import { useMutation } from "@tanstack/react-query";
import { AxiosInstance } from "../instance.js";
import { passwordReset, verify2FA } from "@/validators/types/auth.js";
import { LoginSchemaType, SignupSchemaType } from "@/validators/schemas/auth.js";

// POST
// /api/v1/auth/signup
// Create User Account
export const useSignup = () => {
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: async (newUser: SignupSchemaType) => {
      const response = await AxiosInstance.post("/api/v1/auth/signup", newUser);
      return response.data;
    },
    onSuccess: () => {
      console.log("Email sent successfully");
    },
  });
};

// POST
// /api/v1/auth/login
// Login Users
export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (loginUser: LoginSchemaType) => {
      const response = await AxiosInstance.post("/api/v1/auth/login", loginUser);
      return response.data;
    },
    onSuccess: () => {
      console.log("Login successful");
    },
  });
};

// GET
// /api/v1/auth/logout
// Revoke Token
export const useLogout = () => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const response = await AxiosInstance.get("/api/v1/auth/logout");
      return response.data;
    },
  });
};

// POST
// /api/v1/auth/password-reset
// Password Reset Request
export const usePasswordResetRequest = () => {
  return useMutation({
    mutationKey: ["password-reset-request"],
    mutationFn: async (data: { email: string }) => {
      const response = await AxiosInstance.post(
        "/api/v1/auth/password-reset-request",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      console.log("Password reset request successful");
    },
  });
};

// POST
// /api/v1/auth/password-reset
// Password Reset
export const usePasswordReset = () => {
  return useMutation({
    mutationKey: ["password-reset"],
    mutationFn: async (data: passwordReset) => {
      const response = await AxiosInstance.post(
        "/api/v1/auth/password-reset",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      console.log("Password reset successful");
    },
  });
};

// GET
// /api/v1/2fa/enable-2FA
// Enable 2Fa
export const useEnable2FA = () => {
  return useMutation({
    mutationKey: ["enable-2FA"],
    mutationFn: async () => {
      const response = await AxiosInstance.get("/api/v1/2fa/enable-2FA");
      return response.data;
    },
  });
};

// GET
// /api/v1/2fa/verify-2FA-code/{token}
// Verify 2Fa Code
export const useVerify2FACode = () => {
  return useMutation({
    mutationKey: ["verify-2FA-code"],
    mutationFn: async (data: verify2FA) => {
      const response = await AxiosInstance.get(
        `/api/v1/2fa/verify-2FA-code/${data.code}`
      );
      return response.data;
    },
  });
};

// POST
// /api/v1/2fa/resend-2FA-code
// Resend 2Fa Code

export const useResend2FACode = () => {
  return useMutation({
    mutationKey: ["resend-2FA-code"],
    mutationFn: async (email: { email: string }) => {
      const response = await AxiosInstance.post(
        "/api/v1/2fa/resend-2FA-code", email
      );
      return response.data;
    },
  });
};