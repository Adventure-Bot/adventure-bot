import { randomUUID } from 'crypto'

import { Character, defaultCharacter } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import {
  CharacterWithStats,
  selectCharacterStats,
} from '@adventure-bot/game/store/selectors'
import { created } from '@adventure-bot/game/store/slices/characters'

export const createCharacter = (
  character: Partial<Character> & { name: string }
): CharacterWithStats => {
  const state = store.getState()
  const newCharacter: Character = {
    ...defaultCharacter,
    id: character?.id ?? randomUUID(),
    ...character,
  }
  const characterWithStats: CharacterWithStats = {
    ...newCharacter,
    stats: selectCharacterStats(state, newCharacter),
    statsModified: selectCharacterStats(state, newCharacter, true),
  }

  store.dispatch(created(characterWithStats))
  console.log(`created ${newCharacter.id}`)
  return characterWithStats
}
