"use server";

import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/client";
import { ExpenseSchema, PaymentSchema } from "@/schemas";
import { z } from "zod";

export const expense = async (values: z.infer<typeof ExpenseSchema>) => {
  const validatedFields = ExpenseSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid data!" };
  }

  const { amount, description, category, expenseDate } = validatedFields.data;

  const user = await currentUser();

  if (!user) {
    return { error: "You are not authorized to perform this action" };
  }

  const hasPermission = user.role !== "USER";

  if (!hasPermission) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.expense.create({
      data: {
        description,
        amount,
        category,
        expenseDate: new Date(expenseDate),
      },
    });

    return { success: "Expense successfully added!" };
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    return { error: "Something went wrong. Please try again!" };
  }
};

export const payment = async (values: z.infer<typeof PaymentSchema>) => {
  const validatedFields = PaymentSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid data!" };
  }

  const { amount, name } = validatedFields.data;

  const user = await currentUser();

  if (!user) {
    return { error: "You are not authorized to perform this action" };
  }

  const hasPermission = user.role !== "USER";

  if (!hasPermission) {
    return { error: "Unauthorized" };
  }

  try {
    const member = await prisma.member.findFirst({
      where: {
        name,
      },
    });

    if (!member) {
      return { error: "Member not found!" };
    }

    await prisma.payment.create({
      data: {
        memberId: member.id,
        amount,
      },
    });

    return { success: "Payment successfully added!" };
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    return { error: "Something went wrong. Please try again!" };
  }
};
