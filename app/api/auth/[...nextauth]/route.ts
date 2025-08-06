import NextAuth, { AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import axios from 'axios';

// Definicja mapowania ról z Discorda na role w aplikacji
const ROLE_MAPPINGS: { [discordRoleId: string]: string } = {
    "ID_ROLI_ROOT_Z_DISCORDA": "root",
    "ID_ROLI_ADMIN_Z_DISCORDA": "admin",
    "ID_ROLI_ADDER_Z_DISCORDA": "adder",
};

export const authOptions: AuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            // Zakresy uprawnień, o które prosimy użytkownika
            authorization: { params: { scope: 'identify guilds.join' } },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (account && profile) {
                await dbConnect();
                
                // Pobierz role użytkownika z serwera Discord
                const discordRoles = await getDiscordRoles(profile.id);

                // Znajdź najwyższą rangę użytkownika zgodnie z mapowaniem
                const appRole = mapDiscordRolesToAppRole(discordRoles);

                if (!appRole) {
                     throw new Error("Brak wymaganej roli na serwerze Discord.");
                }

                // Zapisz lub zaktualizuj użytkownika w lokalnej bazie danych
                const dbUser = await UserModel.findOneAndUpdate(
                    { nickname: profile.username }, // Używamy nazwy z Discorda jako unikalnego identyfikatora
                    {
                        nickname: profile.username,
                        role: appRole,
                        status: 'aktywny', // Każdy zalogowany jest aktywny
                        // Możesz tu zapisać więcej danych, np. discordId: profile.id
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
                
                // Przypisz dane do tokenu JWT
                token.id = dbUser._id.toString();
                token.role = dbUser.role;
                token.name = dbUser.nickname;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as 'root' | 'admin' | 'adder';
                session.user.name = token.name as string;
            }
            return session;
        },
    },
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
        error: '/login', // Przekieruj na stronę logowania w razie błędu
    },
};

// Funkcja pomocnicza do pobierania ról z Discord API
async function getDiscordRoles(userId: string): Promise<string[]> {
    const guildId = process.env.DISCORD_GUILD_ID;
    const botToken = process.env.DISCORD_BOT_TOKEN;
    const url = `https://discord.com/api/v10/guilds/${guildId}/members/${userId}`;

    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bot ${botToken}` }
        });
        return response.data.roles || [];
    } catch (error) {
        console.error("Błąd podczas pobierania ról z Discorda:", error);
        return [];
    }
}

// Funkcja pomocnicza do mapowania ról
function mapDiscordRolesToAppRole(discordRoles: string[]): string | null {
    // Sprawdzamy w kolejności od najważniejszej roli do najmniej ważnej
    if (discordRoles.includes("ID_ROLI_ROOT_Z_DISCORDA")) return "root";
    if (discordRoles.includes("ID_ROLI_ADMIN_Z_DISCORDA")) return "admin";
    if (discordRoles.includes("ID_ROLI_ADDER_Z_DISCORDA")) return "adder";
    
    return null; // Brak pasującej roli
}


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };