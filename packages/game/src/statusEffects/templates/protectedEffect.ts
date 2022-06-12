import { EffectTemplate } from '@adventure-bot/game/statusEffects'

export const protectedEffect: EffectTemplate = {
  name: 'Protected',
  modifiers: {
    ac: 2,
  },
  duration: 60 * 60000,
  buff: true,
  debuff: false,
  announcement: 'became protected!',
  announcementColor: 'NOT_QUITE_BLACK',
}
