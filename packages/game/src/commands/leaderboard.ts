import { MessageEmbed } from 'discord.js'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import store from '@adventure-bot/game/store'
import { selectLeaderBoard } from '@adventure-bot/game/store/selectors'
import { crownArt } from '@adventure-bot/game/utils'

export function leaderboard(): MessageEmbed[] {
  const { leaderboard } = selectLeaderBoard(store.getState())
  const crown = crownArt()

  const embeds = [
    new MessageEmbed({
      title: 'Crown Leaderboard',
    }).setImage(crown.s3Url),
    ...leaderboard.map((score) =>
      new MessageEmbed({
        title: score.name,
        fields: [
          {
            name: 'Wins',
            value: EmojiValue('crown', score.wins),
            inline: true,
          },
          {
            name: 'Gold',
            value: EmojiValue('gold', score.gold),
            inline: true,
          },
        ],
      }).setImage(score.profile)
    ),
  ]
  return embeds
}
