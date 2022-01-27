import { Character } from '@adventure-bot/character'
import { isMonster } from '@adventure-bot/monster'
import store from '@adventure-bot/store'
import { selectHasItemNameInInventory } from '@adventure-bot/store/selectors'

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
