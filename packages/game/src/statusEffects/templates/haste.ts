import { Colors } from 'discord.js'

import { EffectTemplate } from '@adventure-bot/game/statusEffects'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const haste: EffectTemplate = {
  name: 'Haste',
  buff: true,
  debuff: false,
  modifiers: {
    haste: 30,
  },
  duration: defaultEffectDuration,
  announcement: 'started moving faster!',
  announcementColor: Colors.White,
}
