import { Hat } from '@adventure-bot/game/equipment'

export const heavyCrownId = 'heavy-crown'

export const heavyCrown = (): Hat => ({
  id: heavyCrownId,
  name: 'heavy crown',
  description: 'Beset with jewels, in the daylight it commands the eye.',
  goldValue: 300,
  type: 'hat',
  modifiers: {
    attackBonus: +2,
    damageBonus: 3,
    ac: -4,
  },
  lootable: true,
  equippable: true,
  sellable: true,
  tradeable: true,
})
