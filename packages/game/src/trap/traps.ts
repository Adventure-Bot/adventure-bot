import { defaultCharacter } from '@adventure-bot/game/character'
import { Trap } from '@adventure-bot/game/trap/Trap'
import { asset } from '@adventure-bot/game/utils'

export const traps = {
  glyph: (): Trap => ({
    ...defaultCharacter,
    name: 'glyph trap',
    description: 'As your foot hits the ground, runes begin to glow!',
    image: asset(
      'fantasy',
      'places',
      'dungeon floor with glowing magical glyphs'
    ).s3Url,
    onHitEffect: 'stunned',
  }),
  ball: (): Trap => ({
    ...defaultCharacter,
    damageMax: 6,
    name: 'stone ball trap',
    description: 'A huge stone ball comes bowling down on you!',
    image: 'https://imgur.com/TDMLxyE.png',
  }),
  poisonNeedle: (): Trap => ({
    ...defaultCharacter,
    damageMax: 4,
    name: 'poison needle trap',
    onHitEffect: 'poisoned',
    image: 'https://imgur.com/TDMLxyE.png', // todo: AI artwork
    description: 'A needle attempts to prick you!',
  }),
  slowDust: (): Trap => ({
    ...defaultCharacter,
    damageMax: 4,
    name: 'slow dust trap',
    onHitEffect: 'slowed',
    image: asset('fantasy', 'magic', 'sparkle dust').s3Url,
    description: 'A strange dust explodes in your face!',
  }),
} as const
