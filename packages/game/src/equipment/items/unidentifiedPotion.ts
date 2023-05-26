import { randomUUID } from 'crypto'

import { Potion } from '@adventure-bot/game/equipment'
import { randomArrayElement } from '@adventure-bot/game/utils'

export const unidentifiedPotion = (): Omit<Potion, 'description'> & {
  description: string
} => ({
  id: randomUUID(),
  type: 'potion',
  description: randomArrayElement([
    "You have no idea who made this, where it came from, or what's in it.",
    'It smells awful. But they usually do.',
    "You're pretty sure the toe is part of it.",
  ]),
  goldValue: 10,
  name: randomArrayElement([
    'unidentified potion',
    'potion of dubious origins',
    'Healing Potion?',
  ]),
  useEffects: {
    randomEffect: [
      'aggression',
      'blind',
      'frailty',
      'healer',
      'invigorated',
      'might',
      'poisoned',
      'protectedEffect',
      'rogue',
      'rugged',
      'slayer',
      'slowed',
      'stunned',
    ],
  },
  usable: true,
  equippable: false,
  sellable: true,
  tradeable: true,
})
