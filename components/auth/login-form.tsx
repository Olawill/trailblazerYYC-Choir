"use client";

import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";

import {
  Form,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/actions/login";
import { useTransition, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const LoginForm = () => {
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [codeValue, setCodeValue] = useState("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const data = await login(values, callbackUrl);

      try {
        if (data?.error) {
          form.reset();
          setError(data?.error);
        }

        if (data?.success) {
          form.reset();
          setSuccess(data?.success);
        }

        if (data?.twoFactor) {
          setShowTwoFactor(true);
        }

        if (!data) {
          // window.location.reload();
          window.location.href = callbackUrl || DEFAULT_LOGIN_REDIRECT;
        }
      } catch {
        setError("Something went wrong!");
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial={!showTwoFactor}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {showTwoFactor && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <InputOTP {...field} maxLength={6}>
                        <InputOTPGroup className="flex-1 w-[300px]">
                          <InputOTPSlot className="w-1/6" index={0} />
                          <InputOTPSlot className="w-1/6" index={1} />
                          <InputOTPSlot className="w-1/6" index={2} />
                          <InputOTPSlot className="w-1/6" index={3} />
                          <InputOTPSlot className="w-1/6" index={4} />
                          <InputOTPSlot className="w-1/6" index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      {codeValue === "" ? (
                        <>Enter your one-time code.</>
                      ) : (
                        <>You entered: {codeValue}</>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {!showTwoFactor && (
            <>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="jane@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="flex items-center relative">
                          <Input
                            disabled={isPending}
                            {...field}
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            className="w-full"
                          />
                          {!showPassword ? (
                            <Eye
                              className="w-4 h-4 text-gray-500 absolute right-2 z-50"
                              onClick={() => setShowPassword((prev) => !prev)}
                            />
                          ) : (
                            <EyeOff
                              className="w-4 h-4 text-gray-500 absolute right-2 z-50"
                              onClick={() => setShowPassword((prev) => !prev)}
                            />
                          )}
                        </div>
                      </FormControl>

                      <Button
                        variant="link"
                        size="sm"
                        className="px-0 font-normal"
                        asChild
                      >
                        <Link href="/auth/reset">Forgot password?</Link>
                      </Button>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
          <FormError message={error} />
          <FormSuccess message={success} />

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : showTwoFactor ? (
              "Confirm"
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
