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
import {
  selectCharacterById,
  selectLastChannelUsed,
} from '@adventure-bot/game/store/selectors'
import { characterLooted } from '@adventure-bot/game/store/slices/loots'
import { crownArt } from '@adventure-bot/game/utils'

export function announceCrownLoots(client: Client): void {
  startAppListening({
    actionCreator: characterLooted,
    effect: ({ payload }) => {
      if (!payload.itemsTaken.some((item) => item.id === heavyCrownId)) return
      announceCrownLooted({
        client,
        loot: payload,
      })
    },
  })
  startAppListening({
    actionCreator: itemReceived,
    effect: (action) => {
      if (action.payload.item.id !== heavyCrownId) return
      const state = store.getState()
      const lastChannelId = selectLastChannelUsed(state)
      const character = selectCharacterById(state, action.payload.characterId)
      if (!character) return
      const channel = client.channels.cache.get(lastChannelId)
      if (!channel?.isText()) return

      channel.send({
        embeds: [
          new MessageEmbed({
            title: `${decoratedName(character)} found the crown!`,
            color: 'YELLOW',
            description: [
              `Attention @here!`,
              ``,
              `${character.name} has acquired the crown and their rule will become sovereign at:`,
              ``,
              moment()
                .add(1, 'days')
                .format('h:mm a [on] dddd, [the] Do [day of] MMMM, YYYY'),
              ``,
              ``,
              `If you do not wish to submit to their, rise up!`,
            ].join('\n'),
          })
            .setImage(crownArt().s3Url)
            .setThumbnail(crownArt().s3Url),
        ],
      })
    },
  })
}

const announceCrownLooted = async ({
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
        title: `${decoratedName(looter)} took the crown!`,
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
