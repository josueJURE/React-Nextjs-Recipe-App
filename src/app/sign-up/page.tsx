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
      await signUp.email(
        {
          name: name || "",
          email,
          password,
          image: "",
          callbackURL: "/sign-in",
        },

        {
          onRequest: () => {
            toast("Please wait while we processing your registration");

            // show loading
          },
          onSuccess: () => {
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
    <section className={appSectionClassName}>
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-3xl items-center justify-center">
        <Card className={`${cardClassName} max-w-3xl`}>
          <CardHeader className={cardHeaderClassName}>
            <CardTitle className={cardTitleClassName}>Register</CardTitle>
            <CardDescription className={cardDescriptionClassName}>
              Create a new account by filling out the form below.
            </CardDescription>
          </CardHeader>
          <CardContent className={cardContentClassName}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 sm:space-y-6"
              >
                <div className="grid gap-4 sm:gap-5">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel
                          className={fieldLabelClassName}
                          htmlFor="name"
                        >
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            {...field}
                            className={inputClassName}
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
                          className={fieldLabelClassName}
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
                            className={inputClassName}
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
                          className={fieldLabelClassName}
                        >
                          Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            placeholder="******"
                            autoComplete="new-password"
                            {...field}
                            className={inputClassName}
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
                          className={fieldLabelClassName}
                        >
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="confirmPassword"
                            placeholder="******"
                            autoComplete="new-password"
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
                    Register
                  </Button>
                </div>
              </form>
            </Form>
            <p className={`${bodyTextClassName} pt-4 text-center`}>
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className={accentLinkClassName}
                style={{ color: themeColor }}
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
