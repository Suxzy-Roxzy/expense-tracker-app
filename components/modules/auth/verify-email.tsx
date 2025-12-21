"use client";
import SubmissionButton from "@/components/data/submission-button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputOTPSpaced from "@/components/ui/input-otp-spaced";
import {
  useResendVerificationEmail,
  useVerifyAccount,
} from "@/data/endpoints/auth";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { saveToken } from "@/utils/auth";
import {
  verifyTokenSchema,
  verifyTokenSchemaType,
} from "@/validators/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { email, set } from "zod";

const EmailVerification = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const [resendToken, setResendToken] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const { mutateAsync: verifyEmailToken } = useVerifyAccount();
  const { mutateAsync: resendEmailToken } = useResendVerificationEmail();
  const {
    storedValue: persistRedirect,
    setValue: setPersistRedirect,
    removeValue,
  } = useLocalStorage<string | null>("persistRedirect", null);
  const { storedValue: persistEmail } = useLocalStorage<string | null>(
    "persistEmail",
    null
  );
  const pathname = usePathname();
  const router = useRouter();
  const form = useForm<verifyTokenSchemaType>({
    resolver: zodResolver(verifyTokenSchema),
    defaultValues: {
      token: "",
    },
  });
  const { reset } = form;

  const onSubmit = async (data: verifyTokenSchemaType) => {
    setVerifying(true);
    try {
      console.log(`verify email token..... ${data.token}`);
      const response = await verifyEmailToken(data);
      toast.success(response.message || "Email verified successfully!");
      saveToken(response);
      reset();
      if (!response?.user?.profile_completed) {
        router.replace("/onboarding");
      } else if (persistRedirect) {
        setPersistRedirect(null);
        removeValue();
        if (pathname === persistRedirect) {
          router.refresh();
        } else {
          router.push(persistRedirect);
        }
      } else {
        router.push("/");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail?.message || "Invalid Verification Code!."
      );
    } finally {
      setVerifying(false);
      reset()
    }
  };

  //   HANDLERESENDCODE FUNCTION TO RESEND VERIFICATION TOKEN
  const handleResendToken = async () => {
    setResendToken(true);
    if (!persistEmail) {
      toast.error("Oops! Email not Found");
      setResendToken(false);
      return;
    }
    try {
      const response = await resendEmailToken({ email: persistEmail });
      toast.success(
        response.message || "Verification code resent successfully!"
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail?.message ||
          "Failed to resend verification code."
      );
    } finally {
      setResendToken(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="mb-6 px-3">
            <h5 className="text-xl font-bold text-primary dark:text-white">
              Email Verification
            </h5>
            <div className="text-sm font-normal text-muted-foreground">
              Please enter the verification code sent to your email address.
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
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      {/* <Input placeholder="Enter verification code" {...field} /> */}
                      <InputOTPSpaced
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          // Auto Submit when all didgits are entered
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SubmissionButton label="Verify Code" isSubmitting={verifying} />
              <div className="text-center text-sm">
                You didn&apos;t recieve the code?{" "}
                {resendToken ? (
                  <div className="inline-flex items-center gap-2 text-muted-foreground">
                    <span>Resending...</span>
                    <LoaderCircleIcon className="animate-spin size-4" />
                  </div>
                ) : (
                  <span
                    role="button"
                    onClick={handleResendToken}
                    className="text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground cursor-pointer"
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

export default EmailVerification;
