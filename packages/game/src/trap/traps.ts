import { randomUUID } from 'crypto'

import { defaultCharacter } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { selectCharacterStats } from '@adventure-bot/game/store/selectors'
import { Trap, TrapWithStats } from '@adventure-bot/game/trap'
import { asset } from '@adventure-bot/game/utils'

function createTrap(trapConfig: Omit<Trap, 'id'>): TrapWithStats {
  const state = store.getState()
  const trap: Trap = {
    ...defaultCharacter,
    ...trapConfig,
    id: randomUUID(),
  }
  const stats = selectCharacterStats(state, trap)
  const statsModified = selectCharacterStats(state, trap, false)
  return {
    ...trap,
    stats,
    statsModified,
  }
}

export const traps = {
  glyph: (): TrapWithStats =>
    createTrap({
      ...defaultCharacter,
      name: 'glyph trap',
      attackText: 'As your foot hits the ground, runes begin to glow!',
      hitText: 'The runes flash and you are stunned!',
      onHitEffect: 'stunned',
      missText: 'You deftly evade!',
      profile: asset(
        'fantasy',
        'places',
        'dungeon floor with glowing magical glyphs'
      ).s3Url,
    }),
  ball: (): TrapWithStats =>
    createTrap({
      ...defaultCharacter,
      damageMax: 8,
      name: 'stone ball trap',
      attackText: 'A huge stone ball comes bowling down on you!',
      hitText: 'You are crushed!',
      missText: 'You deftly evade!',
      profile: asset('fantasy', 'items', 'boulder trap').s3Url,
    }),
  poisonNeedle: (): TrapWithStats =>
    createTrap({
      ...defaultCharacter,
      damageMax: 4,
      name: 'poison needle trap',
      attackText: 'A needle attempts to prick you!',
      onHitEffect: 'poisoned',
      hitText: 'The needle punctures your flesh and you feel ill!',
      missText: 'You quickly pull away and avoid the needle!',
      profile: asset(
        'fantasy',
        'items',
        'a sharp metal needle dripping with glowing green poison'
      ).s3Url,
    }),
  slowDust: (): TrapWithStats =>
    createTrap({
      ...defaultCharacter,
      name: 'slow dust trap',
      onHitEffect: 'slowed',
      attackText: 'A strange dust explodes in your face!',
      hitText: 'You cough and sputter, suddenly feeling quite drowsy.',
      missText: 'You deftly evade!',
      profile: asset('fantasy', 'magic', 'sparkle dust').s3Url,
    }),
} as const
