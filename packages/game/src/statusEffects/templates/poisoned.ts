import { EffectTemplate } from '@adventure-bot/game/statusEffects/StatusEffect'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const poisoned: EffectTemplate = {
  name: 'Poisoned',
  buff: false,
  debuff: true,
  duration: defaultEffectDuration,
  announcement: 'was poisoned!',
  announcementColor: 'GREEN',
  healthAdjustment: -1,
  ticksRemaining: 3,
}
