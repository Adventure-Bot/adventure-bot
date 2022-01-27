import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { keys } from 'remeda'

import * as encounters from '@adventure-bot/game/encounters'

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
  .setName('encounter')
  .setDescription('Trigger a specific encounter')

command.addStringOption((option) => {
  option
    .setName('encounter')
    .setDescription(`The encounter to trigger.`)
    .setRequired(true)
  keys(encounters).forEach((encounterName) => {
    option.addChoice(camelToSnakeCase(encounterName), encounterName)
  })
  return option
})

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const encounterName = snakeToCamelCase(
    interaction.options.getString('encounter') ?? ''
  )
  const encounterNames = keys(encounters)
  if (encounterNames.includes(encounterName)) {
    // @ts-ignore
    const encounter = encounters[encounterName]
    console.log(encounter)
    await encounter(interaction)
  }
}

export default { command, execute }
