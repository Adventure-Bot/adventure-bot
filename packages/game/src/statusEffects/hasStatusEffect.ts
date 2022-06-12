import { selectCharacterEffects } from '@adventure-bot/game/store/selectors'

export function hasStatusEffect({
  characterId,
  name,
}: {
  characterId: string
  name: string
}): boolean {
  return selectCharacterEffects(characterId).some(
    (effect) => effect.name === name
  )
}
