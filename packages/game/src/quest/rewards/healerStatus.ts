import { StatusEffect } from '@adventure-bot/game/statusEffects'

export const healerStatus: StatusEffect = {
  name: 'Healer',
  buff: true,
  debuff: false,
  duration: 24 * 60 * 60000,
  modifiers: {},
  started: new Date().toString(),
}
