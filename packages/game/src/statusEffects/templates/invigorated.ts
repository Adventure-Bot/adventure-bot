import { Colors } from 'discord.js'

import { EffectTemplate } from '@adventure-bot/game/statusEffects'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const invigorated: EffectTemplate = {
  name: 'Invigorated',
  buff: true,
  debuff: false,
  duration: defaultEffectDuration,
  modifiers: {
    maxHP: 2,
  },
  announcement: 'became invigorated!',
  announcementColor: Colors.White,
}
