"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { signInFormSchema } from "@/lib/validations/user-choices";
import type { SignInForm } from "@/lib/validations/user-choices";
import { toast } from "sonner";

import { signIn } from "@/lib/auth-client";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignInWithGoogle = async (e: React.FormEvent) => {
  
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/recipe-ui',
      });
      console.log("signed up with Google Credentials!!");
    } catch (error) {
      toast.error('Failed to Login with Google ');
    } finally {
      setIsLoading(false);
    }
  };

  // z.infer<typeof signInFormSchema>;

  async function onSubmit(values: SignInForm) {
    console.log("signed up with email and password!!");
    const { email, password } = values;

    const { data, error } = await signIn.email(
      {
        email,
        password,
        callbackURL: "/recipe-ui",
      },
      {
        onSuccess: () => {
          toast("please wait");
          form.reset();
        },
        onError: (ctx) => {
          toast(ctx.error.message);
        },
      }
    );

    console.log(error?.code);

    // console.log("data?.redirect", data?.redirect)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center items-center justify-center">
        {/* <CardTitle>Sign In</CardTitle> */}
        <CardDescription className="whitespace-nowrap">
          Welcome back! Please sign in to continue.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          {/* <form onSubmit={form.handleSubmit( onSubmit)} className="space-y-4"> */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@mail.com" {...field} />
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
                  <div className="flex space-x-55">
                  <FormLabel>Password</FormLabel>
                  <FormLabel>
                  
               
                    
                    Forogt password</FormLabel>

                  </div>
                
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Submit
            </Button>
            <Button onClick={handleSignInWithGoogle} className="w-full">Google Sign In</Button>
         
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account yet?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
