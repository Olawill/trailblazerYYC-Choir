import { auth } from "@/auth";
import TrailBlazerResetPasswordEmail from "@/emails/password-reset";
import TrailBlazerVerifyEmail from "@/emails/two-factor";
import TrailblazerUserEmail from "@/emails/verification";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_API_URL;

const mailerTransporter = async () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "trailblazeryyc@gmail.com",
      pass: process.env.APP_PASS,
    },
  });

  return transporter;
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  const session = await auth();

  // await resend.emails.send({
  //   from: "onboarding@resend.dev",
  //   to: email,
  //   subject: "Confirm your email",
  //   html: `<p>Click <a href=${confirmLink}>here</a> to confirm email.</p>`,
  // });

  const transporter = await mailerTransporter();

  await transporter.sendMail({
    from: "Trailblazer Admin <trailblazeryyc@gmail.com>",
    to: email,
    subject: "Confirm your email",
    html: await render(
      TrailblazerUserEmail({
        username: session?.user.name as string,
        inviteLink: confirmLink,
        inviteFromLocation: "Calgary, AB",
      })
    ),
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  // await resend.emails.send({
  //   from: "onboarding@resend.dev",
  //   to: email,
  //   subject: "Reset your password",
  //   html: `<p>Click <a href=${resetLink}>here</a> to reset your password.</p>`,
  // });

  const transporter = await mailerTransporter();

  await transporter.sendMail({
    from: "Trailblazer Admin <trailblazeryyc@gmail.com>",
    to: email,
    subject: "Reset your password",
    html: await render(
      TrailBlazerResetPasswordEmail({
        userFirstname: "",
        resetPasswordLink: resetLink,
      })
    ),
  });
};

export const sendTwofactorTokenEmail = async (email: string, token: string) => {
  // await resend.emails.send({
  //   from: "onboarding@resend.dev",
  //   to: email,
  //   subject: "2FA Code",
  //   html: `<p>Your 2FA code:<br/><br/> ${token}</p>`,
  // });

  const transporter = await mailerTransporter();

  await transporter.sendMail({
    from: "Trailblazer Admin <trailblazeryyc@gmail.com>",
    to: email,
    subject: "2FA Code",
    html: await render(
      TrailBlazerVerifyEmail({
        verificationCode: token,
      })
    ),
  });
};
