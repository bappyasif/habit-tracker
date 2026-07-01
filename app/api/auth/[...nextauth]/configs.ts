import { randomBytes, randomUUID } from "crypto";
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

    // session: {
    //     // Choose how you want to save the user session.
    //     // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    //     // If you use an `adapter` however, we default it to `"database"` instead.
    //     // You can still force a JWT session by explicitly defining `"jwt"`.
    //     // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    //     // which is used to look up the session in the database.
    //     strategy: "database",

    //     // Seconds - How long until an idle session expires and is no longer valid.
    //     maxAge: 30 * 24 * 60 * 60, // 30 days

    //     // Seconds - Throttle how frequently to write to database to extend a session.
    //     // Use it to limit write operations. Set to 0 to always update the database.
    //     // Note: This option is ignored if using JSON Web Tokens
    //     updateAge: 24 * 60 * 60, // 24 hours

    //     // The session token is usually either a random UUID or string, however if you
    //     // need a more customized session token string, you can define your own generate function.
    //     generateSessionToken: () => {
    //         return randomUUID?.() ?? randomBytes(32).toString("hex")
    //     }
    // },
    
    // pages: {
    //     signIn: '/auth/signin',
    //     signOut: '/auth/signout',
    //     error: '/auth/error', // Error code passed in query string as ?error=
    //     verifyRequest: '/auth/verify-request', // (used for check email message)
    //     newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    // }
}