export const stats = [
  'ac',
  'attackBonus',
  'damageBonus',
  'damageMax',
  'maxHP',
  'monsterDamageMax',
  'dragonSlaying',
] as const

export type Stat = typeof stats[number]

export type Stats = {
  [key in Stat]: number
}

export const statTitles: { [key in Stat]: string } = {
  ac: 'Armor',
  attackBonus: 'Attack Bonus',
  damageBonus: 'Damage Bonus',
  damageMax: 'Damage',
  maxHP: 'Max Health',
  monsterDamageMax: 'Monster Slaying',
  dragonSlaying: 'Dragon Slaying',
}
