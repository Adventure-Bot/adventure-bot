import { Monster } from '@adventure-bot/monster/Monster'
import { createMonster } from '@adventure-bot/monster/createMonster'
import { getRandomMonsterName } from '@adventure-bot/monster/names/getRandomMonsterName'
import { getAsset } from '@adventure-bot/utils'

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
    asset: getAsset('fantasy', 'monsters', 'green slime').values,
    xpValue: 4,
  })
}
