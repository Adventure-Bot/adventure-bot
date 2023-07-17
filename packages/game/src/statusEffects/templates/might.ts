import { Colors } from 'discord.js'

import { EffectTemplate } from '@adventure-bot/game/statusEffects'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'

export const might: EffectTemplate = {
  name: 'Might',
  buff: true,
  debuff: false,
  modifiers: {
    damageMax: 3,
  },
  duration: defaultEffectDuration,
  announcement: 'became mighty!',
  announcementColor: Colors.Red,
}
