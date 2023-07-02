import { CommandInteraction } from 'discord.js'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import {
  angels,
  cairns,
  cave,
  chest,
  coralReef,
  divineBlessing,
  fairyWell,
  monster,
  ranger,
  shop,
  tavern,
  townSquare,
  trap,
  travel,
  warlock,
} from '@adventure-bot/game/encounters'
import { randomShrine } from '@adventure-bot/game/encounters/shrine'
import { getRoamingMonsters } from '@adventure-bot/game/monster'
import { CommandHandler, weightedTable } from '@adventure-bot/game/utils'

export const randomEncounter = (
  interaction: CommandInteraction
): CommandHandler => {
  const character = findOrCreateCharacter(interaction.user)
  const angelChance = character.quests.healer ? 0 : 0.5
  const warlockChance = character.quests.afflicted ? 0 : 0.5
  const coralReefChance = character.xp >= 50 ? 1 : 0
  const townSquareChance = character.xp >= 20 ? 2 : 0
  const caveChance = character.xp >= 10 ? 1 : 0
  const rangerChance = getRoamingMonsters().length > 3 ? 1 : 0
  const shopChance = Math.min(
    3,
    character.gold / 90 + character.inventory.length / 5
  )
  return weightedTable<CommandHandler>([
    [0.2, divineBlessing],
    [angelChance, angels],
    [warlockChance, warlock],
    [1, fairyWell],
    [2, cairns],
    [shopChance, shop],
    [1, tavern],
    [caveChance, cave],
    [coralReefChance, coralReef],
    [rangerChance, ranger],
    [1, trap],
    [1, travel],
    [2, monster],
    [2, chest],
    [2, randomShrine()],
    [townSquareChance, townSquare],
  ])
}
