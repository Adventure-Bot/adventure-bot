import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js'
import { clamp } from 'remeda'

import { EmojiModifier } from '@adventure-bot/game/Emoji'
import { Manifest } from '@adventure-bot/game/asset-manifest'
import {
  findOrCreateCharacter,
  hpBarField,
} from '@adventure-bot/game/character'
import {
  isPotion,
  itemSelect,
  usableInventory,
} from '@adventure-bot/game/equipment'
import { createEffect } from '@adventure-bot/game/statusEffects'
import { EffectId } from '@adventure-bot/game/statusEffects'
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
      const character = findOrCreateCharacter(interaction.user)
      await useInventoryItem({
        itemId: item.id,
        characterId: character.id,
        interaction,
      })
    }
  }
}

const potionArt: {
  [key in EffectId]: Manifest['fantasy']['items']
} = {
  aggression: 'magic potion with glowing orange liquid',
  frailty: 'magic potion with glowing purple liquid',
  invigorated: 'magic potion with glowing white liquid',
  might: 'magic potion with glowing red liquid',
  protectedEffect: 'magic potion with glowing yellow liquid',
  slayer: 'magic potion with glowing green liquid',
  blind: 'magic potion with glowing blue liquid',
  haste: 'magic potion with vapors',
  stunned: 'magic potion with glowing white liquid',
  slowed: 'magic potion with glowing blue liquid',
  poisoned: 'magic potion with glowing green liquid',
  blessed: 'magic potion with glowing yellow liquid',
  survivor: 'magic potion with glowing white liquid',
  healer: 'magic potion with glowing white liquid',
  rogue: 'magic potion with dark cloudy liquid',
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
    const embeds = []
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
      embeds.push(
        new MessageEmbed({
          title: `${character.name} healed ${EmojiModifier(
            'heal',
            healAmount
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
    const message = await interaction.followUp({
      content: `${character.name} drank a ${item.name}`,
      embeds,
      fetchReply: true,
    })
    if (item.useEffects.randomEffect) {
      const effectId = randomArrayElement(item.useEffects.randomEffect)
      const effect = createEffect(effectId)
      store.dispatch(
        effectAdded({
          character,
          effect,
          image: asset('fantasy', 'items', potionArt[effectId]).s3Url,
          messageId: message.id,
        })
      )
    }
  }
}
