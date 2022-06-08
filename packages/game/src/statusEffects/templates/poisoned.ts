import { TemplateEffect } from '@adventure-bot/game/statusEffects/templates/TemplateEffect'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const poisoned: TemplateEffect = {
  name: 'Poisoned',
  buff: false,
  debuff: true,
  duration: defaultEffectDuration,
  modifiers: {
    attackBonus: -2,
  },
  announcement: 'was poisoned!',
}
