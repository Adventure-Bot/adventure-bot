import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ComponentType,
  EmbedBuilder,
  Message,
} from 'discord.js'
import { pipe, sort, take } from 'remeda'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { monster as monsterEncounter } from '@adventure-bot/game/encounters/monster'
import { getRoamingMonsters, monsterEmbed } from '@adventure-bot/game/monster'
import {
  CommandHandlerOptions,
  asset,
  randomArrayElement,
} from '@adventure-bot/game/utils'

export const ranger = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  const roamingMonsters = pipe(
    getRoamingMonsters(),
    sort(() => Math.random() - 0.5),
    take(3)
  )

  const message = await interaction.channel?.send({
    embeds: [
      new EmbedBuilder({
        title: `${decoratedName(character)} encountered a ranger!`,
        color: Colors.Green,
        description: `A seasoned traveler greets you. They've seen monster tracks in the area and can guide you to them.\n\nWhich do you seek?`,
      }).setImage(
        randomArrayElement([asset('fantasy', 'characters', 'ranger')]).s3Url
      ),
      ...roamingMonsters.map(monsterEmbed),
    ],
    components: [
      new ActionRowBuilder<ButtonBuilder>({
        components: [
          ...roamingMonsters.map(
            (monster) =>
              new ButtonBuilder({
                customId: monster.id,
                label: monster.name,
                style: ButtonStyle.Primary,
              })
          ),
          new ButtonBuilder({
            customId: 'leave',
            label: 'Leave',
            style: ButtonStyle.Secondary,
          }),
        ],
      }),
    ],
  })

  if (!(message instanceof Message)) return

  const response = await message
    .awaitMessageComponent({
      componentType: ComponentType.Button,
      filter: (i) => {
        i.deferUpdate()
        return i.user.id === interaction.user.id
      },
    })
    .finally(() => message.edit({ components: [] }))

  if (!response.isButton()) return
  if (response.customId === 'leave') {
    return
  }

  const selectedMonster = roamingMonsters.find(
    (monster) => monster.id === response.customId
  )
  if (!selectedMonster) {
    await interaction.channel?.send('Monster not found.')
    return
  }

  await monsterEncounter({
    interaction,
    monster: selectedMonster,
  })
}
