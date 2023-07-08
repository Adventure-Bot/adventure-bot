import { angels } from '@adventure-bot/game/encounters/angels'
import { cairns } from '@adventure-bot/game/encounters/cairns'
import { cave } from '@adventure-bot/game/encounters/cave'
import { chest } from '@adventure-bot/game/encounters/chest'
import { coralReef } from '@adventure-bot/game/encounters/coralReef'
import { divineBlessing } from '@adventure-bot/game/encounters/divineBlessing'
import { fairyWell } from '@adventure-bot/game/encounters/fairyWell'
import { monster } from '@adventure-bot/game/encounters/monster'
import { ranger } from '@adventure-bot/game/encounters/ranger'
import { shop } from '@adventure-bot/game/encounters/shop/shop'
import {
  armorShrine,
  attackShrine,
  roguesGuild,
  slayerShrine,
  vigorShrine,
} from '@adventure-bot/game/encounters/shrine'
import { tavern } from '@adventure-bot/game/encounters/tavern/tavern'
import { thugs } from '@adventure-bot/game/encounters/thugs'
import { townSquare } from '@adventure-bot/game/encounters/townsquare'
import { trap } from '@adventure-bot/game/encounters/trap'
import { travel } from '@adventure-bot/game/encounters/travel'
import { warlock } from '@adventure-bot/game/encounters/warlock'
import { CommandHandler } from '@adventure-bot/game/utils'

export const encountersByName: [string, CommandHandler][] = [
  ['Angels', angels],
  ['Warlock', warlock],
  ['Cairns', cairns],
  ['Cave', cave],
  ['Chest', chest],
  ['Coral Reef', coralReef],
  ['Divine Blessing', divineBlessing],
  ['Fairy Well', fairyWell],
  ['Monster', monster],
  ['Ranger', ranger],
  ['Shop', shop],
  ['Armor Shrine', armorShrine],
  ['Attack Shrine', attackShrine],
  ['Slayer Shrine', slayerShrine],
  ['Vigor Shrine', vigorShrine],
  ["Rogue's Guild", roguesGuild],
  ['Tavern', tavern],
  ['Town Square', townSquare],
  ['Thugs', thugs],
  ['Trap', trap],
  ['Travel', travel],
]
