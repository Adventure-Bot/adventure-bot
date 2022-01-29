import dotenv from 'dotenv'
import workspace from 'find-yarn-workspace-root'
import { existsSync } from 'fs'
import path from 'path'
import { exit } from 'process'

const envPath = path.join(workspace() ?? process.cwd(), '.env')
dotenv.config({
  path: envPath,
})

import { startGameService } from '../src'

if (!existsSync(envPath)) {
  console.error(
    '\x1b[43m\x1b[30m ⚠ Environment config required \n https://github.com/Adventure-Bot/adventure-bot/blob/main/developer-guide.md#setup-your-env \x1b[0m'
  )
  exit(1)
}

if (!process.env.token) {
  console.error(
    '\x1b[43m\x1b[30m ⚠ Discord token required \n https://github.com/Adventure-Bot/adventure-bot/blob/main/developer-guide.md#create-your-bot-token \x1b[0m'
  )
  exit(1)
}

startGameService({
  clientId: String(process.env.CLIENT_ID),
  token: String(process.env.token),
  channelId: String(process.env.GUILD_ID),
})
