import fs from 'fs'
import path from 'path'
import { stringify } from "javascript-stringify"

const isDirectory = (base: string) => (name: string) => fs.statSync(path.join(base, name)).isDirectory()

const aiImagesFolder = path.join(__dirname, '..', 'images', 'ai-gen')
const kinds = fs.readdirSync(aiImagesFolder).filter(isDirectory(aiImagesFolder))

const manifest = kinds.reduce((acc, val) => {
  const kindFolder = path.join(aiImagesFolder, val)
  const entities = fs.readdirSync(kindFolder).filter(isDirectory(kindFolder))
  return {
    ...acc,
    [val]: entities.reduce((acc2, val2) => ({
      ...acc2,
      [val2]: fs.readdirSync(path.join(kindFolder, val2))
    }), {} as Record<string, string[]>),
  }
}, {} as Record<string, Record<string, string[]>>)

const manifestTS = `export const manifest = ${stringify(manifest, null, 2)} as const\n`

fs.writeFileSync(path.join(__dirname, '..', 'src', 'asset-manifest.ts'), manifestTS)