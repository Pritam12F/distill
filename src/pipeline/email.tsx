import { resend } from "@/lib/resend";
import { DigestEmail } from "@/emails/digest-email";
import { SendEmail } from "@/types/email";

export async function sendDailyEmail(props: SendEmail) {
  try {
    return await resend.emails.send({
      from: "pritam@distill.devzy.live",
      to: props.userEmail,
      subject: `Your daily digests on ${props.digests
        .slice(0, 2)
        .map((d) => d.topic.trim().toLowerCase())
        .join(", ")
        .concat(" and more...")}`,
      react: <DigestEmail {...props} />,
    });
  } catch (err) {
    console.error(
      `${err instanceof Error ? err.message : "Unknown error sending email"}`,
    );

    return null;
  }
}
