import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js'
import { clamp } from 'remeda'

import { Emoji } from '@adventure-bot/Emoji'
import { Manifest } from '@adventure-bot/asset-manifest'
import { getUserCharacter } from '@adventure-bot/character'
import { hpBarField } from '@adventure-bot/character'
import { isPotion } from '@adventure-bot/equipment/equipment'
import { itemSelect } from '@adventure-bot/equipment/itemSelect'
import { usableInventory } from '@adventure-bot/equipment/usableInventory'
import { randomArrayElement } from '@adventure-bot/monster'
import { createEffect } from '@adventure-bot/statusEffects'
import { statusEffectEmbed } from '@adventure-bot/statusEffects/statusEffectEmbed'
import { EffectTemplate } from '@adventure-bot/statusEffects/templates'
import store from '@adventure-bot/store'
import { selectCharacterById } from '@adventure-bot/store/selectors'
import {
  effectAdded,
  healed,
  itemRemoved,
} from '@adventure-bot/store/slices/characters'
import { d } from '@adventure-bot/utils'
import { asset } from '@adventure-bot/utils'

/**
 * Prompt to equip from available inventory items.
 * @param interaction
 * @returns
 */
export const useInventoryItemPrompt = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user)
  const inventory = usableInventory(character)
  if (inventory.length === 0) {
    interaction.editReply({
      content: 'No inventory items available to use',
    })
    return
  }
  const message = await interaction.followUp({
    content: 'What would you like to use?',
    components: [
      new MessageActionRow({
        components: [
          itemSelect({
            inventory: inventory,
            placeholder: 'Choose an item to use.',
          }),
        ],
      }),
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: 'done',
            style: 'PRIMARY',
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
      const character = getUserCharacter(interaction.user)
      useInventoryItem({
        itemId: item.id,
        characterId: character.id,
        interaction,
      })
    }
  }
}

const potionArt: {
  [key in EffectTemplate]: Manifest['fantasy']['items']
} = {
  aggression: 'magic potion with glowing orange liquid',
  frailty: 'magic potion with glowing purple liquid',
  invigorated: 'magic potion with glowing white liquid',
  might: 'magic potion with glowing red liquid',
  protectedEffect: 'magic potion with glowing yellow liquid',
  slayer: 'magic potion with glowing green liquid',
}

function useInventoryItem({
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
    const embeds = []
    if (item.useEffects.randomEffect) {
      const effectId = randomArrayElement(item.useEffects.randomEffect)
      const effect = createEffect(effectId)
      store.dispatch(effectAdded({ characterId, effect }))
      const { s3Url } = asset('fantasy', 'items', potionArt[effectId])
      embeds.push(
        statusEffectEmbed(effect, interaction)
          .setImage(s3Url)
          .setThumbnail(character.profile)
      )
    }
    if (item.useEffects.maxHeal) {
      const rawHeal = d(item.useEffects.maxHeal)
      const healAmount = clamp(rawHeal, {
        max: character.statsModified.maxHP - character.hp,
      })
      store.dispatch(
        healed({
          amount: healAmount,
          characterId: character.id,
        })
      )
      embeds.push(
        new MessageEmbed({
          title: `${character.name} healed +${healAmount} ${Emoji(
            interaction,
            'heal'
          )}`,
          fields: [
            hpBarField({
              character,
              adjustment: healAmount,
            }),
          ],
        })
          .setImage(
            asset(
              'fantasy',
              'items',
              'magic potion with glowing red liquid',
              item.id
            ).s3Url
          )
          .setThumbnail(character.profile)
      )
    }
    store.dispatch(itemRemoved({ itemId, characterId }))
    interaction.followUp({
      content: `${character.name} drank a ${item.name}`,
      embeds,
    })
  }
}
