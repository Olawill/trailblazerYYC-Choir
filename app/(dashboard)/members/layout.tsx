import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members | Trailblazer YYC",
  description:
    "View all members of the group and more information including status, outstanding payments, etc.",
};

interface MemberLayoutProps {
  children: React.ReactNode;
}

export default function MemberLayout({ children }: MemberLayoutProps) {
  return <>{children}</>;
}
