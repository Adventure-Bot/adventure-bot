import { TemplateEffect } from '@adventure-bot/game/statusEffects'

export const survivor: TemplateEffect = {
  name: 'Survivor',
  buff: true,
  debuff: false,
  duration: 4 * 60 * 60000,
  modifiers: {
    maxHP: 5,
  },
  announcement: 'endured!',
}
