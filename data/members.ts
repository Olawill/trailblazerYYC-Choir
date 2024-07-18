"use server";

import { prisma } from "@/lib/client";

export const getMembers = async () => {
  try {
    const members = await prisma.member.findMany();

    return members;
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
