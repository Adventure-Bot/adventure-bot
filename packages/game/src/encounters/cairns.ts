import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  Message,
} from 'discord.js'
import { filter } from 'remeda'

import { EmojiValue } from '@adventure-bot/game/Emoji'
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
  townSquare,
  trap,
  travel,
} from '@adventure-bot/game/encounters'
import { randomShrine } from '@adventure-bot/game/encounters/shrine'
import {
  CommandHandlerOptions,
  asset,
  isKeyOfObject,
  randomArrayElement,
  weightedTable,
} from '@adventure-bot/game/utils'

type EncounterId =
  | 'angels'
  | 'cave'
  | 'chest'
  | 'divineBlessing'
  | 'fairyWell'
  | 'monster'
  | 'randomShrine'
  | 'shop'
  | 'tavern'
  | 'townSquare'
  | 'trap'
  | 'travel'

const labels: Record<EncounterId, string> = {
  angels: 'Angels',
  cave: 'Cave',
  chest: 'Chest',
  divineBlessing: 'Divine Blessing',
  fairyWell: 'Fairy Well',
  monster: 'Monster',
  randomShrine: 'Shrine',
  shop: 'Shop',
  tavern: 'Tavern',
  townSquare: 'Town Square',
  trap: 'Trap',
  travel: 'Travel',
}

export const cairns = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)

  const randomOption = ({ omit }: { omit?: EncounterId } = {}) =>
    weightedTable<EncounterId>(
      filter(
        [
          [0.2, 'divineBlessing'],
          [character.quests.healer ? 0 : 0.5, 'angels'],
          [1, 'fairyWell'],
          [1, 'trap'],
          [1, 'travel'],
          [2, 'monster'],
          [2, 'cave'],
          [2, 'chest'],
          [2, 'randomShrine'],
          [2, 'townSquare'],
        ],
        ([, id]) => id !== omit
      )
    )

  const option1 = randomOption()
  const option2 = randomOption({ omit: option1 })

  const yourGold = [option1, option2].includes('shop')
    ? `Your gold: ${EmojiValue('gold', character.gold)}`
    : ''

  const description = [`Choose your destiny.`, yourGold]
    .filter(Boolean)
    .join('\n')

  const message = await interaction.channel?.send({
    embeds: [
      new EmbedBuilder({
        title: `${decoratedName(character)} found guidance in the cairns!`,
        color: Colors.Yellow,
        description,
      }).setImage(
        randomArrayElement([asset('fantasy', 'places', 'cairn')]).s3Url
      ),
    ],
    components: [
      new ActionRowBuilder<ButtonBuilder>({
        components: [
          new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: labels[option1],
            customId: option1,
          }),
          new ButtonBuilder({
            style: ButtonStyle.Secondary,
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
    interaction.channel?.send(`Destiny does not wait forever.`)
    return
  }

  const handlers = {
    angels,
    cave,
    chest,
    divineBlessing,
    fairyWell,
    monster,
    randomShrine: randomShrine(),
    shop,
    tavern,
    trap,
    travel,
    townSquare,
  }

  if (isKeyOfObject(response.customId, handlers)) {
    handlers[response.customId]({ interaction })
  } else {
    interaction.channel?.send(`${response.customId} is not a valid option.`)
  }
}
