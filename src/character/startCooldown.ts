import { Character } from './Character'
import store from '../store'
import { cooldownStarted } from '../store/slices/characters'

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
