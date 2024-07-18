"use server";

import { prisma } from "@/lib/client";

export const getMembers = async () => {
  try {
    const members = await prisma.member.findMany({
      include: {
        payments: {
          select: {
            amount: true,
          },
        },
      },
    });

    const membersWithTotalPayments = members.map(
      ({ id, name, email, isActive, dateJoined, updatedAt, payments }) => {
        const totalPayments = payments.reduce(
          (acc, payment) => acc + payment.amount,
          0
        );

        return {
          id,
          name,
          email,
          isActive,
          dateJoined,
          updatedAt,
          amountPaid: totalPayments,
        };
      }
    );

    return membersWithTotalPayments;
  } catch {
    return null;
  }
};

export const getMemberDue = async () => {
  try {
    const due = await prisma.due.findFirst();

    return due;
  } catch {
    return null;
  }
};

export const getExpenseCategories = async () => {
  try {
    const categories = await prisma.expense.findMany({
      select: {
        id: true,
        category: true,
      },
    });

    return categories;
  } catch {
    return null;
  }
};
