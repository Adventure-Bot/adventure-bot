import {
  createRandomMonster,
  getRoamingMonsters,
  isMonster,
} from '@adventure-bot/game/monster'
import { MonsterWithStats } from '@adventure-bot/game/store/selectors'
import { randomArrayElement } from '@adventure-bot/game/utils'

export const randomMonster = (): MonsterWithStats => {
  const roamingMonsters = getRoamingMonsters()
  if (roamingMonsters.length && Math.random() <= roamingMonsters.length / 10) {
    console.log('returning existing monster')
    const monster = randomArrayElement(roamingMonsters)
    if (monster && isMonster(monster)) return monster
  }
  console.log('spawning new monster')
  return createRandomMonster()
}
