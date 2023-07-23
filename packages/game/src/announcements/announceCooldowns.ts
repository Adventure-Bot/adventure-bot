import { TextChannel } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import { getCooldownRemaining } from '@adventure-bot/game/character'
import adventure from '@adventure-bot/game/commands/adventure'
import heal from '@adventure-bot/game/commands/heal'
import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { cooldownStarted } from '@adventure-bot/game/store/slices/characters'
import { sleep } from '@adventure-bot/game/utils'

export function announceCooldowns(channel: TextChannel): void {
  startAppListening({
    actionCreator: cooldownStarted,
    effect: async ({ payload: { characterId, cooldown, interaction } }) => {
      if (process.env.COOLDOWNS_DISABLED) return
      let remaining = getCooldownRemaining(characterId, cooldown)
      while (remaining) {
        await sleep(remaining)
        remaining = getCooldownRemaining(characterId, cooldown)
      }
      const character = selectCharacterById(store.getState(), characterId)
      if (!character) return
      const user = channel.guild.members.cache.get(character.id)
      if (!user) return
      const missingHealth =
        cooldown === 'heal'
          ? `\n(${character.statsModified.maxHP - character.hp} health missing)`
          : ''
      const message = await channel.send(
        `${user}, it's your turn to ${Emoji(
          cooldown
        )} \`/${cooldown}\`!${missingHealth}`
      )
      await message.react(Emoji(cooldown))
      const collected = await message
        .awaitReactions({
          filter: (reaction, user) =>
            [cooldown, Emoji(cooldown)].includes(String(reaction.emoji.name)) &&
            user.id === characterId,
          max: 1,
          time: 5 * 60000,
          errors: ['time'],
        })
        .catch(() => null)
        .finally(() => message.reactions.removeAll())
      if (!collected) return
      switch (collected.first()?.emoji.name) {
        case Emoji('adventure'):
        case 'adventure':
          await adventure.execute({ interaction })
          break
        case Emoji('heal'):
        case 'heal':
          await heal.execute({ interaction })
          break
      }
    },
  })
}
