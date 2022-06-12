import { StatusEffect } from '@adventure-bot/game/statusEffects/StatusEffect'

export const rogue: StatusEffect = {
  name: 'Rogue',
  buff: true,
  debuff: false,
  duration: 24 * 60 * 60000,
  announcement: 'became a rogue!',
  announcementColor: 'DARK_BUT_NOT_BLACK',
  modifiers: {
    perception: 2,
    luck: 2,
    lockpicking: 2,
  },
}
