import { TemplateEffect } from '@adventure-bot/game/statusEffects'

export const aggression: TemplateEffect = {
  name: 'Agression',
  buff: true,
  debuff: false,
  modifiers: {
    attackBonus: 2,
  },
  announcement: 'became aggressive!',
  duration: 60 * 60000,
}
