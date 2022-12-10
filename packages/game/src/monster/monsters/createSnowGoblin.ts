import { dagger } from '@adventure-bot/game/equipment/items'
import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/game/monster'
import { asset, d } from '@adventure-bot/game/utils'

export function createSnowGoblin(): Monster {
  return createMonster({
    kind: 'Snow Goblin',
    name: getRandomMonsterName('Snow Goblin'),
    hp: 10,
    maxHP: 10,
    equipment: {
      weapon: dagger(),
    },
    profile: asset('fantasy', 'monsters', 'snow goblin').s3Url,
    xpValue: 4,
    gold: d(8) + 20,
  })
}
