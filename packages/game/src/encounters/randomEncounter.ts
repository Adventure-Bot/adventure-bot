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
import { thugs } from '@adventure-bot/game/encounters/thugs'
import { getRoamingMonsters } from '@adventure-bot/game/monster'
import { CommandHandler, weightedTable } from '@adventure-bot/game/utils'

export const randomEncounter = (
  interaction: CommandInteraction
): CommandHandler => {
  const character = findOrCreateCharacter(interaction.user)
  const xpRequired = (xp: number) => (character.xp >= xp ? 1 : 0)
  const angelChance = character.quests.healer ? 0 : 0.5
  const warlockChance = character.quests.afflicted ? 0 : 0.5
  const rangerChance = getRoamingMonsters().length > 3 ? 1 : 0
  const wealthy = Math.min(
    3,
    character.gold / 90 + character.inventory.length / 5
  )
  return weightedTable<CommandHandler>([
    [0.2, divineBlessing],
    [angelChance, angels],
    [warlockChance, warlock],
    [1, fairyWell],
    [xpRequired(20) * 2, cairns],
    [wealthy, shop],
    [wealthy / 2, thugs],
    [1, tavern],
    [xpRequired(10), cave],
    [xpRequired(50), coralReef],
    [rangerChance, ranger],
    [1, trap],
    [1, travel],
    [2, monster],
    [2, chest],
    [2, randomShrine()],
    [xpRequired(20), townSquare],
  ])
}
