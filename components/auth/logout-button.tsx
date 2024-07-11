"use client";

import { signOut } from "next-auth/react";

export const LogoutButton = ({ children }: { children: React.ReactNode }) => {
  const onClick = () => {
    signOut();
  };

  return (
    <span className="w-full cursor-pointer " onClick={onClick}>
      {children}
    </span>
  );
};
