import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { range } from 'remeda'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import { leaderboardEmbeds } from '@adventure-bot/game/leaderboard'
import store from '@adventure-bot/game/store'
import {
  winnerDeclared,
  winnerRevoked,
} from '@adventure-bot/game/store/actions'
import {
  goldSet,
  healthSet,
  purgeRoamingMonsters,
  xpSet,
} from '@adventure-bot/game/store/slices/characters'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setDefaultPermission(false)
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
    option
      .setName('set_xp')
      .setDescription('Sets your current experience score.')
      .addIntegerOption((input) =>
        input.setName('xp').setDescription('XP score to set.').setRequired(true)
      )
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
      .setName('declare_winner')
      .setDescription('Game over!')
      .addUserOption((input) =>
        input.setName('winner').setDescription('The winner').setRequired(true)
      )
  )
  .addSubcommand((option) =>
    option.setName('declare_winner_revoked').setDescription('Over ruled!')
  )
  .addSubcommand((option) =>
    option.setName('leaderboard').setDescription('#winning')
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

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  switch (interaction.options.getSubcommand()) {
    case 'add_emoji':
      addEmoji(interaction)
      break
    case 'purge_roaming':
      store.dispatch(purgeRoamingMonsters())
      interaction.editReply('Roaming monsters purged')
      break
    case 'set_xp':
      setXp(interaction)
      interaction.editReply(
        `XP set to ${interaction.options.getInteger('xp')}.`
      )
      break
    case 'set_gold':
      setGold(interaction)
      interaction.editReply('Gold set.')
      return
    case 'set_health':
      setHealth(interaction)
      return
    case 'declare_winner':
      declareWinner(interaction)
      break
    case 'declare_winner_revoked':
      store.dispatch(winnerRevoked())
      interaction.editReply({
        embeds: leaderboardEmbeds(),
      })
      break
    case 'leaderboard':
      interaction.editReply({
        embeds: leaderboardEmbeds(),
      })
      break
    default:
      interaction.editReply(
        `Invalid subcommand ${interaction.options.getSubcommand()}`
      )
  }
}

function declareWinner(interaction: CommandInteraction) {
  const winnerUser = interaction.options.getUser('winner')
  if (!winnerUser) return
  const winner = findOrCreateCharacter(winnerUser)
  store.dispatch(winnerDeclared({ winner, interaction }))
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
const setXp = async (interaction: CommandInteraction) => {
  const xp = interaction.options.getInteger('xp')
  if (!xp) return
  store.dispatch(
    xpSet({
      characterId: interaction.user.id,
      xp,
    })
  )
}

const setHealth = async (interaction: CommandInteraction) => {
  const hp = interaction.options.getInteger('hp')
  if (hp === null) return
  interaction.editReply(`Health set to ${hp}.`)
  store.dispatch(
    healthSet({
      characterId: interaction.user.id,
      health: hp,
    })
  )
}

export default { command, execute }
