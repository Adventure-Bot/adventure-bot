import { Colors } from 'discord.js'

import { EffectTemplate } from '@adventure-bot/game/statusEffects'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const slowed: EffectTemplate = {
  name: 'Slowed',
  buff: false,
  debuff: true,
  duration: defaultEffectDuration,
  modifiers: {
    haste: -30,
  },
  announcement: 'started moving more slowly!',
  announcementColor: Colors.DarkBlue,
}
