"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/schemas";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { getRandomUserProfileImg } from "@/lib/utils/user";
import { useRouter } from "next/navigation";
import { wait } from "@/lib/utils";

export default function Register() {
  const supabase = createBrowserSupabaseClient;
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
    resolver: zodResolver(registerSchema),
  });

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
    } catch (error) {
      toast.error("Failed to login with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (
    formData: z.infer<typeof registerSchema>,
  ) => {
    try {
      await supabase.auth.signUp({
        email: formData.email,
        password: formData.confirmPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: formData.name,
            avatar_url: getRandomUserProfileImg(),
          },
        },
      });

      toast.success("Registration successful");
      await wait(1000);
      router.push("/");
    } catch (error) {
      toast.error("Failed to register");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-[450px] border-black/10 dark:border-white/20 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details below to register
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form
            onSubmit={handleSubmit(handleRegistration)}
            className="grid gap-4"
          >
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Enter your full name"
                    id={field.name}
                    required
                    className={`${fieldState.invalid ? "ring-1 ring-red-500 focus:ring-red-500 focus-visible:ring-red-500" : ""}`}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    placeholder="m@example.com"
                    required
                    className={`${fieldState.invalid ? "ring-1 ring-red-500 focus:ring-red-500 focus-visible:ring-red-500" : ""}`}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="eg: john1267@"
                      required
                      className={`${fieldState.invalid ? "ring-1 ring-red-500 focus:ring-red-500 focus-visible:ring-red-500" : ""} pr-10`}
                      aria-invalid={fieldState.invalid}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="eg: john1267@"
                      required
                      className={`${fieldState.invalid ? "ring-1 ring-red-500 focus:ring-red-500 focus-visible:ring-red-500" : ""} pr-10`}
                      aria-invalid={fieldState.invalid}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              <LoadingSwap isLoading={isSubmitting}>Register</LoadingSwap>
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <Image
              src="/icons/googleIcon.png"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-auto"
            />
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground text-center w-full">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
