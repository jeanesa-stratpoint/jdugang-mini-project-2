import {
  Body,
  Button,
  Container,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  resetLink: string;
  userName?: string;
}

export default function ResetPasswordEmail({
  resetLink,
  userName,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Preview>Reset your password for I Am Grateful For...</Preview>

      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                page: "#E2E7E1",
                ink: "#1C4F4A",
                card: "#F7F6F3",
                btn: "#85BFBB",
              },
              fontFamily: {
                title: ["Merriweather", "serif"],
                body: ["Merriweather", "serif"],
              },
              boxShadow: {
                card: "0 10px 20px rgba(0,0,0,0.15)",
              },
            },
          },
        }}
      >
        <Body className="m-0 bg-page font-body">
          {/* Title (outside card) */}
          <Section className="w-full">
            <Container className="mx-auto max-w-170 px-4">
              <Heading className="mt-20 mb-8 text-center italic font-title text-[44px] leading-none font-normal text-ink">
                I Am Grateful For...
              </Heading>
            </Container>
          </Section>

          {/* Card */}
          <Section className="w-full">
            <Container className="mx-auto max-w-170 px-4">
              <Container className="bg-card rounded-2xl shadow-card border border-black/5 px-12 py-10">
                <Text className="m-0 mb-6 text-[18px] leading-7 text-ink italic">
                  Hello Friend{" "}
                  <span className="not-italic font-semibold">@{userName}</span>
                </Text>

                <Text className="m-0 mb-10 text-[18px] leading-8 text-ink italic">
                  Someone recently requested a password change for your account.
                  If this was you, you can set a new password here:
                </Text>

                <Section className="text-center mb-12">
                  <Button
                    href={resetLink}
                    className="bg-btn text-white no-underline font-semibold text-[18px] px-8 py-2 rounded-md"
                  >
                    Reset Password
                  </Button>
                </Section>

                <Text className="m-0 mb-10 text-[18px] leading-8 text-ink italic">
                  If you don&apos;t want to change your password or didn&apos;t
                  request this, just{" "}
                  <span className="not-italic font-extrabold">ignore</span> and{" "}
                  <span className="not-italic font-extrabold">delete</span> this
                  message.
                </Text>

                <Hr className="border-0 border-t border-black/10 my-6" />

                <Text className="m-0 text-center text-[14px] leading-6 text-ink/60 italic">
                  © 2026 I Am Grateful For. All rights reserved.
                </Text>
              </Container>
            </Container>
          </Section>

          <Section className="h-24" />
        </Body>
      </Tailwind>
    </Html>
  );
}
