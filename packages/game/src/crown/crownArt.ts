import { asset, randomArrayElement } from '@adventure-bot/game/utils'

export function crownArt(): ReturnType<typeof asset> {
  return randomArrayElement([
    asset('fantasy', 'items', 'golden crown with jewels on a table'),
    asset('fantasy', 'items', 'crown on display'),
    asset('fantasy', 'items', 'golden crown with jewels'),
    asset('fantasy', 'items', 'crown on a table'),
  ])
}
