import { EffectTemplate } from '@adventure-bot/game/statusEffects/StatusEffect'

export const invigorated: EffectTemplate = {
  name: 'Invigorated',
  buff: true,
  debuff: false,
  duration: 60 * 60000,
  modifiers: {
    maxHP: 2,
  },
  announcement: 'became invigorated!',
  announcementColor: 'WHITE',
}
