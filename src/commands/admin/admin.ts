import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { range } from 'remeda'
import { healerStatus } from '../../quest/rewards/healerStatus'
import store from '../../store'
import { newGame } from '../../store/actions'
import {
  effectAdded,
  goldSet,
  healthSet,
  purgeRoamingMonsters,
} from '../../store/slices/characters'

export const command = new SlashCommandBuilder()
  .setName('admin')
  .setDescription('Administrative functions.')
  .addSubcommand((option) =>
    option
      .setName('set_gold')
      .setDescription('Sets your current gold.')
      .addIntegerOption((input) =>
        input
          .setName('gold')
          .setDescription('The amount of gold you have.')
          .setRequired(true)
      )
  )
  .addSubcommand((option) =>
    option.setName('new_game').setDescription('Starts a new game.')
  )
  .addSubcommand((option) =>
    option.setName('add_emoji').setDescription('Adds emoji to your server.')
  )
  .addSubcommand((option) =>
    option.setName('purge_roaming').setDescription('Purge roaming monsters.')
  )
  .addSubcommand((option) =>
    option.setName('become_healer').setDescription('Become a healer.')
  )
  .addSubcommand((option) =>
    option
      .setName('set_health')
      .setDescription('Sets your current health.')
      .addIntegerOption((input) =>
        input
          .setName('hp')
          .setDescription('Health points to set.')
          .setRequired(true)
      )
  )

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  switch (interaction.options.getSubcommand()) {
    case 'new_game':
      store.dispatch(newGame())
      interaction.editReply('New game started')
      break
    case 'add_emoji':
      addEmoji(interaction)
      break
    case 'purge_roaming':
      store.dispatch(purgeRoamingMonsters())
      interaction.editReply('Roaming monsters purged')
      break
    case 'set_gold':
      setGold(interaction)
      interaction.editReply('Gold set.')
      return
    case 'set_health':
      setHealth(interaction)
      interaction.editReply('Health set.')
      return
    case 'become_healer':
      store.dispatch(
        effectAdded({ characterId: interaction.user.id, effect: healerStatus })
      )
      interaction.editReply('You are now a healer.')
      return
    default:
      interaction.editReply(
        `Invalid subcommand ${interaction.options.getSubcommand()}`
      )
  }
}

async function addEmoji(interaction: CommandInteraction) {
  const guild = interaction.guild
  if (!guild) return
  range(1, 21).forEach(async (n) => {
    const nn = n.toString().padStart(2, '0')
    const path = join(__dirname, `../../../images/dice/00${nn}.png`)
    const file = readFileSync(path)
    try {
      const emojiName = `d20_${nn}`
      const existing = guild.emojis.cache.find(
        (emoji) => emoji.name === emojiName
      )
      if (existing) {
        interaction.editReply(`Emoji already exists: ${existing}`)
        return
      }
      const emoji = await guild.emojis.create(file, emojiName)
      interaction.editReply(`Emoji added: ${emoji}`)
    } catch (e) {
      interaction.editReply(`Error: ${e}`)
    }
  })
}

const setGold = async (interaction: CommandInteraction) => {
  const gold = interaction.options.getInteger('gold')
  if (!gold) return
  store.dispatch(
    goldSet({
      characterId: interaction.user.id,
      gold,
    })
  )
}

const setHealth = async (interaction: CommandInteraction) => {
  const hp = interaction.options.getInteger('hp')
  if (hp === null) return
  console.log(`Setting health to ${hp}`)
  store.dispatch(
    healthSet({
      characterId: interaction.user.id,
      health: hp,
    })
  )
}

export default { command, execute }
