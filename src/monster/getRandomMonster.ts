import { getRandomArrayElement } from '@adventure-bot/utils/getRandomArrayElement'
import { getRoamingMonsters } from '@adventure-bot/monster/getRoamingMonsters'
import { isMonster, Monster } from '@adventure-bot/monster/Monster'
import { createRandomMonster } from '@adventure-bot/monster/createRandomMonster'

export const getRandomMonster = (): Monster => {
  const roamingMonsters = getRoamingMonsters()
  if (roamingMonsters.length && Math.random() <= roamingMonsters.length / 10) {
    console.log('returning existing monster')
    const monster = getRandomArrayElement(roamingMonsters)
    if (monster && isMonster(monster)) return monster
  }
  console.log('spawning new monster')
  return createRandomMonster()
}
