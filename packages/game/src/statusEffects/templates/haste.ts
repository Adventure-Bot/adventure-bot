import { EffectTemplate } from '@adventure-bot/game/statusEffects'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const haste: EffectTemplate = {
  name: 'Haste',
  buff: true,
  debuff: false,
  modifiers: {
    haste: 10,
  },
  duration: defaultEffectDuration,
  announcement: 'started moving faster!',
  announcementColor: 'WHITE',
}
