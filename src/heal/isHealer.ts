import { Character } from '../character/Character'

export const isHealer = (character: Character) =>
  character.statusEffects?.filter((effect) => effect.name === 'Healer')
    .length ?? 0 > 0
