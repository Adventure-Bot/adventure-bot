import { StatusEffect } from '@adventure-bot/game/statusEffects/StatusEffect'

export const haste: StatusEffect = {
  name: 'Haste',
  buff: true,
  debuff: false,
  modifiers: {
    haste: 10,
  },
  duration: 60 * 60000,
  announcement: 'started moving faster!',
  announcementColor: 'WHITE',
}
