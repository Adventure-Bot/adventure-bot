import { randomArrayElement } from '@adventure-bot/monster/randomArrayElement'
import { getAsset } from '@adventure-bot/utils/getAsset'

// TODO: #83 find a better home for this
export function getCrownArt(): ReturnType<typeof getAsset> {
  return randomArrayElement([
    getAsset('fantasy', 'items', 'golden crown with jewels on a table'),
    getAsset('fantasy', 'items', 'crown on display'),
    getAsset('fantasy', 'items', 'golden crown with jewels'),
    getAsset('fantasy', 'items', 'crown on a table'),
  ])
}
