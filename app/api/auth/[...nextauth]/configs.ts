import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],

    logger: {
        error(code, metadata) {
            console.error(`NextAuth error: ${code}`, metadata);
        },
        debug(code, metadata) {
            console.debug(`NextAuth debug: ${code}`, metadata);
        },
        warn(code) {
            console.warn(`NextAuth warn: ${code}`);
        }
    },

    secret: process.env.NEXTAUTH_SECRET,

    useSecureCookies: process.env.NODE_ENV === "production",
}