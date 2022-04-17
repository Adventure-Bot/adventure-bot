import { dagger } from '@adventure-bot/game/equipment/items'
import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/game/monster'
import { asset, d } from '@adventure-bot/game/utils'

export function createGoblin(): Monster {
  return createMonster({
    kind: 'Goblin',
    name: getRandomMonsterName('Goblin'),
    hp: 5,
    maxHP: 5,
    equipment: {
      weapon: dagger(),
    },
    profile: asset('fantasy', 'monsters', 'goblin').s3Url,
    xpValue: 2,
    gold: d(8) + 6,
  })
}
