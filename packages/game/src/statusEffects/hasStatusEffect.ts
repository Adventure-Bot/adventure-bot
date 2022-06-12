import { Character } from '@adventure-bot/game/character'
import { selectCharacterEffects } from '@adventure-bot/game/store/selectors'

export function hasStatusEffect({
  character, // TODO: pass characterId: string instead
  name,
}: {
  character: Character
  name: string
}): boolean {
  return selectCharacterEffects(character.id).some(
    (effect) => effect.name === name
  )
}
