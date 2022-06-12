import { EffectTemplate } from '@adventure-bot/game/statusEffects'

export const healer: EffectTemplate = {
  name: 'Healer',
  buff: true,
  debuff: false,
  duration: 24 * 60 * 60000,
  announcement: 'became a healer!',
  announcementColor: 'WHITE',
}
