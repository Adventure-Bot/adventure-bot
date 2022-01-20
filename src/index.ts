console.time('ready')
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

import { REST } from "@discordjs/rest";
import Discord, { Intents } from "discord.js";
import { exit } from "process";
import { Routes } from "discord-api-types/v9";
import commands from "./commands";
import { readFile, writeFile } from "fs/promises";
import crypto from "crypto";
import store from "./store";
import { channelInteraction, tick } from "./store/actions";
import { selectCrownBearer, selectSovereign } from "./store/selectors";

if (!process.env.token) exit(1)

const rest = new REST({ version: '9' }).setToken(process.env.token)

const updateCommands = async () => {
  if (!process.env.token || !process.env.CLIENT_ID || !process.env.GUILD_ID)
    return

  try {
    const body = Array.from(commands.values()).map(({ command }) =>
      command.toJSON()
    )
    const commandHash = crypto
      .createHash('md5')
      .update(JSON.stringify(body))
      .digest('hex')
    const priorHash = (
      await readFile('.command-hash').catch(() => '')
    ).toString()
    if (commandHash === priorHash) {
      console.log('✅ Commands are up-to-date')
      return
    }

    console.time('updating commands')
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body,
      }
    )

    writeFile('.command-hash', commandHash)

    console.timeEnd('updating commands')
  } catch (error) {
    console.log(error)
  }
}

async function main() {
  updateCommands()

  console.time('discord client ready')
  const discordClient = new Discord.Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    ],
  })

  discordClient.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    console.log(`interactionCreate ${interaction.commandName}`);
    const channelId = interaction.channel?.id;
    if (channelId) {
      store.dispatch(channelInteraction(channelId));
    }
    console.time(interaction.commandName);
    try {
      await interaction.deferReply()
      const command = commands.get(interaction.commandName)
      if (!command) {
        interaction.editReply(`Command not found ${command}`)
        return
      }
      await command.execute(interaction)
    } catch (e) {
      console.error(e)
      await interaction.followUp(
        `Command \`${interaction.commandName}\` failed with error: \`${e}\``
      )
    }
    console.timeEnd(interaction.commandName)
  })
  discordClient.on('error', (e) => {
    console.error('Discord client error!', e)
  })

  discordClient.on("ready", async () => {
    console.log("🎉 Adventures begin!");
    console.timeEnd("discord client ready");
    startClock(discordClient);
  });

  discordClient.login(process.env.token)
}

function startClock(discordClient: Discord.Client) {
  console.log("startClock");
  const serverTick = () => {
    console.log("tick");

    const sovereign = selectSovereign(store.getState());
    console.log(`sovereign ${sovereign}`);
    const crownBearer = selectCrownBearer(store.getState());
    console.log(`crownBearer ${crownBearer?.name}`);

    store.dispatch(tick());
  };
  serverTick();
  setInterval(serverTick, 6000);
}

main()
