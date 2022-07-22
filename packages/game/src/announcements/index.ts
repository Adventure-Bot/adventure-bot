import { announceEffectAdded } from '@adventure-bot/game/announcements/announceEffectAdded'
import { announceGoldGained } from '@adventure-bot/game/announcements/announceGoldGained'
import { announcePeriodicEffects } from '@adventure-bot/game/announcements/announcePeriodicEffects'
import { announceQuestGranted } from '@adventure-bot/game/announcements/announceQuestGranted'
import { announceQuestProgressed } from '@adventure-bot/game/announcements/announceQuestProgressed'
import { announceStatContested } from '@adventure-bot/game/announcements/announceStatContested'
import { announceTrapAttacked } from '@adventure-bot/game/announcements/announceTrapAttacked'
import { announceWinners } from '@adventure-bot/game/announcements/announceWinners'
import { announceXpAwarded } from '@adventure-bot/game/announcements/announceXpAwarded'

export { announceCrownLoots } from '@adventure-bot/game/announcements/announceLoots'
export { announceItemsReceived } from '@adventure-bot/game/announcements/announceItemsReceived'
export { announceLoots } from '@adventure-bot/game/announcements/announceLoots'

export const announcements = [
  announceEffectAdded,
  announceGoldGained,
  announcePeriodicEffects,
  announceQuestGranted,
  announceQuestProgressed,
  announceStatContested,
  announceTrapAttacked,
  announceWinners,
  announceXpAwarded,
] as const
