import { TemplateEffect } from '@adventure-bot/game/statusEffects'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const blind: TemplateEffect = {
  name: 'Blind',
  buff: false,
  debuff: true,
  duration: defaultEffectDuration,
  modifiers: {
    attackBonus: -3,
  },
  announcement: 'was blinded!',
}
