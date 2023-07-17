import { Colors } from 'discord.js'

import { EffectTemplate } from '@adventure-bot/game/statusEffects'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const poisoned: EffectTemplate = {
  name: 'Poisoned',
  buff: false,
  debuff: true,
  duration: defaultEffectDuration,
  modifiers: {
    attackBonus: -4,
  },
  announcement: 'was poisoned!',
  announcementColor: Colors.Green,
}
