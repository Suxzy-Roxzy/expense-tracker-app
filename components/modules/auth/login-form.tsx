"use client";

import { useLogin } from "@/data/endpoints/auth";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LoginSchemaType } from "@/validators/schemas/auth";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validators/schemas/auth";
import { useEffect } from "react";
import { toast } from "sonner";
import { saveToken } from "@/utils/auth";
import { cn } from "@/lib/utils";
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
import Link from "next/link";
import { PasswordInput } from "@/components/custom/password-input";
import SubmissionButton from "@/components/custom/submission-button";

const LoginForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const searchparams = useSearchParams();
  const redirect = searchparams.get("redirect") || "/";
  const pathname = usePathname();
  const { storedValue: redirectStored, setValue: setRedirectStored } =
    useLocalStorage<string | null>("redirect", null);
  //   const { setValue: setPersistEmail } = useLocalStorage<string | null>(
  //     "persistEmail",
  //     null
  //   );
  const router = useRouter();
  const { mutateAsync: Login } = useLogin();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (redirect) {
      setRedirectStored(redirect);
    }
  }, [redirect]);

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const response = await Login(data);
      if ("requires_2fa" in response && response.requires_2fa) {
        toast.success(response.message);
        reset();
        router.push(`/verify-2fa?email=${response.users.email}`);
      } else if ("token" in response) {
        toast.success(response.message);
        reset();
        router.push(`/verify-email`);
      } else if ("access_token" in response) {
        toast.success(response.message);
        reset();
        console.log(response)
        saveToken(response);
        if (!response.user.profile_completed) {
          router.push("/onboarding");
          setRedirectStored(null);
        } else if (redirectStored) {
          router.push(redirectStored);
        } else if (redirect) {
          const redirectUrl = redirectStored || redirect;
          setRedirectStored(null);
          if (pathname === redirectUrl) {
            router.refresh();
          } else {
            router.push(redirectUrl);
          }
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.detail?.message || "Login failed";
      toast.error(message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="mb-6 px3 space-y-2">
            <h5 className="text-xl font-bold text-primary dark:text-white">
              Login to your account
            </h5>
            <div className="text-sm font-normal text-muted-foreground">
              Please enter your Email address and password to Login
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-3"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="johndoe@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between ">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm-underline-offset-4 hover:underline"
                      >
                        Forgot Your Password?
                      </Link>
                    </div>
                    <FormControl>
                      <PasswordInput placeholder="1234&)(#@1ghsJ" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <SubmissionButton isSubmitting={isSubmitting} label="login" />

              <div className="text-center text-sm">
                Don&apos;t have an account?{"   "}
                <Link href="/register" className="underline underline-offset-4">
                  Sign Up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
