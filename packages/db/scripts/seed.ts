import { CharacterKind, db } from '../.build/src'

const main = async () => {
  const character = await db.character.create({
    data: {
      name: 'John Doe',
      profile: 'https://example.com/profile.png',
      asset: 'https://example.com/asset.png',
      kind: CharacterKind.PLAYER,
      hp: 100,
      xp: 0,
      gold: 0,
      xpValue: 10,
      ac: 0,
      attackBonus: 0,
      damageBonus: 0,
      damageMax: 0,
      maxHP: 0,
      monsterDamageMax: 0,

      inventory: {
        create: [
          {
            name: 'Sword',
            description: 'A Sword',
            goldValue: 20,
            equippable: true,
            lootable: true,
            sellable: true,
            tradeable: true,
            usable: true,
          },
        ],
      },
    },
    include: {
      inventory: true, // Include all inventory in the returned character
    },
  })

  console.log('New Character', character)
}

main()
