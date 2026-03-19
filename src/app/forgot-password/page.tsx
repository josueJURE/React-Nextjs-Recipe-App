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

import { themeColor, borderRadius } from "@/utils/const";

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
    <section className="min-h-screen w-2xl bg-[radial-gradient(circle_at_top,_#fffdfb_0%,_#f9f2eb_52%,_#f3e7dc_100%)] px-4 py-8 text-[#35241b] sm:px-6 lg:px-8 justify-self-center">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center justify-center">
        <Card className="w-full max-w-4xl rounded-[2rem] border border-[#efe5dc] bg-[#fffdfa] py-8 shadow-[0_24px_60px_-28px_rgba(81,52,34,0.35)] sm:py-10">
          <CardHeader className="gap-3 px-6 sm:px-12">
            <CardTitle className="font-serif text-4xl font-semibold text-[#2f1d17] sm:text-5xl text-center">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-nowrap text-lg text-[#8b7d74] sm:text-xl text-center">
              Enter an email address to receive a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-12">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid gap-4">
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel
                          className="text-xl font-semibold text-[#2f1d17] sm:text-2xl"
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
