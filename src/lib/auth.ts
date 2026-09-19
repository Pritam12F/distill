import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { headers } from "next/headers";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    deleteUser: {
      enabled: true,
      // sendDeleteAccountVerification: async (
      //   {
      //     user, // The user object
      //     url, // The auto-generated URL for deletion
      //     token, // The verification token  (can be used to generate custom URL)
      //   },
      //   request, // The original request object (optional)
      // ) => {
      //   // Your email sending logic here
      //   // Example: sendEmail(data.user.email, "Verify Deletion", data.url);
      // },
    },
  },
});

export const getSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
};
