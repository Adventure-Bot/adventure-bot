import { Quest } from '@adventure-bot/game/quest'

const questIds = [
  'slayer',
  'survivor',
  'blessed',
  // "afflicted",
  'traveler',
  'healer',
  // "rogue",
] as const

export type QuestId = typeof questIds[number]
export const isQuestId = (id: string): id is QuestId =>
  questIds.includes(id as QuestId)

export const quests: {
  [id in QuestId]: Quest
} = {
  slayer: {
    id: 'slayer',
    title: 'Slayer',
    progress: 0,
    totalRequired: 2,
    objective: 'Defeat 2 monsters',
    reward: 'Deal more damage to monsters.',
    repeatable: true,
    victoryText: 'Your are a slayer!',
  },
  survivor: {
    id: 'survivor',
    title: 'Survivor',
    progress: 0,
    totalRequired: 20,
    objective: 'Survive 20 damage',
    reward: 'Gain temporary health.',
    repeatable: true,
    victoryText: 'You have survived hardship and it only makes you harder.',
  },
  // afflicted: {
  //   id: "afflicted",
  //   title: "Afflicted",
  //   progress: 0,
  //   totalRequired: 50,
  //   objective: "Become afflicted by 10 debuffs",
  //   reward: "Consume afflictions to gain strength.",
  //   repeatable: false,
  // },
  traveler: {
    id: 'traveler',
    title: 'Traveler',
    progress: 0,
    totalRequired: 2,
    objective: 'Travel twice',
    reward: 'Travel heals and grants vigor.',
    victoryText: 'You are a rugged traveler. New sights invigorate you!',
    repeatable: false,
  },
  blessed: {
    id: 'blessed',
    title: 'Blessed',
    progress: 0,
    totalRequired: 2,
    objective: 'Find 2 shrines',
    reward: 'Shrines last twice as long.',
    repeatable: false,
    victoryText: '#blessed is the shrine seeker.',
  },
  healer: {
    id: 'healer',
    title: 'Healer',
    progress: 0,
    totalRequired: 10,
    objective: 'Heal 10 hp',
    reward: 'Heal to full and `/heal` does +2.',
    repeatable: false,
    victoryText: 'Flesh rended and renewed. The cycle of life.',
  },
  // rogue: {
  //   id: "rogue",
  //   title: 'Rogue',
  //   progress: 0,
  //   totalRequired: 15,
  //   objective: 'Evade '
  // },
}
