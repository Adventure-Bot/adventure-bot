import { chanceToFindCrown } from './chanceToFindCrown'

export function didFindCrown(): boolean {
  return chanceToFindCrown() < Math.random()
}
