import { CommandInteraction } from "discord.js";
import { Character } from "../character/Character";
import { adjustGold } from "../character/adjustGold";
import { itemReceived } from "../store/slices/characters";
import store from "../store";
import { equipItemPrompt } from "../equipment/equipItemPrompt";
import { Item } from "../equipment/Item";
import { itemCreated } from "../store/slices/items";

export const buyItem = async (
  interaction: CommandInteraction,
  player: Character,
  item: Item
): Promise<void> => {
  if (player.gold < item.goldValue) {
    await interaction.followUp(
      `You cannot afford the ${item.name}. You have only ${player.gold} gold and it costs ${item.goldValue}.`
    );
    return;
  }
  adjustGold(player.id, -item.goldValue);
  store.dispatch(itemCreated(item));
  store.dispatch(
    itemReceived({
      characterId: player.id,
      item,
    })
  );
  await equipItemPrompt(interaction, item);
  equipItemPrompt(interaction, item);
};
