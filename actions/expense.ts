"use server";

import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/client";
import { ExpenseSchema } from "@/schemas";
import { z } from "zod";

export const expense = async (values: z.infer<typeof ExpenseSchema>) => {
  const validatedFields = ExpenseSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid data!" };
  }

  const { amount, description, category, expenseDate } = validatedFields.data;

  console.log(description, category);

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
