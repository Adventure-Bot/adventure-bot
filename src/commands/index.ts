import adventure from "./adventure";
import attack from "./attack";
import cooldowns from "./cooldowns";
import dance from "./dance";
import lootme from "./admin/lootme";
import db from "./db";
import heal from "./heal";
import hp from "./hp";
import hpbartest from "./hpbartest";
import inspect from "./inspect/inspect";
import inventory from "./inventory";
import list from "./list/list";
import quests from "./quests";
import renew from "./renew";
import set from "./set";
import admin from "./admin/admin";
import lootmonster from "./admin/lootmonster";
import lootchest from "./admin/lootchest";
import { CommandHandler } from "../utils";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types";
import cleanse from "./admin/cleanse";
import encounter from "./admin/encounter";
import item from "./admin/item";
import d20 from "./d20";

const commands = new Map<
  string,
  {
    command: { toJSON(): RESTPostAPIApplicationCommandsJSONBody };
    execute: CommandHandler;
  }
>();
commands.set("adventure", adventure);
commands.set("attack", attack);
commands.set("cooldowns", cooldowns);
commands.set("dance", dance);
commands.set("heal", heal);
commands.set("d20", d20);
commands.set("hp", hp);
commands.set("inspect", inspect);
commands.set("inventory", inventory);
commands.set("list", list);
commands.set("quests", quests);
commands.set("renew", renew);
commands.set("set", set);

if (process.env.DEV_COMMANDS === "true") {
  commands.set("db", db);
  console.warn("⚠ DEV COMMANDS LOADED ⚠");
  commands.set("admin", admin);
  commands.set("encounter", encounter);
  commands.set("item", item);
  commands.set("cleanse", cleanse);
  commands.set("hpbartest", hpbartest);
  commands.set("lootchest", lootchest);
  commands.set("lootme", lootme);
  commands.set("lootmonster", lootmonster);
}

export default commands;
