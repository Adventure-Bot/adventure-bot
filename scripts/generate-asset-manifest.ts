import fs from 'fs'
import path from 'path'
import { stringify } from "javascript-stringify"

const isDirectory = (base: string) => (name: string) => fs.statSync(path.join(base, name)).isDirectory()

const generateAssetManifest: (options: {
  imageAssetDir: string
  outFileDir: string
}) => void = ({
  imageAssetDir,
  outFileDir,
}) => {
  const kinds = fs.readdirSync(imageAssetDir).filter(isDirectory(imageAssetDir))

  const manifest = kinds.reduce((acc, val) => {
    const kindFolder = path.join(imageAssetDir, val)
    const entities = fs.readdirSync(kindFolder).filter(isDirectory(kindFolder))
    return {
      ...acc,
      [val]: entities.reduce((acc2, val2) => ({
        ...acc2,
        [val2]: fs.readdirSync(path.join(kindFolder, val2))
      }), {} as Record<string, string[]>),
    }
  }, {} as Record<string, Record<string, string[]>>)

  const manifestTS = `export const manifest = ${stringify({
    location: imageAssetDir,
    data: manifest,
  }, null, 2)} as const\n`

  const writeTo = path.join(outFileDir, 'asset-manifest.ts')
  fs.writeFileSync(writeTo, manifestTS)
  console.info(`Wrote asset manifest to ${writeTo}`)
}


generateAssetManifest({
  imageAssetDir: path.join(__dirname, '..', 'images', 'ai-gen'),
  outFileDir: path.join(__dirname, '..', 'src'),
})