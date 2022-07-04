import { Character } from '@adventure-bot/game/character'
import { MonsterKind } from '@adventure-bot/game/monster'
import { MonsterWithStats } from '@adventure-bot/game/store/selectors'

export type Monster = Character & {
  kind: MonsterKind
  isMonster: true
}

export const isMonster = (
  character: Character
): character is MonsterWithStats => character.isMonster ?? false
