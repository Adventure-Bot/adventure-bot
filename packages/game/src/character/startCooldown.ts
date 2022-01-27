import { Character } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { cooldownStarted } from '@adventure-bot/game/store/slices/characters'

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
