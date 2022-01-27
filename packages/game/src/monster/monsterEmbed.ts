import { MessageEmbed } from 'discord.js'

import { EmojiValue } from '@adventure-bot/Emoji'
import { decoratedName } from '@adventure-bot/character'
import { Monster } from '@adventure-bot/monster'

export const monsterEmbed = (monster: Monster): MessageEmbed =>
  new MessageEmbed({
    title: decoratedName(monster),
    color: 'RED',
  })
    .setImage(monster.profile)
    .addField('Gold', EmojiValue('gold', monster.gold), true)
