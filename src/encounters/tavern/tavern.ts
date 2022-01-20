import { CommandInteraction, Message, MessageEmbed } from 'discord.js'
import { getUserCharacter } from '../../character/getUserCharacter'
import store from '../../store'
import { selectAvailableQuests } from '../../store/selectors'
import { sleep, weightedTable } from '../../utils'
import { getAsset } from '../../utils/getAsset'
import { barFight } from './barFight'
import { chattyTavernkeepers } from './chattyTavernkeepers'
import { restfulNight } from './restfulNight'

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
