"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LoginForm } from "@/components/auth/login-form";
import NewMemberForm from "@/components/members/new-member/new-member-form";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type HeaderProps = {
  label: string;
  action?: "Add" | "Create";
};

// const queryClient = new QueryClient();

export const Header = ({ label, action }: HeaderProps) => {
  const user = useCurrentUser();

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{label}</h1>
        {action && (
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button">
                <Plus className="w-4 h-4 mr-1" />
                {`${action} ${label}`}
              </Button>
            </DialogTrigger>
            {user ? (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New {label}</DialogTitle>
                  <DialogDescription>
                    Add new {label.toLowerCase()} here. Click save when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <Separator className="my-2" />
                {label === "Members" ? <NewMemberForm /> : ""}
              </DialogContent>
            ) : (
              <DialogContent className="p-0 w-auto bg-transparent border-none">
                <LoginForm />
              </DialogContent>
            )}
          </Dialog>
        )}
      </div>
      <Separator className="my-6" />
    </div>
  );
};
