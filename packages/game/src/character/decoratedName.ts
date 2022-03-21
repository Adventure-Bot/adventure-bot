import { Character } from '@adventure-bot/game/character'
import { isMonster } from '@adventure-bot/game/monster'
import store from '@adventure-bot/game/store'
import { selectHasItemNameInInventory } from '@adventure-bot/game/store/selectors'

const xpSuffix = (xp: number) => {
  switch (true) {
    case xp == 0:
    default:
      return ''
    case xp <= Math.pow(10, 1):
      return 'the Apprentice'
    case xp <= Math.pow(10, 2):
      return 'the Journeyman'
    case xp <= Math.pow(10, 3):
      return 'the Expert'
    case xp <= Math.pow(10, 4):
      return 'the Master'
    case xp <= Math.pow(10, 5):
      return 'the Grandmaster'
    case xp <= Math.pow(10, 6):
      return 'the Legendary'
    case xp <= Math.pow(10, 7):
      return 'the Mythic'
    case xp <= Math.pow(10, 8):
      return 'the Immortal'
    case xp <= Math.pow(10, 9):
      return 'the Godlike'
  }
}

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
  return [crown, character.name, xpSuffix(character.xp), kind]
    .filter(Boolean)
    .join(' ')
}
