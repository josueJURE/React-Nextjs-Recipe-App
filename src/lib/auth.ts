import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import  sendEmail from '@/lib/sendEmail/sendEmail'
import prisma from '@/lib/prisma'



export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async({user, url, token}, request) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
   
      })
    },
    onPasswordReset: async({user}, request) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: (profile) => {
        return {
          name: profile.name || `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          emailVerified: profile.email_verified,
          image: profile.picture,
        };
      },
    },
  },

  trustedOrigins: ['http://localhost:3000'],
})
