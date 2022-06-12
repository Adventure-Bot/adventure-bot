import { EffectTemplate } from '@adventure-bot/game/statusEffects/StatusEffect'

export const stunned: EffectTemplate = {
  name: 'Stunned',
  buff: false,
  debuff: true,
  duration: 10 * 60000,
  announcement: 'became stunned!',
  announcementColor: 'ORANGE',
}
