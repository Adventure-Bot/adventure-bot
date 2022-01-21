import { TemplateEffect } from '@adventure-bot/statusEffects/templates/TemplateEffect'

export const might: TemplateEffect = {
  name: 'Might',
  buff: true,
  debuff: false,
  modifiers: {
    damageMax: 2,
  },
  duration: 30 * 60000,
}
