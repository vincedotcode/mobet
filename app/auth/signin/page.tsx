"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";
import { signIn } from "next-auth/react";

// Validation schema using Zod
const loginFormSchema = z.object({
  email: z.string().nonempty({ message: "email is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function Login() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async ({ email, password }) => {
    setLoading(true);
    setLoginError(null);  // Reset the error state

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });


      if (result?.ok === false) {
        setLoginError(result.error);
        toast({
          title: "Error",
          description: result.error || "Failed to login",
          variant: "destructive",
        });
      }
      else {
        toast({
          title: "Success!",
          description: "Account logged in successfully!",
          variant: "default",
        });

        router.push("/dashboard");  // Redirect to the homepage after successful login
      }







    } catch (error: unknown) {
      if (error instanceof Error) {
        setLoginError(error.message);
        toast({
          title: "Error",
          description: error.message || "Failed to login",
          variant: "destructive",
        });
      } else {
        setLoginError("An unexpected error occurred.");
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen">
      <div className="flex items-center justify-center flex-col">
        <div className="self-start mb-16 mt-3 flex justify-between w-full">
          <Link href="/">
            <Button className="mx-3">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="example@example.com" />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="Password" />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                {loginError && (
                  <FormItem>
                    <FormMessage className="text-red-500">{loginError}</FormMessage>
                  </FormItem>
                )}
                <div className="flex justify-center">
                  <LoadingButton type="submit" variant="default" className="w-full" loading={loading}>
                    Login
                  </LoadingButton>
                </div>
                <div className="mt-4 text-center">
                  <Link href="/auth/forgot" className="text-sm underline">Forgot password?</Link>
                </div>
                <div className="text-center text-sm">
                  Don’t have an account? <Link href="/auth/signup" className="underline">Sign up</Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
