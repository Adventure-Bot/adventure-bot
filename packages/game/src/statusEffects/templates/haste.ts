import { EffectTemplate } from '@adventure-bot/game/statusEffects'

export const haste: EffectTemplate = {
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
