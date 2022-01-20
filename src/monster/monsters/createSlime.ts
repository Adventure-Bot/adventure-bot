import { createMonster } from '../createMonster'
import { getRandomMonsterName } from '../names/getRandomMonsterName'
import { getAsset } from '../../utils/getAsset'
import { Monster } from '../Monster'

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
