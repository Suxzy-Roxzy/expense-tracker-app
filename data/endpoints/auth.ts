import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosInstance, AxiosInstanceWithToken } from "../instance";
import {
  BaseResponse,
  CreateUserResponse,
  LoginResponse,
  passwordReset,
  verify2FA,
} from "@/validators/types/auth";
import {
  loginSchema,
  LoginSchemaType,
  passwordResetConfirmSchema,
  passwordResetConfirmSchemaType,
  passwordResetRequestSchema,
  passwordResetRequestSchemaType,
  passwordResetSchema,
  passwordResetSchemaType,
  Resend2FASchema,
  Resend2FASchemaType,
  signupSchema,
  SignupSchemaType,
  singleEmailSchema,
  SingleEmailSchemaType,
  verifyTokenSchema,
  verifyTokenSchemaType,
} from "@/validators/schemas/auth";
import { toast } from "sonner";
import z from "zod";
import { removeToken } from "@/utils/auth";

// POST
// /api/v1/auth/signup
// Create User Account
export const useSignup = () => {
  return useMutation({
    // mutationKey: ["signup"],
    mutationFn: async (
      newUser: z.infer<typeof signupSchema>
    ): Promise<CreateUserResponse> => {
      const validatedData = signupSchema.parse(newUser);
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/auth/signup",
        validatedData
      );
      return response.data;
    },
    // onSuccess: () => {
    //   console.log("Email sent successfully");
    // },
  });
};

// POST
// /api/v1/auth/resend-verification
// Resend Verification Email
export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: async (email: SingleEmailSchemaType): Promise<BaseResponse> => {
      const validatedData = singleEmailSchema.parse(email);
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/auth/resend-verification",
        validatedData
      );
      return response.data;
    },
    // onSuccess: () => {
    //   console.log("Verification email resent successfully");
    // },
  });
};

// POST
// /api/v1/auth/login
// Login Users
export const useLogin = () => {
  return useMutation({
    mutationFn: async (loginUser: LoginSchemaType) : Promise<LoginResponse> => {
      const validatedData = loginSchema.parse(loginUser);
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/auth/login",
        validatedData
      );
      return response.data;
    },
  });
};

// POST
// /api/v1/auth/verify-account
// Verify User Account
export const useVerifyAccount = () => {
  return useMutation({
    mutationFn: async (verifyAccount: verifyTokenSchemaType) => {
      const validatedData = verifyTokenSchema.parse(verifyAccount);
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/auth/verify-account",
        validatedData
      );
      return response.data;
    },
  });
};

// GET
// /api/v1/auth/refresh_token
// Get New Access Token(refresh token)
export const useRefreshToken = () => {
  return useQuery({
    queryKey: ["auth", "refresh"],
    queryFn: async () => {
      try {
        const response = await AxiosInstanceWithToken.get(
          "/api/v1/auth/refresh_token"
        );
        return response.data;
      } catch (error: any) {
        const message =
          error.response?.data?.detail?.message || "Failed to refresh token";
        toast.error(message);
      }
    },
    enabled: false,
    // onError: (error:any) => {
    //   const message = error.response?.data?.detail?.message || "Failed to refresh token"
    //   toast.error(message)
    // }
  });
};

// GET
// /api/v1/auth/logout
// Revoke Token
export const useLogout = () => {
  // Able to get Access to React Query hook (brain) to clear Cache
  // Query client stores all the cached data
  const queryClient = useQueryClient();

  return useMutation({
    // mutationKey: ["logout"],
    mutationFn: async () => {
      const response = await AxiosInstanceWithToken.get("/api/v1/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      // Clearing up all Cache and removing token from localStorage
      removeToken();
      queryClient.clear();
      console.log("Logout successful");
    },
  });
};

// POST
// /api/v1/auth/password-reset
// Password Reset Request
export const usePasswordResetRequest = () => {
  return useMutation({
    // mutationKey: ["password-reset-request"],
    mutationFn: async (data: passwordResetRequestSchemaType
    ) => {
      const validatedData = passwordResetRequestSchema.parse(data);
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/auth/password-reset-request",
        validatedData
      );
      return response.data;
    },
    onSuccess: () => {
      console.log("Password reset request successful");
    },
  });
};

// POST
// /api/v1/auth/password-reset-confirm/{token}
// Reset Account Password
export const usePasswordResetConfirm = () => {
  return useMutation({
    // mutationKey: ["password-reset-confirm"], 
    mutationFn: async ({token, data}:{
      token: string;
      data: passwordResetConfirmSchemaType;
    }) => {
      const validatedData = passwordResetConfirmSchema.parse(data);
      const response = await AxiosInstance.post(
        `/api/v1/auth/password-reset-confirm/${token}`,
        validatedData
      );
      return response.data;
    },
    onSuccess: () => {
      console.log("Password reset confirm successful");
    },
  });
};

// POST
// /api/v1/auth/password-reset
// Password Reset
export const usePasswordReset = () => {
  return useMutation({
    // mutationKey: ["password-reset"],
    mutationFn: async (data: passwordResetSchemaType) => {
      const validatedData = passwordResetSchema.parse(data);
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/auth/password-reset",
        validatedData
      );
      return response.data;
    },
    onSuccess: () => {
      console.log("Password reset successful");
    },
  });
};


// ————————————————————————————————————————
// Authentication - 2FA Endpoints
// ————————————————————————————————————————

// GET
// /api/v1/2fa/enable-2FA
// Enable 2Fa
export const useEnable2FA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationKey: ["enable-2FA"],
    mutationFn: async () => {
      const response = await AxiosInstanceWithToken.get("/api/v1/2fa/enable-2FA");
      return response.data;
    },
    onSuccess: () => {
      // Get Back to this place !!!!!!!!
      queryClient.invalidateQueries(["user", "profile"] as any);
      toast.success("2FA enabled succesfully");
    },
    onError: (error: any)=>{
      const message = error.response?.data?.detail?.message || "failed to enable 2FA";
      toast.error(message)
    }
  });
};

// GET
// /api/v1/2fa/verify-2FA-code/{token}
// Verify 2Fa Code
export const useVerify2FACode = () => {
  const queryClient = useQueryClient(); 
  return useMutation({
    // mutationKey: ["verify-2FA-code"],
    mutationFn: async (token: string) => {
      const response = await AxiosInstance.get(
        `/api/v1/2fa/verify-2FA-code/${token}`
      );
      return response.data;
    },
    onSuccess: () => {
      // COME BACK TO THIS !!!!!!!!
      queryClient.invalidateQueries(["user", "profile"] as any);
      toast.success("2FA verified succesfully");
    }
  });
};

// POST
// /api/v1/2fa/resend-2FA-code
// Resend 2Fa Code

export const useResend2FACode = () => {
  return useMutation({
    // mutationKey: ["resend-2FA-code"],
    mutationFn: async (data: Resend2FASchemaType) => {
      const validatedData = Resend2FASchema.parse(data);  
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/2fa/resend-2FA-code",
        validatedData
      );
      return response.data;
    },
  });
};

// GET
// /api/v1/2fa/disable-2FA
// Disable 2Fa
export const useDisable2FA = () => {
  const queryClient = useQueryClient()

  return useMutation ({
    mutationFn: async () => {
      const response = await AxiosInstanceWithToken.get(
        "/api/v1/2fa/disable-2FA"
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "profile"] as any)
      toast.success("2FA Succesflly Disabled")
    },
    onError: (error: any) => {
      throw error;
    }
  })
}

