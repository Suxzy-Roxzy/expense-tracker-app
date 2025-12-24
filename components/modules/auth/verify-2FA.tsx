"use client";

import SubmissionButton from "@/components/custom/submission-button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { InputOTP } from "@/components/ui/input-otp";
import InputOTPSpaced from "@/components/ui/input-otp-spaced";
import { useResend2FACode, useVerify2FACode } from "@/data/endpoints/auth";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { saveToken } from "@/utils/auth";
import {
  verifyTokenSchema,
  verifyTokenSchemaType,
} from "@/validators/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Form,
  useForm,
  UseFormStateReturn,
} from "react-hook-form";
import { toast } from "sonner";
import { set } from "zod";

const Verify2FAForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const [resendCode, setResendCode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { mutateAsync: verify2FA } = useVerify2FACode();
  const { mutateAsync: resend2FACode } = useResend2FACode();
  const { storedValue: persistRedirect, setValue: setPersistRedirect } =
    useLocalStorage("persistRedirect", null);
  const { storedValue: persistEmail, removeValue } = useLocalStorage(
    "persistEmail",
    null
  );

  // FORM VALIDATION WITH ZOD RESOLVER AND REACT HOOK FORM
  const form = useForm<verifyTokenSchemaType>({
    resolver: zodResolver(verifyTokenSchema),
    defaultValues: {
      token: "",
    },
  });

  const { reset, watch } = form;

  // Watches For Changes in the Token Input Field to reset auto submit state
  const watchedToken = watch("token");
  useEffect(() => {
    if (watchedToken?.length < 6) {
      setAutoSubmitted(false);
    }
  }, [watchedToken]);

  const onSubmit = async (values: verifyTokenSchemaType) => {
    setVerifying(true);
    try {
      const response = await verify2FA(values.token);
      toast.success(response?.message || "2FA verified successfully");
      reset();
      saveToken(response);
      // Redirecting User to the Persisted Redirect Path or to the Dashboard
      if (!response?.user?.profile_completed) {
        router.push("onboarding");
      } else if (persistRedirect) {
        setPersistRedirect(null);
        removeValue();
        if (pathname === persistRedirect) {
          router.reload();
        } else {
          router.push(persistRedirect);
        }
      } else {
        router.push("/");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.detail?.message || "Failed to verify 2FA code";
      toast.error(message);
      // Reseting on error so that user could start all over again
      setAutoSubmitted(false);
      // After everything set verifying to false
    } finally {
      setVerifying(false);
    }
  };

  // ————————————————————————————————————————————————
  // HANDLING RESEND 2FA CODE
  // ————————————————————————————————————————————————

  const handleResendCode = async () => {
    setResendCode(true);
    if (!persistEmail) {
      toast.error(
        "Oops! Email not found. Please login again to resend the code."
      );
      setResendCode(false);
      return;
    }
    try {
      const response = await resend2FACode(persistEmail);
      toast.success(response?.message || "2FA code resent successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail?.message || "Failed to resend 2FA code"
      );
    } finally {
      setResendCode(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-none">
        <CardContent className="border-0 shadow-none">
          <div>
            <h5 className="mb-6 px-3">Email Verification</h5>
            <div>
              Please Enter the Verification Code sent to your email to complete
              the 2FA process.
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-3"
            >
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-center block">
                      Verification Token
                    </FormLabel>
                    <FormControl>
                      <InputOTPSpaced
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          // Auto Submit When all digits are entered
                          if (
                            value.length === 6 &&
                            !verifying &&
                            !autoSubmitted
                          ) {
                            setAutoSubmitted(true);
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                        disabled={verifying}
                        className="mx-auto"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <SubmissionButton label="verify Code" isSubmitting={verifying} />

              <div className="text-sm text-center">
                Didn&apos;t receive the code?{" "}
                {resendCode ? (
                  <div className="inline-flex items-center gap-2 text-muted-foreground">
                    <span>Resending...</span>
                    <LoaderCircleIcon className="animate-spin size-4" />
                  </div>
                ) : (
                  <span
                    role="button"
                    onClick={handleResendCode}
                    className="text-primary hover:underline cursor-pointer"
                  >
                    Resend Code
                  </span>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verify2FAForm;
