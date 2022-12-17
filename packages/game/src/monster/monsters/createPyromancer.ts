import { dagger } from '@adventure-bot/game/equipment/items'
import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/game/monster'
import { asset, d } from '@adventure-bot/game/utils'

export function createPyromancer(): Monster {
  return createMonster({
    kind: 'Pyromancer',
    name: getRandomMonsterName('Pyromancer'),
    hp: 5,
    maxHP: 5,
    equipment: {
      weapon: dagger(),
    },
    profile: asset('fantasy', 'monsters', 'pyromancer').s3Url,
    xpValue: 2,
    gold: d(8) + 6,
  })
}
