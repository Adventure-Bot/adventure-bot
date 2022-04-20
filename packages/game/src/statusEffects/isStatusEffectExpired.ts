import { StatusEffect } from '@adventure-bot/game/statusEffects'

export function isStatusEffectExpired(effect: StatusEffect): boolean {
  return Date.now() > new Date(effect.started).valueOf() + effect.duration
}
