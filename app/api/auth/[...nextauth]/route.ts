// app/api/auth/[...nextauth]/route.ts

import NextAuth, { AuthOptions } from 'next-auth';
import DiscordProvider, { DiscordProfile } from 'next-auth/providers/discord';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import SettingsModel from '@/models/Settings';
import axios from 'axios';

const ROLE_HIERARCHY = ["root", "admin", "adder", "user"];

const getRoleMappings = async () => {
    await dbConnect();
    const settings = await SettingsModel.findOne({ key: 'discordRoles' });
    if (!settings) {
        console.error("Brak skonfigurowanych ról w panelu admina. Logowanie z uprawnieniami niemożliwe.");
        return {};
    }
    return {
        [settings.rootRoleId]: "root",
        [settings.adminRoleId]: "admin",
        [settings.adderRoleId]: "adder",
    };
};

export const authOptions: AuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: { params: { scope: 'identify guilds.join' } },
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account && profile) {
                const discordProfile = profile as DiscordProfile;
                await dbConnect();
                
                const roleMappings = await getRoleMappings();
                const discordRoles = await getDiscordRoles(discordProfile.id);
                
                // ZMIANA: Przypisujemy rolę 'user', jeśli nie znaleziono innej
                let appRole = mapDiscordRolesToAppRole(discordRoles, roleMappings);
                if (!appRole) {
                    // Sprawdzamy, czy użytkownik jest na serwerze (ma jakąkolwiek rolę)
                    if (discordRoles.length === 0) {
                        throw new Error("Użytkownik nie jest na serwerze Discord.");
                    }
                    appRole = 'user'; // Domyślna rola dla każdego członka serwera
                }

                const dbUser = await UserModel.findOneAndUpdate(
                    { nickname: discordProfile.username },
                    {
                        nickname: discordProfile.username,
                        email: discordProfile.email,
                        avatar: discordProfile.image_url,
                        role: appRole,
                        status: 'aktywny',
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
                
                token.id = dbUser._id.toString();
                token.role = dbUser.role;
                token.name = dbUser.nickname;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as 'root' | 'admin' | 'adder' | 'user';
                session.user.name = token.name as string;
            }
            return session;
        },
    },
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
        error: '/unauthorized', // Przekierowujemy na dedykowaną stronę błędu
    },
};

async function getDiscordRoles(userId: string): Promise<string[]> {
    const guildId = process.env.DISCORD_GUILD_ID;
    const botToken = process.env.DISCORD_BOT_TOKEN;
    if (!guildId || !botToken) return [];
    const url = `https://discord.com/api/v10/guilds/${guildId}/members/${userId}`;

    try {
        const response = await axios.get(url, { headers: { 'Authorization': `Bot ${botToken}` } });
        return response.data.roles || [];
    } catch (error) {
        console.error("Błąd podczas pobierania ról z Discorda. Użytkownik prawdopodobnie nie jest na serwerze.");
        return []; // Zwracamy pustą tablicę, co oznacza, że użytkownik nie jest na serwerze
    }
}

function mapDiscordRolesToAppRole(discordRoles: string[], roleMappings: { [key: string]: string }): string | null {
    const userAppRoles = discordRoles.map(roleId => roleMappings[roleId]).filter(Boolean);
    for (const role of ROLE_HIERARCHY) {
        if (userAppRoles.includes(role)) {
            return role;
        }
    }
    return null;
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };