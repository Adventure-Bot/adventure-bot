import { CommandInteraction } from 'discord.js'

import { Character } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { cooldownStarted } from '@adventure-bot/game/store/slices/characters'

export function startCooldown({
  characterId,
  cooldown,
  interaction,
}: {
  characterId: string
  cooldown: keyof Character['cooldowns']
  interaction: CommandInteraction
}): void {
  store.dispatch(
    cooldownStarted({
      characterId,
      cooldown,
      interaction,
    })
  )
}
