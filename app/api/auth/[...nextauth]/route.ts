import NextAuth, { AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import SettingsModel from '@/models/Settings';

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret) {
    throw new Error("Proszę zdefiniować zmienną środowiskową NEXTAUTH_SECRET w .env.local");
}

export const authOptions: AuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: { params: { scope: 'identify email guilds guilds.members.read' } },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider !== 'discord' || !profile) {
                return false;
            }

            try {
                await dbConnect();

                const discordProfile = profile as any;
                const accessToken = account.access_token;
                const GUILD_ID = process.env.DISCORD_GUILD_ID!;

                // 1. Znajdź lub stwórz użytkownika w naszej bazie
                let appUser = await UserModel.findOne({ email: discordProfile.email });
                const avatarUrl = `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`;

                if (!appUser) {
                    appUser = new UserModel({
                        nickname: discordProfile.username,
                        email: discordProfile.email,
                        avatar: avatarUrl,
                        role: 'user', // Domyślna rola
                    });
                } else {
                    // Zawsze aktualizuj awatar i nick
                    appUser.avatar = avatarUrl;
                    appUser.nickname = discordProfile.username;
                }

                // 2. Pobierz role z Discorda i ustawienia z naszej bazy
                const roleSettings = await SettingsModel.findOne({ key: 'discordRoles' });
                const discordMemberResponse = await fetch(`https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                // 3. Ustal rolę na podstawie danych z Discorda
                if (discordMemberResponse.ok && roleSettings) {
                    const member = await discordMemberResponse.json();
                    const memberRoles: string[] = member.roles || [];

                    // Sprawdzaj role w kolejności od najważniejszej
                    if (memberRoles.includes(roleSettings.rootRoleId)) {
                        appUser.role = 'root';
                    } else if (memberRoles.includes(roleSettings.adminRoleId)) {
                        appUser.role = 'admin';
                    } else if (memberRoles.includes(roleSettings.adderRoleId)) {
                        appUser.role = 'adder';
                    } else {
                        // Jeśli użytkownik stracił wszystkie specjalne role, a nie jest już rootem,
                        // ustaw go z powrotem na 'user'.
                        if (appUser.role !== 'root') {
                           appUser.role = 'user';
                        }
                    }
                }
                
                // 4. Zapisz zmiany w bazie
                await appUser.save();

                // 5. KLUCZOWA ZMIANA: Zaktualizuj obiekt `user` sesji NAJNOWSZYMI danymi z bazy
                // To gwarantuje, że JWT i sesja klienta dostaną świeże dane.
                (user as any).id = appUser._id.toString();
                (user as any).role = appUser.role;
                (user as any).name = appUser.nickname;
                (user as any).image = appUser.avatar;

                return true; // Zezwól na logowanie

            } catch (error) {
                console.error("Błąd krytyczny podczas logowania:", error);
                return false; // Zablokuj logowanie w razie błędu
            }
        },
        
        jwt({ token, user }) {
            // Jeśli obiekt `user` został zaktualizowany w `signIn`,
            // te dane zostaną przekazane do tokenu.
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.name = user.name;
                token.picture = user.image;
            }
            return token;
        },

        session({ session, token }) {
            // Przepisz dane z tokenu do finalnego obiektu sesji
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.role = token.role as 'root' | 'admin' | 'adder' | 'user';
                session.user.name = token.name;
                session.user.image = token.picture;
            }
            return session;
        },
    },
    session: { strategy: 'jwt' },
    secret: nextAuthSecret,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };