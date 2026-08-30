import { resend } from "@/lib/ resend";

export async function sendDailyEmail(params:type) {
    await resend.emails.send({
        from: 'you@example.com',
        to: 'user@gmail.com',
        subject: 'hello world',
        react: <Email url="https://example.com" />,
      });
}
