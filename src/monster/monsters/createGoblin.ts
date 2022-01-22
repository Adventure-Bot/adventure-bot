import { dagger } from '@adventure-bot/equipment/items'
import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/monster'
import { asset } from '@adventure-bot/utils'

export function createGoblin(): Monster {
  return createMonster({
    kind: 'Goblin',
    name: getRandomMonsterName('Goblin'),
    hp: 5,
    maxHP: 5,
    equipment: {
      weapon: dagger(),
    },
    asset: asset('fantasy', 'monsters', 'goblin').values,
    xpValue: 2,
    gold: Math.floor(Math.random() * 8) + 6,
  })
}
