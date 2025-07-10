import NextAuth, { NextAuthOptions } from 'next-auth';
import authOptions from "@/app/lib/authoption";

const handler = NextAuth(authOptions as NextAuthOptions);
export { handler as GET, handler as POST };