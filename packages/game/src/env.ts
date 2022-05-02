import { exit } from 'process'

export const assertEnv: () => void = () => {
  const requiredEnvironmentVars = [
    [
      'BOT_TOKEN',
      '\x1b[43m\x1b[30m ⚠ Discord BOT_TOKEN required \n https://github.com/Adventure-Bot/adventure-bot/blob/main/developer-guide.md#create-your-bot-token \x1b[0m',
    ],
    [
      'CLIENT_ID',
      '\x1b[43m\x1b[30m ⚠ Discord Client ID required \n https://github.com/Adventure-Bot/adventure-bot/blob/main/developer-guide.md \x1b[0m',
    ],
    [
      'GUILD_ID',
      '\x1b[43m\x1b[30m ⚠ Discord Guild ID required \n https://github.com/Adventure-Bot/adventure-bot/blob/main/developer-guide.md \x1b[0m',
    ],
  ]

  let shouldExit = false
  requiredEnvironmentVars.forEach(([key, message]) => {
    if (!(key in process.env)) {
      console.error(message)
      shouldExit = true
    }
  })

  if (shouldExit) exit(1)
}
