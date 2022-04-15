import { TemplateEffect } from '@adventure-bot/game/statusEffects/templates/TemplateEffect'

export const healer: TemplateEffect = {
  name: 'Healer',
  buff: true,
  debuff: false,
  duration: 24 * 60 * 60000,
  announcement: 'became a healer!',
}
