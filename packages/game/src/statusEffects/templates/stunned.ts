import { TemplateEffect } from '@adventure-bot/game/statusEffects/templates/TemplateEffect'

export const stunned: TemplateEffect = {
  name: 'Stunned',
  buff: false,
  debuff: true,
  duration: 10 * 60000,
}
