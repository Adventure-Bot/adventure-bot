import { Character } from '@adventure-bot/game/character'
import { isMonster } from '@adventure-bot/game/monster'
import store from '@adventure-bot/game/store'
import { selectHasItemNameInInventory } from '@adventure-bot/game/store/selectors'

export const decoratedName = (character: Character): string => {
  const crown = selectHasItemNameInInventory(
    store.getState(),
    character,
    'heavy crown'
  )
    ? '👑'
    : false
  const kind =
    isMonster(character) && character.kind ? `the ${character.kind}` : false
  return [crown, character.name, kind].filter(Boolean).join(' ')
}
