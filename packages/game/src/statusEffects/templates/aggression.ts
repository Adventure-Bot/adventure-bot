import { EffectTemplate } from '@adventure-bot/game/statusEffects'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const aggression: EffectTemplate = {
  name: 'Aggression',
  buff: true,
  debuff: false,
  modifiers: {
    attackBonus: 2,
  },
  announcement: 'became aggressive!',
  announcementColor: 'RED',
  duration: defaultEffectDuration,
}
