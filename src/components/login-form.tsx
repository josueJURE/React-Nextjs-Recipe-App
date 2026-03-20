"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChefHat } from "lucide-react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { themeColor, borderRadius } from "@/utils/const";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
    <section className=" min-h-[80vh] w-2xl bg-[radial-gradient(circle_at_top,_#fffdfb_0%,_#f9f2eb_52%,_#f3e7dc_100%)] px-4 py-8 text-[#35241b] sm:px-6 lg:px-8 justify-self-center">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify gap-10 md:gap-14 ">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex size-28 items-center justify-center rounded-full bg-[#f7e8df] shadow-[0_18px_45px_-32px_rgba(81,52,34,0.9)] sm:size-32">
            <ChefHat
              className="size-12 sm:size-14"
              style={{ color: themeColor }}
              strokeWidth={2.4}
            />
          </div>

          <div className="space-y-4">
            <h1 className="font-serif text-5xl font-semibold  ">
              Culinary Explorer
            </h1>
            <p className="mx-auto inline-block  px-4 py-1 text-lg text-[#756961] sm:text-2xl">
              Discover authentic recipes from around the world
            </p>
          </div>
        </div>

        <Card className="w-full max-w-4xl rounded-[2rem] border border-[#efe5dc] bg-[#fffdfa] py-8 shadow-[0_24px_60px_-28px_rgba(81,52,34,0.35)] sm:py-10">
          <CardHeader className="gap-3 px-6 sm:px-12">
            <CardTitle className="font-serif text-5xl font-semibold text-[#2f1d17] sm:text-5xl text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-lg text-[#8b7d74] sm:text-2xl text-center">
              Sign in to explore global cuisines
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-12">
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
                      <FormLabel className="text-xl font-semibold text-[#2f1d17] sm:text-2xl">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="chef@example.com"
                          disabled={isLoading}
                          className="h-15 rounded-[1.35rem] border-[#e6ddd5] bg-white px-6 text-lg text-[#5b4d46] placeholder:text-[#8b7d74] shadow-none focus-visible:border-[#dba57a] focus-visible:ring-[#e6c4a8]/40 sm:h-18 sm:text-2xl"
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
                      <FormLabel className="text-xl font-semibold text-[#2f1d17] sm:text-2xl">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="........"
                          disabled={isLoading}
                          className="h-15 rounded-[1.35rem] border-[#e6ddd5] bg-white px-6 text-lg text-[#5b4d46] placeholder:text-[#8b7d74] shadow-none focus-visible:border-[#dba57a] focus-visible:ring-[#e6c4a8]/40 sm:h-18 sm:text-2xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-5 pt-2">
                  <Button
                    className="h-15 w-full rounded-[1.35rem] text-lg font-semibold text-white shadow-none hover:bg-[#b24c24] sm:h-18 sm:text-2xl"
                    style={{ background: themeColor, borderRadius }}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>

                  <div className="space-y-4 pt-1 text-center">
                    <Link
                      href="/forgot-password"
                      className="inline-block text-lg font-medium transition-colors hover:text-[#a94520] sm:text-xl"
                      style={{ color: themeColor }}
                    >
                      Forgot password?
                    </Link>

                    <p className="text-lg text-[#7d7068] sm:text-xl">
                      Don&apos;t have an account?{" "}
                      <Link
                        href="/sign-up"
                        className="font-medium  transition-colors hover:text-[#a94520]"
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
                      className="h-13 w-full rounded-[1.2rem] border-[#eadfd6] bg-white text-base font-medium text-[#4c372d] hover:bg-[#fcf5ef] sm:h-14 sm:text-lg"
                    >
                      <FcGoogle className="size-5" />
                      Continue with Google
                    </Button>
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
