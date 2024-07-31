import { UserRole } from "@prisma/client";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  CircleCheck,
  CircleHelp,
  CircleX,
  Timer,
} from "lucide-react";

export const labels = [
  {
    value: "name",
    label: "Name",
  },
  {
    value: "email",
    label: "Email",
  },
  {
    value: "joined_since",
    label: "Date Joined",
  },
  {
    value: "amount_paid",
    label: "Paid",
  },
  {
    value: "amount_owing",
    label: "Owing",
  },
];

export const statuses = [
  {
    value: "active",
    label: "Active",
    icon: CircleCheck,
  },
  {
    value: "inactive",
    label: "Inactive",
    icon: CircleX,
  },
];

export const verification = [
  {
    value: "true",
    label: "Yes",
    icon: CircleCheck,
  },
  {
    value: "false",
    label: "No",
    icon: CircleX,
  },
];

export const Roles = [
  {
    value: "admin",
    label: UserRole.ADMIN,
  },
  {
    value: "user",
    label: UserRole.USER,
  },
  {
    value: "superuser",
    label: UserRole.SUPERUSER,
  },
];

export const months = [
  {
    value: "jan",
    label: "Jan",
  },
  {
    value: "feb",
    label: "Feb",
  },
  {
    value: "mar",
    label: "Mar",
  },
  {
    value: "apr",
    label: "Apr",
  },
  {
    value: "may",
    label: "May",
  },
  {
    value: "jun",
    label: "Jun",
  },
  {
    value: "jul",
    label: "Jul",
  },
  {
    value: "aug",
    label: "Aug",
  },
  {
    value: "sep",
    label: "Sep",
  },
  {
    value: "oct",
    label: "Oct",
  },
  {
    value: "nov",
    label: "Nov",
  },
  {
    value: "dec",
    label: "Dec",
  },
];
