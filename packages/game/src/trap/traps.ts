import { Trap } from '@adventure-bot/game/trap'
import { asset } from '@adventure-bot/game/utils'

export const traps: Record<string, () => Trap> = {
  glyph: () => ({
    name: 'glyph trap',
    description: 'As your foot hits the ground, runes begin to glow!',
    image: asset(
      'fantasy',
      'places',
      'dungeon floor with glowing magical glyphs'
    ).s3Url,
  }),
  ball: () => ({
    name: 'stone ball trap',
    description: 'A huge stone ball comes bowling down on you!',
    image: 'https://imgur.com/TDMLxyE.png',
  }),
}
