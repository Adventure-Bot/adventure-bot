import { MessageEmbed } from 'discord.js'
import moment from 'moment'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import { crownArt } from '@adventure-bot/game/crown'
import store from '@adventure-bot/game/store'
import { selectLeaderBoard } from '@adventure-bot/game/store/selectors'

export function leaderboardEmbeds(): MessageEmbed[] {
  const { leaderboard, victoriesByCharacter } = selectLeaderBoard(
    store.getState()
  )
  const crown = crownArt()

  const embeds = [
    new MessageEmbed({
      title: 'Crown Leaderboard',
    }).setImage(crown.s3Url),
    ...(leaderboard.length === 0
      ? [
          new MessageEmbed({
            title: 'No winners yet. Be the first!',
          }),
        ]
      : leaderboard.map((score) =>
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
              ...(victoriesByCharacter[score.characterId] || []).map(
                (score) => ({
                  name: moment(score.date).format(
                    'dddd, MMMM Do YYYY, h:mm:ss a'
                  ),
                  value: EmojiValue('gold', score.winner.gold),
                  inline: false,
                })
              ),
            ],
          }).setImage(score.profile)
        )),
  ]
  return embeds
}
