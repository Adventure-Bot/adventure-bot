import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/game/monster'
import { asset } from '@adventure-bot/game/utils'

export function createSlime(): Monster {
  return createMonster({
    kind: 'Slime',
    name: getRandomMonsterName('Slime'),
    hp: 24,
    maxHP: 24,
    ac: 7,
    attackBonus: 0,
    damageBonus: 2,
    damageMax: 4,
    gold: Math.floor(Math.random() * 8) + 6,
    profile: asset('fantasy', 'monsters', 'green slime').s3Url,
    xpValue: 4,
  })
}
