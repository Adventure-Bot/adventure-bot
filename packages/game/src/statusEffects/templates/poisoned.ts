import { EffectTemplate } from '@adventure-bot/game/statusEffects'

export const poisoned: EffectTemplate = {
  name: 'Poisoned',
  buff: false,
  debuff: true,
  announcement: 'was poisoned!',
  announcementColor: 'GREEN',
  healthAdjustment: -1,
  ticksRemaining: 3,
}
