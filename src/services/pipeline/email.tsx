
import { resend } from "@/lib/resend";
import DigestEmail, { Article } from "@/emails/digest-email";

export type SendEmail = {
    userName: string;
    emailTitle: string;
    digests: {
        topic: string;
        topicId: string;
        headline: string;
        consensus: string;
        conflict: string | null;
        signal: string;
        articles: Article[];
    }[];
    baseUrl: string;
    date: string;
    topic: string;
    unsubscribeUrl: string;
}

export async function sendDailyEmail(props: SendEmail) {
    return await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'pritam.das.santuxd@gmail.com',
        subject: 'hello world',
        react: <DigestEmail {...props}/>,
    });
}