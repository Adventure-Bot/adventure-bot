import { EmbedBuilder, Message } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { barFight } from '@adventure-bot/game/encounters/tavern/barFight'
import { chattyTavernkeepers } from '@adventure-bot/game/encounters/tavern/chattyTavernkeepers'
import { restfulNight } from '@adventure-bot/game/encounters/tavern/restfulNight'
import store from '@adventure-bot/game/store'
import { selectAvailableQuests } from '@adventure-bot/game/store/selectors'
import {
  CommandHandlerOptions,
  sleep,
  weightedTable,
} from '@adventure-bot/game/utils'
import { asset } from '@adventure-bot/game/utils'

export const tavern = async ({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  const message = await interaction[replyType]({
    embeds: [
      new EmbedBuilder({
        title: `${decoratedName(character)} found a tavern.`,
        color: 0x964b00,
        description: `You find a tavern and hope for a soft bed, warm meal, and strong drink...`,
      })
        .setImage(asset('fantasy', 'places', 'tavern').s3Url)
        .setThumbnail(character.profile),
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
