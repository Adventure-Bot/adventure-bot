import { Character } from '../character/Character'
import { selectHasItemNameInInventory } from '@adventure-bot/store/selectors'
import store from '@adventure-bot/store'
import { isMonster } from '../monster/Monster'

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
