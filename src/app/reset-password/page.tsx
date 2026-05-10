"use client";

import Link from "next/link";
import { Suspense } from "react";
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

import {
  accentLinkClassName,
  appSectionClassName,
  bodyTextClassName,
  cardClassName,
  cardContentClassName,
  cardDescriptionClassName,
  cardHeaderClassName,
  cardTitleClassName,
  fieldLabelClassName,
  inputClassName,
  primaryButtonClassName,
  primaryButtonStyle,
  themeColor,
} from "@/utils/const";

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
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
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
    <section className={appSectionClassName}>
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-2xl items-center justify-center">
        <Card className={cardClassName}>
          <CardHeader className={cardHeaderClassName}>
            <CardTitle className={cardTitleClassName}>
              Reset Password
            </CardTitle>
            <CardDescription className={cardDescriptionClassName}>
              Choose a new password for your account.
            </CardDescription>
          </CardHeader>
          <CardContent className={cardContentClassName}>
            {hasInvalidLink ? (
              <div className="grid gap-4">
                <p className="text-sm text-red-600">
                  This reset link is invalid or expired.
                </p>
                <Button
                  asChild
                  className={primaryButtonClassName}
                  style={primaryButtonStyle}
                >
                  <Link href="/forgot-password">Request a new reset link</Link>
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5 sm:space-y-6"
                >
                  <div className="grid gap-4 sm:gap-5">
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel
                            className={fieldLabelClassName}
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
                              className={inputClassName}
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
                            className={fieldLabelClassName}
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
                              className={inputClassName}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className={primaryButtonClassName}
                      style={primaryButtonStyle}
                    >
                      Reset password
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            <div className={`${bodyTextClassName} mt-4 text-center`}>
              Remembered your password?{" "}
              <Link
                href="/sign-in"
                className={accentLinkClassName}
                style={{ color: themeColor }}
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
