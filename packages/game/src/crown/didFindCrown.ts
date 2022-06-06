import { chanceToFindCrown } from './chanceToFindCrown'

export function didFindCrown(): boolean {
  const difficulty = 1 - chanceToFindCrown()
  const roll = Math.random()
  console.log(
    `didFindCrown? ${
      roll > difficulty ? 'yes!' : 'no'
    }: difficulty: ${difficulty}, roll: ${roll}, diff: ${difficulty - roll}`
  )
  return roll > difficulty
}
