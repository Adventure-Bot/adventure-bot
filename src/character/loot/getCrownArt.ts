import { getAsset } from '@adventure-bot/utils/getAsset'
import { randomArrayElement } from '@adventure-bot/monster/randomArrayElement'

export function getCrownArt(): ReturnType<typeof getAsset> {
  return randomArrayElement([
    getAsset('fantasy', 'items', 'golden crown with jewels on a table'),
    getAsset('fantasy', 'items', 'crown on display'),
    getAsset('fantasy', 'items', 'golden crown with jewels'),
    getAsset('fantasy', 'items', 'crown on a table'),
  ])
}
