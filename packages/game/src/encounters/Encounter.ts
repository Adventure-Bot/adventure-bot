import { AttackResult } from '@adventure-bot/game/attack'
import { LootResult } from '@adventure-bot/game/character'

export type Encounter = {
  id: string
  characterId: string
  monsterId: string
  playerAttacks: AttackResult[]
  monsterAttacks: AttackResult[]
  rounds: number
  date: string
  lootResult?: LootResult
  outcome:
    | 'in progress'
    | 'player victory'
    | 'player defeated'
    | 'player fled'
    | 'monster fled'
    | 'double ko'
}
