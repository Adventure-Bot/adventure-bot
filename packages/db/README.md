# Adventure-Bot DB

Usage

```ts
import { db } from '@adventure-bot/db'

const character = await db.character.create({
  // ...
})
```

Types are also exported as well

```ts
import type { Character, CharacterKind, Item } from '@adventure-bot/db'
```

# Scripts
```sh
yarn db push # Sync DB with Prisma Schema (might require a migration)

yarn db generate-client # Generate a new Prisma Client based off of Schema. Ran automatically on Build

yarn db build # Compile db package to be a shareable lib

yarn db studio # Start Prisma Studio

yarn db seed # Create a new character with an inventory into the DB
```