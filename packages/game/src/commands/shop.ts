import { SlashCommandBuilder } from 'discord.js'

import { shop } from '@adventure-bot/game/encounters/shop/shop'

export const command = new SlashCommandBuilder()
  .setName('shop')
  .setDescription('If you have coin, game has wares.')

export const execute = shop

export default { command, execute }
