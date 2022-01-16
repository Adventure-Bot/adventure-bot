import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { itemSelect } from "./itemSelect";
import store from "../store";
import { healed, itemRemoved } from "../store/slices/characters";
import { usableInventory } from "./usableInventory";
import { isPotion } from "./equipment";
import { d } from "../utils/dice";
import { selectCharacterById } from "../store/selectors";
import { clamp } from "remeda";
import { Emoji } from "../Emoji";
import { getAsset } from "../utils/getAsset";
import { hpBarField } from "../character/hpBar/hpBarField";

/**
 * Prompt to equip from available inventory items.
 * @param interaction
 * @returns
 */
export const useInventoryItemPrompt = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  const inventory = usableInventory(character);
  if (inventory.length === 0) {
    interaction.editReply({
      content: "No inventory items available to use",
    });
    return;
  }
  const message = await interaction.followUp({
    content: "What would you like to use?",
    components: [
      new MessageActionRow({
        components: [
          itemSelect({
            inventory: inventory,
            placeholder: "Choose an item to use.",
          }),
        ],
      }),
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: "done",
            style: "PRIMARY",
            label: "Done",
          }),
        ],
      }),
    ],
  });
  if (!(message instanceof Message)) return;

  let done = false;

  while (!done) {
    const response = await message
      .awaitMessageComponent({
        filter: (interaction) => {
          interaction.deferUpdate();
          return interaction.user.id === interaction.user.id;
        },
        time: 60000,
      })
      .catch(() => {
        message.edit({ components: [] });
      });
    if (!response) return;
    if (response.isButton() && response.customId === "done") {
      message.delete();
      done = true;
    }
    if (response.isSelectMenu()) {
      const item = inventory[parseInt(response.values[0])];
      const character = getUserCharacter(interaction.user);
      interaction.followUp(`${character.name} uses their ${item.name}...`);
      useInventoryItem({
        itemId: item.id,
        characterId: character.id,
        interaction,
      });
    }
  }
};

function useInventoryItem({
  itemId,
  characterId,
  interaction,
}: {
  itemId: string;
  characterId: string;
  interaction: CommandInteraction;
}) {
  const character = selectCharacterById(store.getState(), characterId);
  if (!character) return;
  const item = character.inventory.find((i) => i.id === itemId);
  if (!item) return;
  if (isPotion(item)) {
    if (item.useEffects.maxHeal) {
      const rawHeal = d(item.useEffects.maxHeal);
      const healAmount = clamp(rawHeal, {
        max: character.statsModified.maxHP - character.hp,
      });

      store.dispatch(
        healed({
          amount: healAmount,
          characterId: character.id,
        })
      );
      store.dispatch(itemRemoved({ itemId, characterId }));
      interaction.followUp({
        embeds: [
          new MessageEmbed({
            title: `${
              character.name
            } drank a potion and healed +${healAmount} ${Emoji(
              interaction,
              "heal"
            )}`,
            fields: [
              hpBarField({
                character,
                adjustment: healAmount,
              }),
            ],
          })
            .setImage(
              getAsset(
                "fantasy",
                "items",
                "magic potion with glowing red liquid"
              ).s3Url()
            )
            .setThumbnail(character.profile),
        ],
      });
    }
  }
}
