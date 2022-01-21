import { Character } from '@adventure-bot/character/Character'
import { MonsterKind } from '@adventure-bot/monster/names/getRandomMonsterName'

export type Monster = Character & {
  kind: MonsterKind
  isMonster: true
}

export const isMonster = (character: Character): character is Monster =>
  character.isMonster ?? false
