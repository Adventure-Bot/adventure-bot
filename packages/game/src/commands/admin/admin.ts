import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { range } from 'remeda'

import { getUserCharacter } from '@adventure-bot/game/character'
import { leaderboard } from '@adventure-bot/game/commands/leaderboard'
import { healerStatus } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import {
  newGame,
  winnerDeclared,
  winnerRevoked,
} from '@adventure-bot/game/store/actions'
import {
  effectAdded,
  goldSet,
  healthSet,
  purgeRoamingMonsters,
  xpSet,
} from '@adventure-bot/game/store/slices/characters'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

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
    option
      .setName('set_xp')
      .setDescription('Sets your current experience score.')
      .addIntegerOption((input) =>
        input.setName('xp').setDescription('XP score to set.').setRequired(true)
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
    option.setName('display_leaderboard').setDescription('#winning')
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
      interaction.editReply('Health set.')
      return
    case 'become_healer':
      store.dispatch(
        effectAdded({ characterId: interaction.user.id, effect: healerStatus })
      )
      interaction.editReply('You are now a healer.')
      return
    case 'declare_winner':
      declareWinner(interaction)
      interaction.editReply({
        embeds: leaderboard(),
      })
      break
    case 'declare_winner_revoked':
      store.dispatch(winnerRevoked())
      interaction.editReply({
        embeds: leaderboard(),
      })
      break
    case 'display_leaderboard':
      interaction.editReply({
        embeds: leaderboard(),
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
  const winner = getUserCharacter(winnerUser)
  store.dispatch(winnerDeclared({ winner }))
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
  console.log(`Setting health to ${hp}`)
  store.dispatch(
    healthSet({
      characterId: interaction.user.id,
      health: hp,
    })
  )
}

export default { command, execute }
