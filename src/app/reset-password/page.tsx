"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

import { themeColor, borderRadius } from "@/utils/const";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password is too long"),
    confirmPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const resetError = searchParams.get("error");

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      toast.error("Reset token is missing. Please request a new reset link.");
      return;
    }

    const { error } = await authClient.resetPassword({
      newPassword: values.newPassword,
      token,
    });

    if (error) {
      toast.error(error.message || "Unable to reset password.");
      return;
    }

    // const resetUserPasswordResponse = await fetch(
    //   "/api/user/reset-password-request",
    //   {
    //     method: "PATCH",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       newPassword: values.newPassword,
    //       confirmPassword: values.confirmPassword,
    //     }),
    //   }

    // );

    // if (!resetUserPasswordResponse.ok) {
    //   const errorData = await resetUserPasswordResponse.json().catch(() => null);
    //   console.error("Error response:", errorData);
    //   toast.error("Password reset succeeded, but post-reset sync failed.");
    //   return;
    // }

    toast.success("Password reset successful. Please sign in.");
    router.push("/sign-in");
  }

  const hasInvalidLink = Boolean(resetError) || !token;

  return (
    <section className=" min-h-[100vh] w-2xl bg-[radial-gradient(circle_at_top,_#fffdfb_0%,_#f9f2eb_52%,_#f3e7dc_100%)] px-4 py-8 text-[#35241b] sm:px-6 lg:px-8 justify-self-center">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center justify-center">
        <Card className="w-full max-w-4xl rounded-[2rem] border border-[#efe5dc] bg-[#fffdfa] py-8 shadow-[0_24px_60px_-28px_rgba(81,52,34,0.35)] sm:py-10">
          <CardHeader className="gap-3 px-6 sm:px-12">
            <CardTitle className="font-serif text-4xl font-semibold text-[#2f1d17] sm:text-5xl text-center">
              Reset Password
            </CardTitle>
            <CardDescription className="text-nowrap text-lg text-[#8b7d74] sm:text-xl text-center">
              Choose a new password for your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-12">
            {hasInvalidLink ? (
              <div className="grid gap-4">
                <p className="text-sm text-red-600">
                  This reset link is invalid or expired.
                </p>
                <Button asChild>
                  <Link href="/forgot-password">Request a new reset link</Link>
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel
                            className="text-xl font-semibold text-[#2f1d17] sm:text-2xl"
                            htmlFor="email"
                          >
                            New password
                          </FormLabel>
                          <FormControl>
                            <PasswordInput
                              id="newPassword"
                              autoComplete="new-password"
                              placeholder="Enter your new password"
                              {...field}
                              className="h-15 rounded-[1.35rem] border-[#e6ddd5] bg-white px-6 text-lg text-[#5b4d46] placeholder:text-[#8b7d74] shadow-none focus-visible:border-[#dba57a] focus-visible:ring-[#e6c4a8]/40 sm:h-18 sm:text-2xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel
                            className="text-xl font-semibold text-[#2f1d17] sm:text-2xl"
                            htmlFor="confirmPassword"
                          >
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <PasswordInput
                              id="confirmPassword"
                              autoComplete="new-password"
                              placeholder="Confirm your new password"
                              {...field}
                              className="h-15 rounded-[1.35rem] border-[#e6ddd5] bg-white px-6 text-lg text-[#5b4d46] placeholder:text-[#8b7d74] shadow-none focus-visible:border-[#dba57a] focus-visible:ring-[#e6c4a8]/40 sm:h-18 sm:text-2xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="h-15 w-full  text-lg font-semibold text-white shadow-none hover:bg-[#b24c24] sm:h-18 sm:text-2xl"
                      style={{ background: themeColor, borderRadius }}
                    >
                      Reset password
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            <div className="mt-4 text-center text-sm">
              Remembered your password?{" "}
              <Link href="/sign-in" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
