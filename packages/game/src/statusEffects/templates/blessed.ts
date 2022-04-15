import { TemplateEffect } from '@adventure-bot/game/statusEffects'

export const blessed: TemplateEffect = {
  name: 'Blessed',
  buff: true,
  debuff: false,
  duration: 4 * 60 * 60000,
  announcement: 'was blessed!',
}
