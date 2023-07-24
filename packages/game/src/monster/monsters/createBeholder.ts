import {
  Monster,
  createMonster,
  getRandomMonsterName,
} from '@adventure-bot/game/monster'
import { asset } from '@adventure-bot/game/utils'

export function createBeholder(): Monster {
  return createMonster({
    kind: 'Beholder',
    name: getRandomMonsterName('Beholder'),
    hp: 80,
    maxHP: 80,
    ac: 18,
    attackBonus: 5,
    equipment: {
      weapon: {
        name: 'Beholder Eye',
        onHitRandomEffect: ['blind', 'frailty', 'poisoned', 'stunned'],
        accuracyDescriptors: {
          wideMiss: ["<@attacker>'s eye ray shoots wide of <@defender>"],
          nearMiss: ["<@attacker>'s eye ray nearly zap <@defender>"],
          onTheNose: ["<@attacker>'s eye ray hits <@defender>"],
          veryAccurate: ["<@attacker>'s eye ray hits <@defender> true"],
        },
        damageMax: 6,
        description: 'Eye Stalks',
        equippable: true,
        goldValue: 0,
        id: 'beholder-eye',
        type: 'weapon',
        lootable: false,
        sellable: false,
      },
    },
    profile: asset('fantasy', 'monsters', 'beholder').s3Url,
    xpValue: 10,
    gold: Math.floor(Math.random() * 20) + 15,
  })
}
