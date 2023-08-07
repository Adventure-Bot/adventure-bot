import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ComponentType,
  EmbedBuilder,
  InteractionType,
} from 'discord.js'

import { Emoji, EmojiValue, d20Emoji } from '@adventure-bot/game/Emoji'
import {
  decoratedName,
  findOrCreateCharacter,
  hpBarField,
} from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import {
  damaged,
  goldStolen,
  itemRemoved,
} from '@adventure-bot/game/store/slices/characters'
import {
  CommandHandlerOptions,
  d,
  randomArrayElement,
} from '@adventure-bot/game/utils'

export const thugs = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const send = interaction.channel?.send.bind(interaction.channel)
  if (!send) return
  const character = findOrCreateCharacter(interaction.user)
  const equipment = character.equipment
  const unequipped = character.inventory.filter(
    (item) =>
      !Object.values(equipment)
        .map((i) => i?.id)
        .includes(item.id)
  )
  const dropped = {
    item: randomArrayElement(unequipped),
    gold: Math.floor(character.gold / (5 + d(4))),
  }

  if (!dropped.item && !dropped.gold) {
    await send({
      embeds: [
        new EmbedBuilder({
          title: `${decoratedName(character)} encountered some thugs!`,
          color: Colors.Grey,
          description: `A foot comes out of nowhere, you trip and fall. You hear laughter and footsteps fade into the distance.`,
        }),
      ],
    })
    return
  }

  const components = []
  if (dropped.item)
    components.push(
      new ButtonBuilder({
        customId: 'item',
        label: dropped.item.name,
        style: ButtonStyle.Primary,
      })
    )
  if (dropped.gold)
    components.push(
      new ButtonBuilder({
        customId: 'gold',
        label: `${dropped.gold} gold`,
        style: ButtonStyle.Primary,
      })
    )
  components.push(
    new ButtonBuilder({
      customId: 'flee',
      label: 'Your life',
      style: ButtonStyle.Secondary,
    })
  )

  const lootDropped = `${dropped.item ? `${dropped.item.name} ` : ''}${
    dropped.gold ? `and ${EmojiValue('gold', dropped.gold)}` : ''
  }`
  const plural = dropped.item && dropped.gold

  const message = await send({
    embeds: [
      new EmbedBuilder({
        title: `${decoratedName(character)} encountered a gang of thugs!`,
        color: Colors.DarkButNotBlack,
        description: `A foot comes out of nowhere, you trip and fall. Your ${lootDropped} spill${
          plural ? '' : 's'
        } to the floor and figures dash in from the shadows!`,
      }),
    ],
    components: [
      new ActionRowBuilder<ButtonBuilder>({
        components,
      }),
    ],
  })

  const response = await message
    .awaitMessageComponent({
      componentType: ComponentType.Button,
      filter: (i) => {
        return i.user.id === interaction.user.id
      },
    })
    .finally(() => message.edit({ components: [] }))

  if (response.type !== InteractionType.MessageComponent) return
  if (response.customId === 'flee') {
    await send({
      embeds: [
        new EmbedBuilder({
          title: `${character.name} fled!`,
          color: Colors.Yellow,
          description: `You favor your flesh and flee.`,
        }),
      ],
    })
  }
  if (response.customId !== 'flee') {
    const attack = d(20) + 5
    const damage = d(6) + 3
    if (attack > character.statsModified.ac) {
      store.dispatch(
        damaged({
          amount: damage,
          character,
        })
      )
      await send({
        content: d20Emoji(attack) + Emoji('hit'),
        embeds: [
          new EmbedBuilder({
            title: `${character.name} got stabbed!`,
            color: Colors.Red,
            fields: [hpBarField({ character, adjustment: -damage })],
          }),
        ],
      })
    } else {
      await send({
        content: d20Emoji(attack) + Emoji('miss'),
        embeds: [
          new EmbedBuilder({
            title: `${character.name} narrowly dodges a blade!`,
            color: Colors.Green,
          }),
        ],
      })
    }
  }
  const conscious = findOrCreateCharacter(interaction.user).hp > 0

  // item recovery
  if (conscious && dropped.item && response.customId === 'item') {
    await send({
      embeds: [
        new EmbedBuilder({
          title: `${character.name} recovered their ${dropped.item.name}!`,
          color: Colors.Green,
          description: `You quickly grab your ${dropped.item.name}!`,
        }),
      ],
    })
  }
  // item lost
  if (dropped.item && (response.customId !== 'item' || !conscious)) {
    store.dispatch(
      itemRemoved({ characterId: character.id, itemId: dropped.item.id })
    )
    await send({
      embeds: [
        new EmbedBuilder({
          title: `${character.name} lost their ${dropped.item.name}!`,
          color: Colors.Red,
        }),
      ],
    })
  }
  // gold recovery
  if (conscious && dropped.gold && response.customId === 'gold') {
    await send({
      embeds: [
        new EmbedBuilder({
          title: `${character.name} recovered their ${EmojiValue(
            'gold',
            dropped.gold
          )}!`,
          color: Colors.Green,
          description: `You scramble and pick up your ${EmojiValue(
            'gold',
            dropped.gold
          )}!`,
          fields: [
            {
              name: 'Your gold',
              value: EmojiValue('gold', character.gold - dropped.gold),
            },
          ],
        }),
      ],
    })
  }

  // gold lost
  if (dropped.gold && (response.customId !== 'gold' || !conscious)) {
    store.dispatch(
      goldStolen({
        attackerId: 'Thugs',
        defenderId: character.id,
        amount: dropped.gold,
      })
    )
  }
}
