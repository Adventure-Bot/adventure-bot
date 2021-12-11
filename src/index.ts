console.time("ready");
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { REST } from "@discordjs/rest";
import Discord, { Intents } from "discord.js";
import { exit } from "process";
import { Routes } from "discord-api-types/v9";
import commands from "./commands";

if (!process.env.token) exit(1);

const rest = new REST({ version: "9" }).setToken(process.env.token);

const installCommands = async () => {
  if (!process.env.token || !process.env.CLIENT_ID || !process.env.GUILD_ID)
    return;

  try {
    const body = Array.from(commands.values()).map(({ command }) =>
      command.toJSON()
    );
    console.time("updating commands");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body,
      }
    );
    console.timeEnd("updating commands");
  } catch (error) {
    console.log(error);
  }
};

async function main() {
  await installCommands();

  const discordClient = new Discord.Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
  });

  discordClient.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    console.log("interactionCreate");
    console.time(interaction.commandName);
    try {
      await interaction.deferReply();
      const command = commands.get(interaction.commandName);
      if (!command) {
        interaction.editReply(`Command not found ${command}`);
        return;
      }
      await command.execute(interaction);
    } catch (e) {
      console.error(e);
      await interaction.followUp(
        `Command \`${interaction.commandName}\` failed with error: \`${e}\``
      );
    }
    console.timeEnd(interaction.commandName);
  });
  discordClient.on("error", (e) => {
    console.error("Discord client error!", e);
  });

  discordClient.login(process.env.token);
}

main();
