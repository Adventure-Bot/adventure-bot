import { EffectTemplate } from '@adventure-bot/game/statusEffects'

export const survivor: EffectTemplate = {
  name: 'Survivor',
  buff: true,
  debuff: false,
  duration: 4 * 60 * 60000,
  modifiers: {
    maxHP: 5,
  },
  announcement: 'endured!',
  announcementColor: 'DARK_RED',
}
