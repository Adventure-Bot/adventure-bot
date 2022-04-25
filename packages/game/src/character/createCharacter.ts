import { randomUUID } from 'crypto'

import {
  Character,
  Stats,
  defaultCharacter,
  getCharacterStatModifier,
  stats,
} from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'
import { created } from '@adventure-bot/game/store/slices/characters'

export const createCharacter = (
  character: Partial<Character> & { name: string }
): CharacterWithStats => {
  const newCharacter: Character = {
    ...defaultCharacter,
    id: character?.id ?? randomUUID(),
    ...character,
  }
  const characterWithStats: CharacterWithStats = {
    ...newCharacter,
    stats: characterStats(newCharacter),
    statsModified: characterStats(newCharacter, true),
  }

  store.dispatch(created(characterWithStats))
  console.log(`created ${newCharacter.id}`)
  return characterWithStats
}

const characterStats = (character: Character, includeModifiers = true): Stats =>
  stats.reduce(
    (acc, stat) => ({
      ...acc,
      [stat]:
        (character[stat] ?? 0) +
        (includeModifiers ? getCharacterStatModifier(character, stat) : 0),
    }),
    {} as Stats
  )
