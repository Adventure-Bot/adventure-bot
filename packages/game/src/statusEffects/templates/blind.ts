import { EffectTemplate } from '@adventure-bot/game/statusEffects'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const blind: EffectTemplate = {
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
