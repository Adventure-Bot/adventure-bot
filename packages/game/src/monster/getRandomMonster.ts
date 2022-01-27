import {
  Monster,
  createRandomMonster,
  getRoamingMonsters,
  isMonster,
} from '@adventure-bot/game/monster'
import { randomArrayElement } from '@adventure-bot/game/utils'

export const getRandomMonster = (): Monster => {
  const roamingMonsters = getRoamingMonsters()
  if (roamingMonsters.length && Math.random() <= roamingMonsters.length / 10) {
    console.log('returning existing monster')
    const monster = randomArrayElement(roamingMonsters)
    if (monster && isMonster(monster)) return monster
  }
  console.log('spawning new monster')
  return createRandomMonster()
}
