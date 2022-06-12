import { EffectTemplate } from '@adventure-bot/game/statusEffects'

export const blessed: EffectTemplate = {
  name: 'Blessed',
  buff: true,
  debuff: false,
  duration: 4 * 60 * 60000,
  announcement: 'was blessed!',
  announcementColor: 'YELLOW',
}
