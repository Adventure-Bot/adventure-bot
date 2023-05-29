import { Client, MessageEmbed } from 'discord.js'
import moment from 'moment'

import {
  LootResult,
  decoratedName,
  getCharacter,
} from '@adventure-bot/game/character'
import { heavyCrownId, itemEmbed } from '@adventure-bot/game/equipment'
import store from '@adventure-bot/game/store'
import { itemReceived } from '@adventure-bot/game/store/actions'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import {
  selectCharacterById,
  selectLastChannelUsed,
} from '@adventure-bot/game/store/selectors'
import { looted } from '@adventure-bot/game/store/slices/characters'
import { asset } from '@adventure-bot/game/utils'

export function announceCrownLoots(client: Client): void {
  startAppListening({
    actionCreator: looted,
    effect: ({ payload }) => {
      if (payload.itemsTaken.some((item) => item.id === heavyCrownId))
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
              `${character.name} has acquired the crown and their rule will become sovereign in twenty four ours at precisely:`,
              ``,
              moment()
                .add(1, 'days')
                .format('h:mm a [on] dddd, [the] Do [day of] MMMM, YYYY'),
              ``,
              `If you do not wish to submit to their rule, rise up!`,
            ].join('\n'),
          }).setImage(asset('fantasy', 'items', 'crown').s3Url),
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
        .setImage(asset('fantasy', 'items', 'crown').s3Url)
        .setThumbnail(looter.profile),
    ],
  })
}
export function announceLoots(client: Client): void {
  startAppListening({
    actionCreator: looted,
    effect: ({ payload: loot }) => {
      const state = store.getState()
      const looter = selectCharacterById(state, loot.looterId)
      const target = selectCharacterById(state, loot.targetId)
      if (!looter || !target) return
      const lastChannelId = selectLastChannelUsed(state)
      const channel = client.channels.cache.get(lastChannelId)
      if (!channel?.isText()) return
      if (loot.goldTaken === 0 && loot.itemsTaken.length === 0) return
      channel.send({
        embeds: [
          new MessageEmbed({
            title: `${decoratedName(looter)} looted ${decoratedName(target)}`,
          })
            .setImage(target.profile)
            .setThumbnail(looter.profile),
          ...loot.itemsTaken.map((item) =>
            itemEmbed({ item }).setTitle(
              `${decoratedName(looter)} looted ${decoratedName(target)}'s ${
                item.name
              }`
            )
          ),
        ],
      })
    },
  })
}
