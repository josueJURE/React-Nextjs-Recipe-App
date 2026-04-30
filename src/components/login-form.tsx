"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChefHat } from "lucide-react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  accentLinkClassName,
  appSectionClassName,
  cardClassName,
  cardContentClassName,
  cardDescriptionClassName,
  cardHeaderClassName,
  cardTitleClassName,
  fieldLabelClassName,
  heroContainerClassName,
  heroIconContainerClassName,
  heroSubtitleClassName,
  heroTitleClassName,
  inputClassName,
  primaryButtonClassName,
  primaryButtonStyle,
  secondaryButtonClassName,
  themeColor,
  checkboxTexts,
  formFields,
} from "@/utils/const";

import { currentYear } from "@/utils/helper-functions/helper-functions";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import {
  signInFormSchema,
  type SignInForm,
} from "@/lib/validations/user-choices";
import { CheckBox } from "@/components/ui/checkbox";
import { validateAuthorizationCode } from "better-auth";

const year = new Date();

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignInWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/recipe-ui",
      });
    } catch {
      toast.error("Failed to login with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: SignInForm) => {
    const { email, password } = values;

    setIsLoading(true);

    try {
      await signIn.email(
        {
          email,
          password,
          callbackURL: "/recipe-ui",
        },
        {
          onSuccess: () => {
            toast("Please wait");
            form.reset();
          },
          onError: (ctx) => {
            toast(ctx.error.message);
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={`${appSectionClassName} h-screen`}>
      <div className="flex justify-evenly items-center">
        <Card className={cardClassName}>
          <div className={`${heroContainerClassName} max-w-2xl `}>
            <div className={heroIconContainerClassName}>
              <ChefHat
                className="size-12 sm:size-14"
                style={{ color: themeColor }}
                strokeWidth={2.4}
              />
            </div>

            <div className="space-y-4">
              <h1 className={heroTitleClassName}>Culinary Explorer</h1>
              <p className={heroSubtitleClassName}>
                Discover authentic recipes from around the world
              </p>

              {checkboxTexts.map((text) => {
                return <CheckBox key={text.id} text={text.text} />;
              })}
            </div>
          </div>
        </Card>

        <Card className={cardClassName}>
          <CardHeader className={cardHeaderClassName}>
            <CardTitle className={cardTitleClassName}>Welcome back</CardTitle>
            <CardDescription className={cardDescriptionClassName}>
              Sign in to explore global cuisines
            </CardDescription>
          </CardHeader>

          <CardContent className={cardContentClassName}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-7 sm:space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className={fieldLabelClassName}>
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="chef@example.com"
                          disabled={isLoading}
                          className={inputClassName}
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
                    <FormItem className="space-y-3">
                      <FormLabel className={fieldLabelClassName}>
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="enter your password"
                          disabled={isLoading}
                          className={inputClassName}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-5 pt-2">
                  <Button
                    className={primaryButtonClassName}
                    style={primaryButtonStyle}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>

                  <div className="space-y-4 pt-1 text-center">
                    <Link
                      href="/forgot-password"
                      className={accentLinkClassName}
                      style={{ color: themeColor }}
                    >
                      Forgot password?
                    </Link>

                    <p className="text-lg text-[#7d7068] sm:text-xl">
                      Don&apos;t have an account?{" "}
                      <Link
                        href="/sign-up"
                        className="font-medium transition-colors hover:text-[#a94520]"
                        style={{ color: themeColor }}
                      >
                        Sign Up
                      </Link>
                    </p>
                  </div>

                  <div className="pt-4">
                    <div className="mb-4 flex items-center gap-4 text-sm text-[#a2948a]">
                      <span className="h-px flex-1 bg-[#eadfd6]" />
                      <span>or continue with</span>
                      <span className="h-px flex-1 bg-[#eadfd6]" />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSignInWithGoogle}
                      disabled={isLoading}
                      className={secondaryButtonClassName}
                    >
                      <FcGoogle className="size-5" />
                      Continue with Google
                    </Button>
                    <div className="flex justify-center mt-2.5">
                      <CardFooter className="text-center">{`${currentYear(
                        year
                      )} Culinary Explorer. All Rights Reserved`}</CardFooter>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
