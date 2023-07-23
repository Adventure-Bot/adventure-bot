import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { readFileSync, readdirSync } from 'fs'
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
  if (!interaction.isChatInputCommand()) return
  switch (interaction.options.getSubcommand()) {
    case 'add_emoji':
      addEmoji(interaction)
      break
    case 'purge_roaming':
      store.dispatch(purgeRoamingMonsters())
      interaction.channel?.send('Roaming monsters purged')
      break
    case 'set_xp':
      setXp(interaction)
      interaction.channel?.send(
        `XP set to ${interaction.options.getInteger('xp')}.`
      )
      break
    case 'set_gold':
      setGold(interaction)
      interaction.channel?.send('Gold set.')
      return
    case 'set_health':
      setHealth(interaction)
      return
    case 'declare_winner':
      declareWinner(interaction)
      break
    case 'declare_winner_revoked':
      store.dispatch(winnerRevoked())
      interaction.channel?.send({
        embeds: leaderboardEmbeds(),
      })
      break
    case 'leaderboard':
      interaction.channel?.send({
        embeds: leaderboardEmbeds(),
      })
      break
    default:
      interaction.channel?.send(
        `Invalid subcommand ${interaction.options.getSubcommand()}`
      )
  }
}

function declareWinner(interaction: ChatInputCommandInteraction) {
  const winnerUser = interaction.options.getUser('winner')
  if (!winnerUser) return
  const winner = findOrCreateCharacter(winnerUser)
  store.dispatch(winnerDeclared({ winner, interaction }))
}

async function addEmoji(interaction: ChatInputCommandInteraction) {
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
        interaction.channel?.send(`Emoji already exists: ${existing}`)
        return
      }
      const emoji = await guild.emojis.create({
        attachment: file,
        name: emojiName,
      })
      interaction.channel?.send(`Emoji added: ${emoji}`)
    } catch (e) {
      interaction.channel?.send(`Error: ${e}`)
    }
  })
  for (const file of readdirSync(join(__dirname, '../../../images/emoji/'))) {
    const emojiName = file.replace('.png', '')
    const existing = guild.emojis.cache.find(
      (emoji) => emoji.name === emojiName
    )
    if (existing) {
      interaction.channel?.send(`Emoji already exists: ${existing}`)
      continue
    }
    guild.emojis
      .create({
        attachment: join(__dirname, `../../../images/emoji/${file}`),
        name: emojiName,
      })
      .then((emoji) => {
        interaction.channel?.send(`Emoji added: ${emoji}`)
      })
      .catch((e) => {
        interaction.channel?.send(`Error: ${e}`)
      })
  }
}

const setGold = async (interaction: ChatInputCommandInteraction) => {
  const gold = interaction.options.getInteger('gold')
  if (!gold) return
  store.dispatch(
    goldSet({
      characterId: interaction.user.id,
      gold,
    })
  )
}
const setXp = async (interaction: ChatInputCommandInteraction) => {
  const xp = interaction.options.getInteger('xp')
  if (!xp) return
  store.dispatch(
    xpSet({
      characterId: interaction.user.id,
      xp,
    })
  )
}

const setHealth = async (interaction: ChatInputCommandInteraction) => {
  const hp = interaction.options.getInteger('hp')
  if (hp === null) return
  interaction.channel?.send(`Health set to ${hp}.`)
  store.dispatch(
    healthSet({
      characterId: interaction.user.id,
      health: hp,
    })
  )
}

export default { command, execute }
