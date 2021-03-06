import { EffectTemplate } from '@adventure-bot/game/statusEffects'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const poisoned: EffectTemplate = {
  name: 'Poisoned',
  buff: false,
  debuff: true,
  duration: defaultEffectDuration,
  modifiers: {
    attackBonus: -2,
  },

  announcement: 'was poisoned!',
  announcementColor: 'GREEN',
  // TODO:
  // healthAdjustment: -1,
  // ticksRemaining: 3,
}
