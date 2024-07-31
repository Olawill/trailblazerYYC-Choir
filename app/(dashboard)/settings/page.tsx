"use client";

import { settings } from "@/actions/settings";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SettingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ImageUpload } from "./_components/image-upload";

const SettingsPage = () => {
  const user = useCurrentUser();

  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const [changePassword, setChangePassword] = useState(false);

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
      image: user?.image || undefined,
    },
  });

  const handlePasswordChange = () => {
    setChangePassword(true);
  };

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setSuccess(data.success);
          }

          if (data.success) {
            update();
            setSuccess(data.success);
            setError(data.error);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-gray-300">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Jane Doe"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription className="text-gray-300">
                  This is your public display name. It can be your real name or
                  a pseudonym.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormDescription className="text-gray-300">
                  Update Profile Image.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {user?.isOAuth === false ? (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="janeDoe@example.com"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-300">
                      This is the email associated with your account. You can
                      modify your email here.
                    </FormDescription>
                    <FormMessage />
                  </>
                </FormItem>
              )}
            />
          ) : (
            <div className="space-y-2">
              <FormLabel>Email</FormLabel>
              <p className="text-sm font-normal border p-2 rounded-md">
                {user?.email}
              </p>
              <FormDescription className="text-gray-300">
                This is the email associated with your account. It cannot be
                modified.
              </FormDescription>
            </div>
          )}

          {user?.isOAuth === false && (
            <>
              {!changePassword ? (
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <span
                    onClick={handlePasswordChange}
                    className="cursor-pointer text-sm font-semibold border border-transparent p-2 rounded-md hover:bg-black hover:text-white"
                  >
                    Change Password
                  </span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="********"
                              {...field}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              autoComplete="off"
                              placeholder="********"
                              {...field}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-slate-100 p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Two Factor Authentication</FormLabel>
                      <FormDescription className="text-gray-300">
                        Enable two-factor authentication for your account.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="2FA"
                          disabled={isPending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="2FA">
                          <Badge
                            variant={field.value ? "success" : "destructive"}
                          >
                            {field.value ? "Enabled" : "Disabled"}
                          </Badge>
                        </Label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}

          {(success || error) && (
            <div className="bg-white rounded-md">
              {error && <FormError message={error} />}
              {success && <FormSuccess message={success} />}
            </div>
          )}
          <Button type="submit" disabled={isPending} className="w-32">
            {isPending ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Update profile"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SettingsPage;
