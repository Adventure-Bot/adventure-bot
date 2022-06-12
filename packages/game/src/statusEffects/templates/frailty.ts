import { EffectTemplate } from '@adventure-bot/game/statusEffects/StatusEffect'

export const frailty: EffectTemplate = {
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
