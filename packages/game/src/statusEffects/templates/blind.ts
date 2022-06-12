import { StatusEffect } from '@adventure-bot/game/statusEffects/StatusEffect'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const blind: StatusEffect = {
  name: 'Blind',
  buff: false,
  debuff: true,
  duration: defaultEffectDuration,
  modifiers: {
    attackBonus: -3,
  },
  announcement: 'was blinded!',
  announcementColor: 'NOT_QUITE_BLACK',
}
