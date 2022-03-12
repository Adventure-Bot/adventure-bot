import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js'

import { decoratedName, getUserCharacter } from '@adventure-bot/game/character'
import {
  angels,
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
}

const encounters: Record<
  EncounterId,
  () => (interaction: CommandInteraction) => Promise<void>
> = {
  divineBlessing: () => divineBlessing,
  angels: () => angels,
  fairyWell: () => fairyWell,
  shop: () => shop,
  tavern: () => tavern,
  trap: () => trap,
  travel: () => travel,
  monster: () => monster,
  chest: () => chest,
  randomShrine,
}

export const cairns = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user)

  const randomOption = () =>
    weightedTable<EncounterId>([
      [0.2, 'divineBlessing'],
      [character.quests.healer ? 0 : 0.5, 'angels'],
      [1, 'fairyWell'],
      [1, 'shop'],
      [1, 'tavern'],
      [1, 'trap'],
      [1, 'travel'],
      [2, 'monster'],
      [2, 'chest'],
      [2, 'randomShrine'],
    ])

  const option1 = randomOption()
  const option2 = randomOption()

  const message = await interaction.editReply({
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
      filter: (interaction) => {
        interaction.deferUpdate()
        return interaction.user.id === interaction.user.id
      },
      time: 60000,
    })
    .catch(() => {
      message.edit({ components: [] })
    })
  if (!response?.isButton()) return
  if (response.customId === option1) {
    encounters[option1]()(interaction)
  } else {
    encounters[option2]()(interaction)
  }
}
