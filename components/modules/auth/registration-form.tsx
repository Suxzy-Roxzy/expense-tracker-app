"use client"
import { PasswordInput } from "@/components/custom/password-input";
import SubmissionButton from "@/components/custom/submission-button";
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
import { useSignup } from "@/data/endpoints/auth";
import { cn } from "@/lib/utils";
import { signupSchema, SignupSchemaType } from "@/validators/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const RegisterationForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const { mutateAsync: register } = useSignup();
  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const {
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: SignupSchemaType) => {
    try {
      const res = await register(data);
      toast.success(res?.message);
      reset();
      router.push("/verify-email");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail?.message ||
          "An error occured during Registration"
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-none ">
        <CardContent>
          <div className="mb-6 px-3 space-y-2">
            <h5 className="text-xl font-bold text-primary dark:text-white">
              Create Account
            </h5>
            <div className="text-sm font-normal text-muted-foreground">
              Please enter your <span className="font-bold">Details</span> to
              create an account
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 px-3"
            >
              {/* NAME FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="john" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Submit */}
              <SubmissionButton
                isSubmitting={isSubmitting}
                label="Create Account"
              />
              {/* Link */}
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Sign in
              </Link>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterationForm;
