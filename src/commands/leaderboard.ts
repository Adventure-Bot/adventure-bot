import { CommandInteraction, MessageEmbed } from 'discord.js'
import { getCrownArt } from '../character/loot/getCrownArt'
import { Emoji } from '../Emoji'
import store from '../store'
import { selectLeaderBoard } from '../store/selectors'

export async function leaderboard(
  interaction: CommandInteraction
): Promise<void> {
  const { leaderboard } = selectLeaderBoard(store.getState())
  const crown = getCrownArt()
  const embeds = leaderboard.map((score) =>
    new MessageEmbed({
      title: score.name,
      fields: [
        {
          name: 'Wins',
          value: `${Emoji(interaction, 'crown')} ${score.wins}`,
          inline: true,
        },
        {
          name: 'Gold',
          value: `${Emoji(interaction, 'gold')} ${score.gold}`,
          inline: true,
        },
      ],
    }).setImage(crown.s3Url)
  )

  await interaction.followUp({
    embeds,
  })
}
