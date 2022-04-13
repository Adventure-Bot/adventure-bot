import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates'
import { TemplateEffect } from '@adventure-bot/game/statusEffects/templates/TemplateEffect'

export const poisoned: TemplateEffect = {
  name: 'Poisoned',
  buff: false,
  debuff: true,
  duration: defaultEffectDuration,
  modifiers: {
    attackBonus: -2,
  },
}
