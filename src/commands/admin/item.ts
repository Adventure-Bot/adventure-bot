import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { keys } from 'remeda'

import { getUserCharacter } from '@adventure-bot/character/getUserCharacter'
import * as items from '@adventure-bot/equipment/equipment'
import { itemEmbed } from '@adventure-bot/equipment/itemEmbed'
import store from '@adventure-bot/store'
import { itemReceived } from '@adventure-bot/store/actions'

const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)

// converts snake case to camel case
const snakeToCamelCase = (str: string) => {
  const words = str.split('_')
  return words.reduce((acc, word, index) => {
    if (index === 0) {
      return word
    }
    return `${acc}${word[0].toUpperCase()}${word.slice(1)}`
  }, '')
}

export const command = new SlashCommandBuilder()
  .setName('item')
  .setDescription('Conjure an item')

command.addStringOption((option) => {
  option.setName('item').setDescription(`Conjure an item.`).setRequired(true)
  keys(items).forEach((item) => {
    option.addChoice(camelToSnakeCase(item), item)
  })
  return option
})

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user)
  const itemName = snakeToCamelCase(interaction.options.getString('item') ?? '')
  const itemNames = keys(items)
  if (itemNames.includes(itemName)) {
    // @ts-ignore
    const item = items[itemName]()
    store.dispatch(
      itemReceived({
        characterId: character.id,
        item,
      })
    )
    interaction.editReply({
      content: `${item.name} conjured`,
      embeds: [itemEmbed({ item, interaction })],
    })
  }
}

export default { command, execute }
