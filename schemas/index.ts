import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(8, {
    message: "Minimum 8 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Minimum 8 characters required",
  }),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    // role: z.nativeEnum(UserRole),
    email: z.optional(z.string().email()),
    // password: z.optional(z.string().min(8)),
    password: z.string().min(8).optional(),
    newPassword: z.optional(z.string().min(8)),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  );

export const MemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  joined_since: z.date(),
  amount_paid: z.number(),
  amount_owing: z.number(),
  status: z.string(),
});

export type Member = z.infer<typeof MemberSchema>;

export const PaymentSchema = z.object({
  amount: z.coerce.number().min(1, {
    message: "Amount must be greater than $1",
  }),
  name: z.string(),
});

export const ExpenseSchema = z.object({
  amount: z.coerce.number().min(0.01, {
    message: "Amount must be greater than $0",
  }),
  description: z.string(),
  category: z.string(),
  expenseDate: z.date(),
});

export const CategoryModalSchema = z.object({
  newCategory: z.string(),
});
