"use client";

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
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

import { emailSchema } from "@/lib/validations/user-choices";

import {
  appSectionClassName,
  cardClassName,
  cardContentClassName,
  cardDescriptionClassName,
  cardHeaderClassName,
  cardTitleClassName,
  fieldLabelClassName,
  inputClassName,
  primaryButtonClassName,
  primaryButtonStyle,
} from "@/utils/const";

// Schema for email validation
const formSchema = z.object({
  email: emailSchema,
});

export default function ForgetPasswordPreview() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Assuming a function to send reset email
      const { email } = values;

      console.log("forgot email", email);

      const { data } = await authClient.requestPasswordReset({
        email, // required
        redirectTo: "/reset-password",
      });
      console.log(data?.status);
      toast.success(data?.status);
    } catch (error) {
      console.error("Error sending password reset email", error);
      toast.error("Failed to send password reset email. Please try again.");
    }
  }

  return (
    <section className={appSectionClassName}>
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-2xl items-center justify-center">
        <Card className={cardClassName}>
          <CardHeader className={cardHeaderClassName}>
            <CardTitle className={cardTitleClassName}>
              Forgot Password
            </CardTitle>
            <CardDescription className={cardDescriptionClassName}>
              Enter an email address to receive a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent className={cardContentClassName}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 sm:space-y-6"
              >
                <div className="grid gap-4 sm:gap-5">
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel
                          className={fieldLabelClassName}
                          htmlFor="email"
                        >
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="johndoe@mail.co"
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
                  <Button
                    type="submit"
                    className={primaryButtonClassName}
                    style={primaryButtonStyle}
                  >
                    Send Reset Link
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// export default function ForgetPassword() {
//   return <>User forgot password</>;
// }
