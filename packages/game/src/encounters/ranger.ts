import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
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
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  const roamingMonsters = pipe(
    getRoamingMonsters(),
    sort(() => Math.random() - 0.5),
    take(3)
  )

  const message = await interaction[replyType]({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} encountered a ranger!`,
        color: 'GREEN',
        description: `A seasoned traveler greets you. They've seen monster tracks in the area and can guide you to them.\n\nWhich do you seek?`,
      }).setImage(
        randomArrayElement([
          asset('fantasy', 'places', 'a lone traveler in the desert'),
          asset('fantasy', 'places', 'a lone traveler in the forest'),
          asset('fantasy', 'places', 'a lone traveler in the mountains'),
          asset('fantasy', 'places', 'a lone traveler in the plains'),
        ]).s3Url
      ),
      ...roamingMonsters.map(monsterEmbed),
    ],
    components: [
      new MessageActionRow({
        components: [
          ...roamingMonsters.map(
            (monster) =>
              new MessageButton({
                customId: monster.id,
                label: monster.name,
                style: 'PRIMARY',
              })
          ),
          new MessageButton({
            customId: 'leave',
            label: 'Leave',
            style: 'PRIMARY',
          }),
        ],
      }),
    ],
  })

  if (!(message instanceof Message)) return

  const response = await message
    .awaitMessageComponent({
      componentType: 'BUTTON',
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
    await interaction.followUp('Monster not found.')
    return
  }

  await monsterEncounter({
    interaction,
    monster: selectedMonster,
    replyType: 'followUp',
  })
}
