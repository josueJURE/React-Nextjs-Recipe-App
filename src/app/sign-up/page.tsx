"use client";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Ensure this path is correct or adjust it to the actual location of the 'form' component.
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useRouter } from "next/navigation";

import { registerFormSchema } from "@/lib/validations/user-choices";
import { signUp } from "@/lib/auth-client";
import { themeColor, borderRadius } from "@/utils/const";

const formSchema = registerFormSchema;

export default function Register() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { name, email, password } = values;
      console.log(name, email, password);
      const { data, error } = await signUp.email(
        {
          name: name || "",
          email,
          password,
          image: "",
          callbackURL: "/sign-in",
        },

        {
          onRequest: (ctx) => {
            toast("Please wait while we processing your registration");

            // show loading
          },
          onSuccess: (ctx) => {
            form.reset();

            router.push("/sign-in"); // ✅ client-side redirect

            // redirect to the dashboard
          },
          onError: (ctx) => {
            alert(ctx.error.message);
          },
        }
      );
      console.log("values", values);

      // toast(
      //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //     <code className="tex-white">{JSON.stringify(values, null, 2)}</code>
      //   </pre>
      // );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <section className="min-h-screen w-2xl bg-[radial-gradient(circle_at_top,_#fffdfb_0%,_#f9f2eb_52%,_#f3e7dc_100%)] px-4 py-8 text-[#35241b] sm:px-6 lg:px-8 justify-self-center">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center justify-center">
        <Card className="w-full max-w-4xl rounded-[2rem] border border-[#efe5dc] bg-[#fffdfa] py-8 shadow-[0_24px_60px_-28px_rgba(81,52,34,0.35)] sm:py-10">
          <CardHeader className="gap-3 px-6 sm:px-12">
          <CardTitle className="font-serif text-5xl font-semibold text-[#2f1d17] sm:text-5xl text-center">
              Register
            </CardTitle>
            <CardDescription className="text-nowrap text-lg text-[#8b7d74] sm:text-xl text-center">
              Create a new account by filling out the form below.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-12">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid gap-4">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel
                          className="text-xl font-semibold text-[#2f1d17] sm:text-2xl"
                          htmlFor="name"
                        >
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            {...field}
                            className="h-15 rounded-[1.35rem] border-[#e6ddd5] bg-white px-6 text-lg text-[#5b4d46] placeholder:text-[#8b7d74] shadow-none focus-visible:border-[#dba57a] focus-visible:ring-[#e6c4a8]/40 sm:h-18 sm:text-2xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel
                          htmlFor="email"
                          className="text-xl font-semibold text-[#2f1d17] sm:text-2xl"
                        >
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="johndoe@mail.com"
                            type="email"
                            autoComplete="email"
                            {...field}
                            className="h-15 rounded-[1.35rem] border-[#e6ddd5] bg-white px-6 text-lg text-[#5b4d46] placeholder:text-[#8b7d74] shadow-none focus-visible:border-[#dba57a] focus-visible:ring-[#e6c4a8]/40 sm:h-18 sm:text-2xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone Field */}

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel
                          htmlFor="password"
                          className="text-xl font-semibold text-[#2f1d17] sm:text-2xl"
                        >
                          Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            placeholder="******"
                            autoComplete="new-password"
                            {...field}
                            className="h-15 rounded-[1.35rem] border-[#e6ddd5] bg-white px-6 text-lg text-[#5b4d46] placeholder:text-[#8b7d74] shadow-none focus-visible:border-[#dba57a] focus-visible:ring-[#e6c4a8]/40 sm:h-18 sm:text-2xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password Field */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel
                          htmlFor="confirmPassword"
                          className="text-xl font-semibold text-[#2f1d17] sm:text-2xl"
                        >
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="confirmPassword"
                            placeholder="******"
                            autoComplete="new-password"
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
                    className="h-15 w-full rounded-[1.35rem] text-lg font-semibold text-white shadow-none hover:bg-[#b24c24] sm:h-18 sm:text-2xl"
                    style={{ background: themeColor, borderRadius }}
                  >
                    Register
                  </Button>
                </div>
              </form>
            </Form>
            <p className="text-lg text-[#7d7068] sm:text-xl text-center">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="inline-block text-lg font-medium transition-colors hover:text-[#a94520] sm:text-xl"
                style={{color: themeColor}}
              >
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
