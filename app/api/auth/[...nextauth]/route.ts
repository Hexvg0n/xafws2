// app/api/auth/[...nextauth]/route.ts

import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret) {
    throw new Error("Proszę zdefiniować zmienną środowiskową NEXTAUTH_SECRET w .env.local");
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            // ZMIANA: credentials teraz akceptują 'nickname'
            credentials: {
                nickname: { label: "Nickname", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.nickname || !credentials?.password) return null;
                
                await dbConnect();
                // ZMIANA: Szukamy użytkownika po 'nickname'
                const user = await UserModel.findOne({ nickname: credentials.nickname });

                if (user && bcrypt.compareSync(credentials.password, user.password)) {
                    if (user.status !== 'aktywny') {
                        throw new Error(`Konto jest ${user.status}.`);
                    }
                    return {
                        id: user._id.toString(),
                        name: user.nickname, // ZMIANA: Przekazujemy nickname jako 'name'
                        role: user.role,
                        status: user.status,
                    };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.name = user.name; // Upewniamy się, że nickname jest w tokenie
            }
            return token;
        },
        session({ session, token }: { session: any, token: any }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.name = token.name; // I w sesji
            }
            return session;
        },
    },
    session: { strategy: 'jwt' as const },
    secret: nextAuthSecret,
    pages: { signIn: '/login' },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };