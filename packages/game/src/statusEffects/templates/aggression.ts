import { Colors } from 'discord.js'

import { EffectTemplate } from '@adventure-bot/game/statusEffects'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const aggression: EffectTemplate = {
  name: 'Aggression',
  buff: true,
  debuff: false,
  modifiers: {
    attackBonus: 4,
  },
  announcement: 'became aggressive!',
  announcementColor: Colors.Red,
  duration: defaultEffectDuration,
}
