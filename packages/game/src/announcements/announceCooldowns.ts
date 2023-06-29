import { TextChannel } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import { getCooldownRemaining } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { cooldownStarted } from '@adventure-bot/game/store/slices/characters'
import { sleep } from '@adventure-bot/game/utils'

export function announceCooldowns(channel: TextChannel): void {
  startAppListening({
    actionCreator: cooldownStarted,
    effect: async ({ payload: { characterId, cooldown } }) => {
      if (process.env.COOLDOWNS_DISABLED) return
      let remaining = getCooldownRemaining(characterId, cooldown)
      while (remaining) {
        await sleep(remaining)
        remaining = getCooldownRemaining(characterId, cooldown)
      }
      const character = selectCharacterById(store.getState(), characterId)
      if (!character) return
      const user = channel.guild.members.cache.get(character.id)
      if (!user) return
      channel.send(
        `${user}, it's your turn to ${Emoji(cooldown)} \`/${cooldown}\`!`
      )
    },
  })
}
