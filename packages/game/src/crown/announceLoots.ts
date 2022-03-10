import { isAnyOf } from '@reduxjs/toolkit'
import { Client, MessageEmbed } from 'discord.js'
import moment from 'moment'

import {
  LootResult,
  decoratedName,
  getCharacter,
} from '@adventure-bot/game/character'
import { heavyCrownId } from '@adventure-bot/game/equipment'
import store from '@adventure-bot/game/store'
import { itemReceived } from '@adventure-bot/game/store/actions'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectLastChannelUsed } from '@adventure-bot/game/store/selectors'
import { characterLooted } from '@adventure-bot/game/store/slices/loots'
import { crownArt } from '@adventure-bot/game/utils'

export function announceLoots(client: Client): void {
  startAppListening({
    actionCreator: characterLooted,
    effect: ({ payload }) => {
      if (!payload.itemsTaken.some((item) => item.name === 'heavy crown'))
        return
      crownLootedAnnouncement({
        client,
        loot: payload,
      })
    },
  })
  console.log('announce loots start app listening for item received')
  startAppListening({
    matcher: isAnyOf(itemReceived),
    effect: (action) => {
      console.log('item received', action.payload)
      if (action.payload.item.id !== heavyCrownId) return
      crownReceivedAnnouncement({
        client,
      })
    },
  })
}

const crownReceivedAnnouncement = async ({ client }: { client: Client }) => {
  const state = store.getState()
  const lastChannelId = selectLastChannelUsed(state)
  const channel = client.channels.cache.get(lastChannelId)
  if (!channel?.isText()) return

  channel.send({
    embeds: [
      new MessageEmbed({
        title: 'The crown has been received!',
        color: 'YELLOW',
        description: [
          `Attention @here!`,
          ``,
          `The crown has been received!`,
          ``,
          `If you do not wish to submit to their rule, rise up!`,
        ].join('\n'),
      })
        .setImage(crownArt().s3Url)
        .setThumbnail(crownArt().s3Url),
    ],
  })
}

const crownLootedAnnouncement = async ({
  client,
  loot,
}: {
  client: Client
  loot: LootResult
}): Promise<void> => {
  const looter = getCharacter(loot.looterId)
  if (!looter) return

  const state = store.getState()
  const lastChannelId = selectLastChannelUsed(state)
  const channel = client.channels.cache.get(lastChannelId)
  if (!channel?.isText()) return

  channel.send({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(looter)} has taken the crown!`,
        color: 'YELLOW',
        description: [
          `Attention @here!`,
          ``,
          `${looter.name} has acquired the crown and their rule will become sovereign at:`,
          ``,
          moment()
            .add(1, 'days')
            .format('h:mm a [on] dddd, [the] Do [day of] MMMM, YYYY'),
          ``,
          `If you do not wish to submit to their rule, rise up!`,
        ].join('\n'),
      })
        .setImage(crownArt().s3Url)
        .setThumbnail(looter.profile),
    ],
  })
}
