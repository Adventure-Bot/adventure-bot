import { MessageEmbed } from 'discord.js'
import { getCrownArt } from '@adventure-bot/character/loot/getCrownArt'
import store from '@adventure-bot/store'
import { selectLeaderBoard } from '@adventure-bot/store/selectors'

export function leaderboard(): MessageEmbed[] {
  const { leaderboard } = selectLeaderBoard(store.getState())
  const crown = getCrownArt()

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
            value: `${score.wins}`,
            inline: true,
          },
          {
            name: 'Gold',
            value: `${score.gold}`,
            inline: true,
          },
        ],
      }).setImage(score.profile)
    ),
  ]
  return embeds
}
