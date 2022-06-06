import moment from 'moment'

import store from '@adventure-bot/game/store'

/**
 *
 * @returns a number between 0 and 1 that represents the chance to find a crown
 */
export function chanceToFindCrown(): number {
  const { gameStartedAt, bearerId } = store.getState().crown
  if (bearerId) return 0
  const hoursElapsed = moment().diff(gameStartedAt, 'hours')
  // exponential growth towards 1 in ~7 days
  return Math.pow(2, hoursElapsed / 24) / 128
}
