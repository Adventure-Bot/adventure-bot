import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates'
import { TemplateEffect } from '@adventure-bot/game/statusEffects/templates/TemplateEffect'

export const slowed: TemplateEffect = {
  name: 'Slowed',
  buff: false,
  debuff: true,
  duration: defaultEffectDuration,
  modifiers: {
    haste: -10,
  },
}
