import { TemplateEffect } from '@adventure-bot/game/statusEffects/templates/TemplateEffect'

export const rogue: TemplateEffect = {
  name: 'Rogue',
  buff: true,
  debuff: false,
  duration: 24 * 60 * 60000,
  announcement: 'became a rogue!',
  modifiers: {
    perception: 2,
    luck: 2,
    lockpicking: 2,
  },
}
