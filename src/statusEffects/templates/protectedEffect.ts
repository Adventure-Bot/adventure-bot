import { TemplateEffect } from '@adventure-bot/statusEffects/templates/TemplateEffect'

export const protectedEffect: TemplateEffect = {
  name: 'Protected',
  modifiers: {
    ac: 2,
  },
  duration: 30 * 60000,
  buff: true,
  debuff: false,
}
