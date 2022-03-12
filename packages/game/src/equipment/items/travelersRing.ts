import { randomUUID } from 'crypto'

import { Item, Ring } from '@adventure-bot/game/equipment'

type TravelersRing = Ring

export const isTravelersRing = (item: Item): item is TravelersRing =>
  item.name === "Traveler's Ring"

export const travelersRing = (): Ring => ({
  id: randomUUID(),
  type: 'ring',
  name: "Traveler's Ring",
  description: 'Gain invigorated when you travel.',
  goldValue: 30,
  equippable: true,
  sellable: true,
  tradeable: true,
})
