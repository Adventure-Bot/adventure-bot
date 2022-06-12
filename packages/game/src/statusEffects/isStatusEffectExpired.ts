import {
  StatusEffect,
  isAppliedEffect,
} from '@adventure-bot/game/statusEffects'

export function isStatusEffectExpired(effect: StatusEffect): boolean {
  return (
    isAppliedEffect(effect) &&
    Date.now().valueOf() >
      new Date(effect.started).valueOf() + (effect.duration ?? 0)
  )
}
