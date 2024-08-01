import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface TrailBlazerResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const TrailBlazerResetPasswordEmail = ({
  userFirstname,
  resetPasswordLink,
}: TrailBlazerResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>TrailBlazer YYC reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <h1 className="text-2xl text-center font-semibold">
            TrailBlazer YYC 🎶
          </h1>
          <Section>
            {userFirstname && <Text style={text}>Hi {userFirstname},</Text>}
            <Text style={text}>
              Someone recently requested a password change for your{" "}
              <strong>TrailBlazer YYC</strong> account. If this was you, you can
              set a new password here:
            </Text>
            <Button style={button} href={resetPasswordLink}>
              Reset password
            </Button>
            <Text style={paragraph}>
              This link will only be valid for the next 15 minutes.
            </Text>
            <Text style={text}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Text style={text}>
              To keep your account secure, please don&apos;t forward this email
              to anyone.
            </Text>
            <Text style={text}>Happy Boomboxing!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

TrailBlazerResetPasswordEmail.PreviewProps = {
  userFirstname: "Alan",
  resetPasswordLink: "https://dropbox.com",
} as TrailBlazerResetPasswordEmailProps;

export default TrailBlazerResetPasswordEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const anchor = {
  textDecoration: "underline",
};
