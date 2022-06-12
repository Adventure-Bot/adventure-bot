import { StatusEffect } from '@adventure-bot/game/statusEffects'

export function isStatusEffectExpired(effect: StatusEffect): boolean {
  return (
    Date.now().valueOf() >
    new Date(effect.started).valueOf() + (effect.duration ?? 0)
  )
}
