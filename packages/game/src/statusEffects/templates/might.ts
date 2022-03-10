import { TemplateEffect } from '@adventure-bot/game/statusEffects'

export const might: TemplateEffect = {
  name: 'Might',
  buff: true,
  debuff: false,
  modifiers: {
    damageMax: 2,
  },
  duration: 60 * 60000,
}
