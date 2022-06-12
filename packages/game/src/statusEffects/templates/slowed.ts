import { EffectTemplate } from '@adventure-bot/game/statusEffects/StatusEffect'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const slowed: EffectTemplate = {
  name: 'Slowed',
  buff: false,
  debuff: true,
  duration: defaultEffectDuration,
  modifiers: {
    haste: -10,
  },
  announcement: 'started moving more slowly!',
  announcementColor: 'DARK_BLUE',
}
