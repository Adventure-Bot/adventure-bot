import { PrismaClient } from '@prisma/client'
import { CharacterKind } from '@prisma/client'

export type { Character, Item } from '@prisma/client'

export { CharacterKind }

export const db = new PrismaClient()
