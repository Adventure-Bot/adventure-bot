import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js'
import { filter } from 'remeda'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import {
  angels,
  cave,
  chest,
  divineBlessing,
  fairyWell,
  monster,
  shop,
  tavern,
  trap,
  travel,
} from '@adventure-bot/game/encounters'
import { randomShrine } from '@adventure-bot/game/encounters/shrine'
import {
  CommandHandlerOptions,
  asset,
  randomArrayElement,
  weightedTable,
} from '@adventure-bot/game/utils'

type EncounterId =
  | 'divineBlessing'
  | 'fairyWell'
  | 'shop'
  | 'tavern'
  | 'trap'
  | 'travel'
  | 'monster'
  | 'chest'
  | 'randomShrine'
  | 'angels'
  | 'cave'

const labels: Record<EncounterId, string> = {
  divineBlessing: 'Divine Blessing',
  angels: 'Angels',
  fairyWell: 'Fairy Well',
  shop: 'Shop',
  tavern: 'Tavern',
  trap: 'Trap',
  travel: 'Travel',
  monster: 'Monster',
  chest: 'Chest',
  randomShrine: 'Shrine',
  cave: 'Cave',
}

export const cairns = async ({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)

  const randomOption = ({ omit }: { omit?: EncounterId } = {}) =>
    weightedTable<EncounterId>(
      filter(
        [
          [0.2, 'divineBlessing'],
          [character.quests.healer ? 0 : 0.5, 'angels'],
          [1, 'fairyWell'],
          [1, 'shop'],
          [1, 'tavern'],
          [1, 'trap'],
          [1, 'travel'],
          [2, 'monster'],
          [2, 'cave'],
          [2, 'chest'],
          [2, 'randomShrine'],
        ],
        ([, id]) => id !== omit
      )
    )

  const option1 = randomOption()
  const option2 = randomOption({ omit: option1 })

  const message = await interaction[replyType]({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} found guidance in the cairns!`,
        color: 'YELLOW',
        description: `Choose your destiny.`,
      }).setImage(
        randomArrayElement([
          asset('fantasy', 'places', 'a glowing cairn set in the desert'),
          asset('fantasy', 'places', 'a glowing cairn set in the forest'),
          asset('fantasy', 'places', 'a glowing cairn set in the mountains'),
          asset('fantasy', 'places', 'a glowing cairn set in the plains'),
        ]).s3Url
      ),
    ],
    components: [
      new MessageActionRow({
        components: [
          new MessageButton({
            style: 'SECONDARY',
            label: labels[option1],
            customId: option1,
          }),
          new MessageButton({
            style: 'SECONDARY',
            label: labels[option2],
            customId: option2,
          }),
        ],
      }),
    ],
  })

  if (!(message instanceof Message)) return
  const response = await message
    .awaitMessageComponent({
      filter: (i) => {
        i.deferUpdate()
        return i.user.id === interaction.user.id
      },
      time: 60000,
    })
    .catch(() => null)
  message.edit({ components: [] })
  if (!response?.isButton()) {
    interaction.followUp(`Destiny does not wait forever.`)
    return
  }
  switch (response.customId) {
    case 'divineBlessing':
      divineBlessing({ interaction, replyType: 'followUp' })
      return
    case 'angels':
      angels({ interaction, replyType: 'followUp' })
      return
    case 'fairyWell':
      fairyWell({ interaction, replyType: 'followUp' })
      return
    case 'shop':
      shop({ interaction, replyType: 'followUp' })
      return
    case 'tavern':
      tavern({ interaction, replyType: 'followUp' })
      return
    case 'trap':
      trap({ interaction, replyType: 'followUp' })
      return
    case 'travel':
      travel({ interaction, replyType: 'followUp' })
      return
    case 'monster':
      monster({ interaction, replyType: 'followUp' })
      return
    case 'chest':
      chest({ interaction, replyType: 'followUp' })
      return
    case 'randomShrine':
      randomShrine()({ interaction, replyType: 'followUp' })
      return
    case 'cave':
      cave({ interaction, replyType: 'followUp' })
      return
  }
}
