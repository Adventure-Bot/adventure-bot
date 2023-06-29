import { Colors, EmbedBuilder } from 'discord.js'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import { decoratedName } from '@adventure-bot/game/character'
import { Monster } from '@adventure-bot/game/monster'

export const monsterEmbed = (monster: Monster): EmbedBuilder =>
  new EmbedBuilder({
    title: decoratedName(monster),
    color: Colors.Red,
  })
    .setImage(monster.profile)
    .addFields({
      name: 'Gold',
      value: EmojiValue('gold', monster.gold),
      inline: true,
    })
