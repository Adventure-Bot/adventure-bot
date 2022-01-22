import { CommandInteraction, Message, MessageEmbed } from 'discord.js'

import { getUserCharacter } from '@adventure-bot/character'
import { barFight } from '@adventure-bot/encounters/tavern/barFight'
import { chattyTavernkeepers } from '@adventure-bot/encounters/tavern/chattyTavernkeepers'
import { restfulNight } from '@adventure-bot/encounters/tavern/restfulNight'
import store from '@adventure-bot/store'
import { selectAvailableQuests } from '@adventure-bot/store/selectors'
import { sleep, weightedTable } from '@adventure-bot/utils'
import { getAsset } from '@adventure-bot/utils'

export const tavern = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user)
  const message = await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: 'Tavern',
        color: '#964B00',
        description: `You find a tavern and hope for a soft bed, warm meal, and strong drink...`,
      }).setImage(getAsset('fantasy', 'places', 'tavern').s3Url),
    ],
  })
  if (!(message instanceof Message)) return
  await sleep(2000)

  const availableQuests = selectAvailableQuests(
    store.getState(),
    character
  ).length
  const chattyChance = availableQuests / 3
  return weightedTable([
    [1, restfulNight],
    [1, barFight],
    [chattyChance, chattyTavernkeepers],
  ])(interaction)
}
