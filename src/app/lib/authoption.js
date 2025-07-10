import CredentialsProvider from "next-auth/providers/credentials";
import { userRepo } from "@/app/lib/db/userRepo";

const authOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }
                const { email, password } = credentials;

                try {
                    const user = await userRepo.authenticate(email, password);
                    return user;
                } catch (error) {
                    console.log("error", error);
                    return null;
                }
            }
        })
    ],
    pages: {
        error: '/login',
        signIn: '/login',
        signOut: '/login',
    },
    session: {
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.role = token.role;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // If the URL is relative, prepend the base URL
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // If the URL is already absolute, return it
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
};

export default authOptions;