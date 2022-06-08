import { TemplateEffect } from '@adventure-bot/game/statusEffects/templates/TemplateEffect'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const slowed: TemplateEffect = {
  name: 'Slowed',
  buff: false,
  debuff: true,
  duration: defaultEffectDuration,
  modifiers: {
    haste: -10,
  },
  announcement: 'started moving more slowly!',
}
