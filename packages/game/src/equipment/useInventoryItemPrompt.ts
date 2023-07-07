import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  Message,
  StringSelectMenuBuilder,
} from 'discord.js'
import { clamp } from 'remeda'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import {
  isPotion,
  itemSelect,
  usableInventory,
} from '@adventure-bot/game/equipment'
import { createEffect } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import {
  healed,
  itemRemoved,
} from '@adventure-bot/game/store/slices/characters'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'
import { asset, d, randomArrayElement } from '@adventure-bot/game/utils'

/**
 * Prompt to equip from available inventory items.
 * @param interaction
 * @returns
 */
export const useInventoryItemPrompt = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  const inventory = usableInventory(character)
  if (inventory.length === 0) {
    interaction.channel?.send({
      content: 'No inventory items available to use',
    })
    return
  }
  const message = await interaction.channel?.send({
    content: 'What would you like to use?',
    components: [
      new ActionRowBuilder<StringSelectMenuBuilder>({
        components: [
          itemSelect({
            inventory: inventory,
            placeholder: 'Choose an item to use.',
          }),
        ],
      }),
      new ActionRowBuilder<ButtonBuilder>({
        components: [
          new ButtonBuilder({
            customId: 'done',
            style: ButtonStyle.Primary,
            label: 'Done',
          }),
        ],
      }),
    ],
  })
  if (!(message instanceof Message)) return

  let done = false

  while (!done) {
    const response = await message
      .awaitMessageComponent({
        filter: (interaction) => {
          interaction.deferUpdate()
          return interaction.user.id === interaction.user.id
        },
        time: 60000,
      })
      .catch(() => {
        message.edit({ components: [] })
      })
    if (!response) return
    if (response.isButton() && response.customId === 'done') {
      message.delete()
      done = true
    }
    if (response.isSelectMenu()) {
      const item = inventory[parseInt(response.values[0])]
      const character = findOrCreateCharacter(interaction.user)
      await useInventoryItem({
        itemId: item.id,
        characterId: character.id,
        interaction,
      })
    }
  }
}

async function useInventoryItem({
  itemId,
  characterId,
  interaction,
}: {
  itemId: string
  characterId: string
  interaction: CommandInteraction
}) {
  const character = selectCharacterById(store.getState(), characterId)
  if (!character) return
  const item = character.inventory.find((i) => i.id === itemId)
  if (!item) return
  if (isPotion(item)) {
    const embed = new EmbedBuilder({
      title: `${character.name} drank a ${item.name}`,
    }).setThumbnail(character.profile)
    if (item.asset)
      embed.setImage(asset('fantasy', 'items', item.asset, item.id).s3Url)
    await interaction.channel?.send({
      embeds: [embed],
    })
    store.dispatch(itemRemoved({ itemId, characterId }))
    if (item.useEffects.maxHeal) {
      const rawHeal = d(item.useEffects.maxHeal)
      const healAmount = clamp(rawHeal, {
        max: character.statsModified.maxHP - character.hp,
      })
      store.dispatch(
        healed({
          amount: healAmount,
          character,
        })
      )
    }
    if (item.useEffects.randomEffect) {
      store.dispatch(
        effectAdded({
          interaction,
          character,
          effect: createEffect(
            randomArrayElement(item.useEffects.randomEffect)
          ),
        })
      )
    }
  }
}
