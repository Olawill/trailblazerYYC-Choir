"use client";

import { useRouter } from "next/navigation";

const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProp) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return <span>TODO: Implement modal</span>;
  }
  return (
    <span className="w-full cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
};

export default LoginButton;
