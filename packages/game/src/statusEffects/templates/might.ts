import { EffectTemplate } from '@adventure-bot/game/statusEffects/StatusEffect'

export const might: EffectTemplate = {
  name: 'Might',
  buff: true,
  debuff: false,
  modifiers: {
    damageMax: 2,
  },
  duration: 60 * 60000,
  announcement: 'became mighty!',
  announcementColor: 'RED',
}
