import { EffectTemplate } from '@adventure-bot/game/statusEffects'

export const rugged: EffectTemplate = {
  name: 'Rugged',
  buff: true,
  debuff: false,
  duration: 24 * 60 * 60000,
  announcement: 'traveled far and wide!',
  announcementColor: 'GREEN',
  modifiers: {
    perception: 2,
    maxHP: 5,
  },
}
