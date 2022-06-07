import { MessageEmbed } from 'discord.js'
import moment from 'moment'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import { decoratedName } from '@adventure-bot/game/character'
import { crownArt } from '@adventure-bot/game/crown'
import store from '@adventure-bot/game/store'
import { selectBearer } from '@adventure-bot/game/store/selectors'
import { timeTillSovereign } from '@adventure-bot/game/store/slices/crown'

export function leaderboardEmbeds(): MessageEmbed[] {
  const state = store.getState()
  const bearer = selectBearer(state)
  const { leaderboard, victoriesByCharacter } = state.leaderboard

  const gameEndsAt = moment(state.crown.claimedAt).add(timeTillSovereign)

  const crown = crownArt()

  let embeds = [
    new MessageEmbed({
      title: 'Crown Leaderboard',
    }).setImage(crown.s3Url),
  ]

  if (bearer && !state.crown.announced)
    embeds = embeds.concat(
      new MessageEmbed({
        title: `Crown Bearer: ${bearer.name}`,
        description: `${decoratedName(
          bearer
        )} will win ${gameEndsAt.fromNow()}.`,
      }).setTimestamp(gameEndsAt.toDate())
    )

  if (leaderboard.length === 0)
    if (leaderboard.length)
      embeds = embeds.concat(
        leaderboard.map((score) =>
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
        )
      )

  return embeds
}
