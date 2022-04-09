import { TemplateEffect } from '@adventure-bot/game/statusEffects'

export const haste: TemplateEffect = {
  name: 'Haste',
  buff: true,
  debuff: false,
  modifiers: {
    haste: 10,
  },
  duration: 60 * 60000,
}
