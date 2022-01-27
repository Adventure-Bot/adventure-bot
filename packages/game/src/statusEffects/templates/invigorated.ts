import { TemplateEffect } from '@adventure-bot/game/statusEffects'

export const invigorated: TemplateEffect = {
  name: 'Invigorated',
  buff: true,
  debuff: false,
  duration: 30 * 60000,
  modifiers: {
    maxHP: 2,
  },
}
