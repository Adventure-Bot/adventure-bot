import { longsword } from '@adventure-bot/game/equipment/items'
import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/game/monster'
import { asset } from '@adventure-bot/game/utils'

export function createOrc(): Monster {
  return createMonster({
    kind: 'Orc',
    name: getRandomMonsterName('Orc'),
    hp: 12,
    maxHP: 12,
    ac: 13,
    damageBonus: 2,
    equipment: {
      weapon: longsword(),
    },
    profile: asset('fantasy', 'monsters', 'orc').s3Url,
    xpValue: 15,
    gold: Math.floor(Math.random() * 20) + 15,
  })
}
