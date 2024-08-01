import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finance | Trailblazer YYC",
  description:
    "View the groups financial breakdowns here, including payments, expenses and account balance.",
};

interface FinanceLayoutProps {
  children: React.ReactNode;
}

export default function FinanceLayout({ children }: FinanceLayoutProps) {
  return <>{children}</>;
}
