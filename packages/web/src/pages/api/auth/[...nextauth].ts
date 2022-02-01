import NextAuth from 'next-auth'

// import DiscordProvider from 'next-auth/providers/discord'

export default NextAuth({
  // https://next-auth.js.org/configuration/options#secret
  secret: 'change-me',

  providers: [
    // DiscordProvider({
    //   clientId: process.env.DISCORD_CLIENT_ID,
    //   clientSecret: process.env.DISCORD_CLIENT_SECRET,
    // }),
  ],
})
