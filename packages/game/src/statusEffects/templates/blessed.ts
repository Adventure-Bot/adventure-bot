import { StatusEffect } from '@adventure-bot/game/statusEffects/StatusEffect'

export const blessed: StatusEffect = {
  name: 'Blessed',
  buff: true,
  debuff: false,
  duration: 4 * 60 * 60000,
  announcement: 'was blessed!',
  announcementColor: 'YELLOW',
}
