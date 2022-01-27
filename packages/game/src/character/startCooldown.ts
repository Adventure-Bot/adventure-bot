import { Character } from '@adventure-bot/character'
import store from '@adventure-bot/store'
import { cooldownStarted } from '@adventure-bot/store/slices/characters'

export function startCooldown({
  characterId,
  cooldown,
}: {
  characterId: string
  cooldown: keyof Character['cooldowns']
}): void {
  store.dispatch(
    cooldownStarted({
      characterId,
      cooldown,
    })
  )
}
