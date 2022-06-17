import moment from 'moment'

import store from '@adventure-bot/game/store'

/**
 *
 * @returns a number between 0 and 1 that represents the chance to find a crown
 */
export function chanceToFindCrown(): number {
  const { gameStartedAt, bearerId } = store.getState().crown
  if (bearerId) return 0
  const days = moment().diff(gameStartedAt, 'hours') / 24
  // logrithmic 0-1 for days 0-14
  return (Math.pow(2, days) - 1) / Math.pow(2, 14)
}
