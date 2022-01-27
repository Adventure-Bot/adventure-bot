import { MessageEmbed } from 'discord.js'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import { decoratedName } from '@adventure-bot/game/character'
import { Monster } from '@adventure-bot/game/monster'

export const monsterEmbed = (monster: Monster): MessageEmbed =>
  new MessageEmbed({
    title: decoratedName(monster),
    color: 'RED',
  })
    .setImage(monster.profile)
    .addField('Gold', EmojiValue('gold', monster.gold), true)
