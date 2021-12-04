import angels from "./angels";
import adventure from "./adventure";
import attack from "./attack";
import cooldowns from "./cooldowns";
import crown from "./admin/crown";
import dance from "./dance";
import lootme from "./admin/lootme";
import db from "./db";
import heal from "./heal";
import hp from "./hp";
import hpbartest from "../character/hpBar/hpbartest";
import inspect from "./inspect/inspect";
import inventory from "./inventory";
import list from "./list/list";
import monster from "./monster";
import quest from "./admin/quest";
import quests from "./quests";
import renew from "./renew";
import set from "./set";
import shop from "./shop";
import admin from "./admin/admin";
import chest from "./chest";
import lootmonster from "./admin/lootmonster";
import barFight from "./barFight";
import lootchest from "./admin/lootchest";
import { CommandHandler } from "../utils";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types";
import cleanse from "./admin/cleanse";

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
commands.set("db", db);
commands.set("heal", heal);
commands.set("hp", hp);
commands.set("inspect", inspect);
commands.set("inventory", inventory);
commands.set("list", list);
commands.set("quests", quests);
commands.set("renew", renew);
commands.set("set", set);

if (process.env.DEV_COMMANDS === "true") {
  console.warn("⚠ DEV COMMANDS LOADED ⚠");
  commands.set("admin", admin);
  commands.set("angels", angels);
  commands.set("bar_fight", barFight);
  commands.set("chest", chest);
  commands.set("cleanse", cleanse);
  commands.set("crown", crown);
  commands.set("hpbartest", hpbartest);
  commands.set("lootchest", lootchest);
  commands.set("lootme", lootme);
  commands.set("lootmonster", lootmonster);
  commands.set("monster", monster);
  commands.set("quest", quest);
  commands.set("shop", shop);
}

export default commands;
