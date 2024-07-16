"use client";

import { ExpenseForm } from "@/components/admin/expense-form";
import { PaymentForm } from "@/components/admin/payment-form";
import { RoleGate } from "@/components/auth/role-gate";
import { FormError } from "@/components/form-error";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";

const types = [
  { value: "payment", label: "Payment" },
  { value: "expense", label: "Expense" },
];

const MemberDues = () => {
  const role = useCurrentRole();

  if (role !== UserRole.ADMIN) {
    return (
      <FormError message="You do not have permission to view this page." />
    );
  }

  return (
    <Card className="w-full bg-blue-300 border-px">
      <CardHeader>
        <p className="text-2xl font-semibold">Manage Finances</p>
        <CardDescription>Manage the team finance here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator className="mb-2" />
        <RoleGate allowedRole={[UserRole.ADMIN]} onPage>
          <Tabs defaultValue={types[0].value}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-500 text-white">
              <TabsTrigger value={types[0].value} className="font-bold">
                {types[0].label}
              </TabsTrigger>
              <TabsTrigger value={types[1].value} className="font-bold">
                {types[1].label}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="payment">
              <PaymentForm />
            </TabsContent>
            <TabsContent value="expense">
              <ExpenseForm />
            </TabsContent>
          </Tabs>
        </RoleGate>
      </CardContent>
    </Card>
  );
};

export default MemberDues;
