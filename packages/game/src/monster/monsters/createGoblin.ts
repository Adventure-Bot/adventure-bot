import { dagger } from '@adventure-bot/game/equipment'
import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/game/monster'
import { asset } from '@adventure-bot/game/utils'

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
