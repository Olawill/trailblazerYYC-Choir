import { cn } from "@/lib/utils";
import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import { ArrowRight } from "lucide-react";
import { Poppins } from "next/font/google";
import * as React from "react";

interface TrailblazerUserEmailProps {
  username?: string;
  inviteLink?: string;
  inviteFromLocation?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const TrailblazerUserEmail = ({
  username,
  inviteLink,
  inviteFromLocation,
}: TrailblazerUserEmailProps) => {
  const previewText = `Join TrailBlazer YYC on the Web`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <h1 className={cn("text-2xl text-center font-semibold")}>
                TrailBlazer YYC 🎶
              </h1>
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Join <strong>TrailBlazer YYC</strong> on the <strong>Web</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello{username ? ` ${username}` : ""},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>TrailBlazer YYC</strong> requires you to verify your email
              to get full access to team page.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={inviteLink}
              >
                Confirm Email
              </Button>
              <Text className="text-center text-[#3c4149] text-[12px]">
                This link will only be valid for the next 15 minutes.
              </Text>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              {username && (
                <>
                  This confirmation email was intended for{" "}
                  <span className="text-black">{username}</span>.
                </>
              )}
              This confirmation was sent from{" "}
              <span className="text-black">{inviteFromLocation}</span>. If you
              were not expecting this confirmation, you can ignore this email.
              If you are concerned about your account's safety, please reply to
              this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

TrailblazerUserEmail.PreviewProps = {
  username: "alanturing",
  invitedByUsername: "TrailBlazer YYC",
  invitedByEmail: "trailblazeryyc@gmail.com",
  teamName: "TrailBlazer YYC",
  inviteLink: "https://vercel.com/teams/invite/foo",
  inviteFromLocation: "Calgary, AB",
} as TrailblazerUserEmailProps;

export default TrailblazerUserEmail;
