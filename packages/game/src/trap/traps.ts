import { defaultCharacter } from '@adventure-bot/game/character'
import { Trap } from '@adventure-bot/game/trap/Trap'
import { asset, randomArrayElement } from '@adventure-bot/game/utils'

export const traps = {
  glyph: (): Trap => ({
    ...defaultCharacter,
    name: 'glyph trap',
    attackText: 'As your foot hits the ground, runes begin to glow!',
    hitText: 'The runes flash and you are stunned!',
    onHitEffect: 'stunned',
    missText: 'You deftly evade!',
    image: asset(
      'fantasy',
      'places',
      'dungeon floor with glowing magical glyphs'
    ).s3Url,
  }),
  ball: (): Trap => ({
    ...defaultCharacter,
    damageMax: 8,
    name: 'stone ball trap',
    attackText: 'A huge stone ball comes bowling down on you!',
    hitText: 'You are crushed!',
    missText: 'You deftly evade!',
    image: randomArrayElement([
      asset('fantasy', 'items', 'a large tumbling boulder with motion blur'),
      asset('fantasy', 'items', 'a massive stone sphere tumbling towards you'),
    ]).s3Url,
  }),
  poisonNeedle: (): Trap => ({
    ...defaultCharacter,
    damageMax: 4,
    name: 'poison needle trap',
    attackText: 'A needle attempts to prick you!',
    onHitEffect: 'poisoned',
    hitText: 'The needle punctures your flesh and you feel ill!',
    missText: 'You quickly pull away and avoid the needle!',
    image: asset(
      'fantasy',
      'items',
      'a sharp metal needle dripping with glowing green poison'
    ).s3Url,
  }),
  slowDust: (): Trap => ({
    ...defaultCharacter,
    name: 'slow dust trap',
    onHitEffect: 'slowed',
    attackText: 'A strange dust explodes in your face!',
    hitText: 'You cough and sputter, suddenly feeling quite drowsy.',
    missText: 'You deftly evade!',
    image: asset('fantasy', 'magic', 'sparkle dust').s3Url,
  }),
} as const
