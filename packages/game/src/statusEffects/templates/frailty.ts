import { StatusEffect } from '@adventure-bot/game/statusEffects/StatusEffect'

export const frailty: StatusEffect = {
  name: 'Frailty',
  buff: false,
  debuff: true,
  duration: 60 * 60000,
  modifiers: {
    ac: -3,
    maxHP: -3,
  },
  announcement: 'became frail!',
  announcementColor: 'LIGHT_GREY',
}
