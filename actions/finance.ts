"use server";

import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/client";

export const activeMembers = async () => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  const hasPermission = user.role !== "USER";

  if (!hasPermission) {
    return;
  }

  try {
    const data = await prisma.member.count({
      where: {
        isActive: true,
      },
    });

    return data;
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    throw err;
  }
};

export const allMembers = async () => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  const hasPermission = user.role !== "USER";

  if (!hasPermission) {
    return;
  }

  try {
    const data = await prisma.member.count();

    return data;
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    throw err;
  }
};

export const allExpense = async () => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  const hasPermission = user.role !== "USER";

  if (!hasPermission) {
    return;
  }

  try {
    const data = await prisma.expense.aggregate({
      _sum: {
        amount: true,
      },
    });

    return data._sum.amount;
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    throw err;
  }
};

export const allPayments = async () => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  const hasPermission = user.role !== "USER";

  if (!hasPermission) {
    return;
  }

  try {
    const data = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
    });

    return data._sum.amount;
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    throw err;
  }
};

export const recentActivity = async () => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  const hasPermission = user.role !== "USER";

  if (!hasPermission) {
    return;
  }

  try {
    const expenseData = await prisma.expense.findMany({
      select: {
        amount: true,
        description: true,
        category: true,
        expenseDate: true,
      },
      orderBy: {
        expenseDate: "desc",
      },
    });
    const paymentData = await prisma.payment.findMany({
      select: {
        amount: true,
        paymentDate: true,
        member: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        paymentDate: "desc",
      },
    });

    const allActivityLength = expenseData.length + paymentData.length;

    return { numberOfActivity: allActivityLength, expenseData, paymentData };
  } catch (err) {
    // Handle errors appropriately
    console.log("error", err);
    throw err;
  }
};
