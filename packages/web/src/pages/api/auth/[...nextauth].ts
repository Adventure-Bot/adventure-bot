import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

export default NextAuth({
  // https://next-auth.js.org/configuration/options#secret
  secret: 'Nz1gMvgUCxzX34uFsqrjyLnUoCSXADL5qj2YQxMxLhU=',

  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
})
