import { randomUUID } from 'crypto'

import { Ring } from '@adventure-bot/game/equipment'

export const ringOfPurity = (): Ring => ({
  id: randomUUID(),
  type: 'ring',
  name: 'Ring of Purity',
  description: 'Artificer creation that purges unnatural afflictions.',
  modifiers: {
    cleansing: 50,
  },
  goldValue: 1500,
  equippable: true,
  sellable: true,
  tradeable: true,
})
