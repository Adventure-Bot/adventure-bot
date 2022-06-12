import { StatusEffect } from '@adventure-bot/game/statusEffects/StatusEffect'

export const aggression: StatusEffect = {
  name: 'Agression',
  buff: true,
  debuff: false,
  modifiers: {
    attackBonus: 2,
  },
  announcement: 'became aggressive!',
  announcementColor: 'RED',
  duration: 60 * 60000,
}
