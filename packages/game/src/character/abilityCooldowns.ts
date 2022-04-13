import { duration } from 'moment'

const fiveMinutes = duration(5, 'minutes').asMilliseconds()

export const abilityCooldowns = {
  renew: duration(60, 'minutes').asMilliseconds(),
  adventure: fiveMinutes,
  attack: fiveMinutes,
  heal: fiveMinutes,
} as const
