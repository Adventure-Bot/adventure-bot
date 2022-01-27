import { randomUUID } from 'crypto'

import { Character } from '@adventure-bot/game/character'
import { Encounter } from '@adventure-bot/game/encounters'
import { Monster } from '@adventure-bot/game/monster'
import store from '@adventure-bot/game/store'
import { encounterCreated } from '@adventure-bot/game/store/slices/encounters'

export function createEncounter({
  monster,
  player,
}: {
  monster: Monster
  player: Character
}): Encounter {
  const encounter: Encounter = {
    characterId: player.id,
    monsterId: monster.id,
    date: new Date().toString(),
    id: randomUUID(),
    playerAttacks: [],
    monsterAttacks: [],
    rounds: 1,
    outcome: 'in progress',
  }
  store.dispatch(encounterCreated(encounter))
  return encounter
}
