import { Encounter } from '@adventure-bot/game/encounters/Encounter'
import { angels } from '@adventure-bot/game/encounters/angels'
import { cairns } from '@adventure-bot/game/encounters/cairns'
import { cave } from '@adventure-bot/game/encounters/cave'
import { chest } from '@adventure-bot/game/encounters/chest'
import { createEncounter } from '@adventure-bot/game/encounters/createEncounter'
import { divineBlessing } from '@adventure-bot/game/encounters/divineBlessing'
import { encounterEmbed } from '@adventure-bot/game/encounters/encounterEmbed'
import { encounterSummaryEmbed } from '@adventure-bot/game/encounters/encounterSummaryEmbed'
import { fairyWell } from '@adventure-bot/game/encounters/fairyWell'
import { getEncounters } from '@adventure-bot/game/encounters/getEncounters'
import { getLoots } from '@adventure-bot/game/encounters/getLoots'
import { monster } from '@adventure-bot/game/encounters/monster'
import { randomEncounter } from '@adventure-bot/game/encounters/randomEncounter'
import { shop } from '@adventure-bot/game/encounters/shop/shop'
import {
  armorShrine,
  attackShrine,
  slayerShrine,
  vigorShrine,
} from '@adventure-bot/game/encounters/shrine'
import { tavern } from '@adventure-bot/game/encounters/tavern/tavern'
import { trap } from '@adventure-bot/game/encounters/trap'
import { travel } from '@adventure-bot/game/encounters/travel'
import { CommandHandler } from '@adventure-bot/game/utils'

export {
  angels,
  chest,
  divineBlessing,
  fairyWell,
  monster,
  shop,
  tavern,
  trap,
  travel,
  encounterSummaryEmbed,
  getEncounters,
  getLoots,
  Encounter,
  createEncounter,
  randomEncounter,
  encounterEmbed,
  cairns,
  cave,
}

export const encountersByName: [string, CommandHandler][] = [
  ['Angels', angels],
  ['Cairns', cairns],
  ['Cave', cave],
  ['Chest', chest],
  ['Divine Blessing', divineBlessing],
  ['Fairy Well', fairyWell],
  ['Monster', monster],
  ['Shop', shop],
  ['Armor Shrine', armorShrine],
  ['Attack Shrine', attackShrine],
  ['Slayer Shrine', slayerShrine],
  ['Vigor Shrine', vigorShrine],
  ['Tavern', tavern],
  ['Trap', trap],
  ['Travel', travel],
]
