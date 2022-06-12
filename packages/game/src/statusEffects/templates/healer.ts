import { StatusEffect } from '@adventure-bot/game/statusEffects/StatusEffect'

export const healer: StatusEffect = {
  name: 'Healer',
  buff: true,
  debuff: false,
  duration: 24 * 60 * 60000,
  announcement: 'became a healer!',
  announcementColor: 'WHITE',
}
