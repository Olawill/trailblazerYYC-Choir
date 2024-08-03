import bcrypt from "bcryptjs";

export const saltAndHashPassword = async (password: any) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const comparePassword = async (password: any, hash: any) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};

export const monthDiff = (startDate: Date, endDate: Date) => {
  return Math.max(
    0,
    (endDate.getFullYear() - startDate.getFullYear()) * 12 -
      startDate.getUTCMonth() +
      endDate.getUTCMonth() +
      1
  );
};

export const amountOwing = (
  startDate: Date,
  endDate: Date,
  paid: number,
  due: number
) => {
  let totalOwed: number = 0;
  const monthsDiff = monthDiff(startDate, new Date());

  if (startDate < new Date("January 1, 2023")) {
    const temp = new Date("January 1, 2023");
    totalOwed = monthDiff(temp, endDate) * due;
  } else {
    totalOwed = monthDiff(startDate, endDate) * due;
  }
  // if (monthsDiff === 0) {
  //   totalOwed = 1 * due;
  // }

  return totalOwed - paid;
};
