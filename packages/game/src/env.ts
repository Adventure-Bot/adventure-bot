import dotenv from 'dotenv'
import workspace from 'find-yarn-workspace-root'
import { existsSync } from 'fs'
import path from 'path'
import { exit } from 'process'

export const prepareEnv: () => void = () => {
  const envPath = path.join(workspace() ?? process.cwd(), '.env')
  if (!existsSync(envPath)) {
    console.error(
      '\x1b[43m\x1b[30m ⚠ Environment config required \n https://github.com/Adventure-Bot/adventure-bot/blob/main/developer-guide.md#setup-your-env \x1b[0m'
    )
    exit(1)
  }

  dotenv.config({
    path: envPath,
  })

  const requiredEnvironmentVars = [
    [
      'token',
      '\x1b[43m\x1b[30m ⚠ Discord bot token required \n https://github.com/Adventure-Bot/adventure-bot/blob/main/developer-guide.md#create-your-bot-token \x1b[0m',
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
