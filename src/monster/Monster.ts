import { Character } from '../character/Character'
import { MonsterKind } from './names/getRandomMonsterName'

export type Monster = Character & {
  kind: MonsterKind
  isMonster: true
}

export const isMonster = (character: Character): character is Monster =>
  character.isMonster ?? false
