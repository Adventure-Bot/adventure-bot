import { dagger } from '@adventure-bot/equipment/items'
import { Monster } from '@adventure-bot/monster/Monster'
import { createMonster } from '@adventure-bot/monster/createMonster'
import { getRandomMonsterName } from '@adventure-bot/monster/names/getRandomMonsterName'
import { getAsset } from '@adventure-bot/utils'

export function createGoblin(): Monster {
  return createMonster({
    kind: 'Goblin',
    name: getRandomMonsterName('Goblin'),
    hp: 5,
    maxHP: 5,
    equipment: {
      weapon: dagger(),
    },
    asset: getAsset('fantasy', 'monsters', 'goblin').values,
    xpValue: 2,
    gold: Math.floor(Math.random() * 8) + 6,
  })
}
