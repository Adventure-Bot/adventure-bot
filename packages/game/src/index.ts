import {
  createClient,
  gameClock,
  waitForWinner,
} from '@adventure-bot/game/boot'

export const startGameService: (gameOptions: {
  clientId: string
  token: string
  channelId: string
}) => ReturnType<typeof createClient> = async ({
  clientId,
  token,
  channelId,
}) =>
  createClient({
    type: 'discord',
    token,
    clientId,
    channelId,
    onError: (e) => console.error('Discord client error!', e),

    onReady: (client) => {
      gameClock()
      waitForWinner(client)
    },
  })
