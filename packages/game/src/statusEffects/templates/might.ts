import { EffectTemplate } from '@adventure-bot/game/statusEffects'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const might: EffectTemplate = {
  name: 'Might',
  buff: true,
  debuff: false,
  modifiers: {
    damageMax: 2,
  },
  duration: defaultEffectDuration,
  announcement: 'became mighty!',
  announcementColor: 'RED',
}
