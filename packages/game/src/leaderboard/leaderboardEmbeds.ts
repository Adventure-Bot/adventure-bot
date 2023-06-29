import { EmbedBuilder } from 'discord.js'
import moment from 'moment'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import { decoratedName } from '@adventure-bot/game/character'
import { chanceToFindCrown } from '@adventure-bot/game/crown/chanceToFindCrown'
import store from '@adventure-bot/game/store'
import { selectBearer } from '@adventure-bot/game/store/selectors'
import { timeTillSovereign } from '@adventure-bot/game/store/slices/crown'
import { asset } from '@adventure-bot/game/utils'

export function leaderboardEmbeds(): EmbedBuilder[] {
  const state = store.getState()
  const bearer = selectBearer(state)
  const { leaderboard, victoriesByCharacter } = state.leaderboard

  const gameEndsAt = moment(state.crown.claimedAt).add(timeTillSovereign)

  let embeds = [
    new EmbedBuilder({
      title: 'Crown Leaderboard',
    }).setImage(asset('fantasy', 'items', 'crown').s3Url),
  ]

  if (bearer && !state.crown.announced)
    embeds = embeds.concat(
      new EmbedBuilder({
        title: `Crown Bearer: ${bearer.name}`,
        description: `${decoratedName(
          bearer
        )} will win ${gameEndsAt.fromNow()}.`,
      }).setTimestamp(gameEndsAt.toDate())
    )

  if (!bearer)
    embeds = embeds.concat(
      new EmbedBuilder({
        title: 'Crown Chance',
        description: EmojiValue('crown', chanceToFindCrown()),
      })
    )

  if (leaderboard.length === 0)
    if (leaderboard.length)
      embeds = embeds.concat(
        leaderboard.map((score) =>
          new EmbedBuilder({
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
        )
      )

  return embeds
}
