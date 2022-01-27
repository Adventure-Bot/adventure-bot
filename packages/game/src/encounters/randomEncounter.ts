import { CommandInteraction } from 'discord.js'

import { getUserCharacter } from '@adventure-bot/character'
import {
  angels,
  chest,
  divineBlessing,
  fairyWell,
  monster,
  shop,
  tavern,
  trap,
  travel,
} from '@adventure-bot/encounters'
import { randomShrine } from '@adventure-bot/encounters/shrine'
import { CommandHandler, weightedTable } from '@adventure-bot/utils'

export const randomEncounter = (
  interaction: CommandInteraction
): CommandHandler => {
  const character = getUserCharacter(interaction.user)
  const angelChance = character.quests.healer ? 0 : 0.5
  return weightedTable([
    [0.2, () => divineBlessing],
    [angelChance, () => angels],
    [1, () => fairyWell],
    [1, () => shop],
    [1, () => tavern],
    [1, () => trap],
    [1, () => travel],
    [2, () => monster],
    [2, () => chest],
    [2, randomShrine],
  ])()
}
