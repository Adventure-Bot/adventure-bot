import moment from 'moment'

import store from '@adventure-bot/game/store'

/**
 *
 * @returns a number between 0 and 1 that represents the chance to find a crown
 */
export function chanceToFindCrown(): number {
  const { gameStartedAt } = store.getState().crown
  const hoursElapsed = moment().diff(gameStartedAt, 'hours')
  return Math.pow(2, hoursElapsed / 24) / 128
}
