require('dotenv').config()
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

  const doGen = (imageAssetDir: string) => {

    const themes = fs.readdirSync(imageAssetDir).filter(isDirectory(imageAssetDir))
  
    const tsManifest: Record<string, Record<string, string>> = {}

    const manifest = themes.reduce((themeAcc, theme) => {
      const themeFolder = path.join(imageAssetDir, theme)
      const kinds = fs.readdirSync(themeFolder).filter(isDirectory(themeFolder))
      
      tsManifest[theme] = tsManifest[theme] || {}

      return {
        ...themeAcc,
        [theme]: kinds.reduce((kindsAcc, kind) => {

          const kindFolder = path.join(themeFolder, kind)
          const entities = fs.readdirSync(kindFolder).filter(isDirectory(kindFolder))
          
          tsManifest[theme][kind] = entities.join(' | ')

          return {
            ...kindsAcc,
            [kind]: entities.reduce((kindAcc, entity) => ({
              ...kindAcc,
              [entity]: fs.readdirSync(path.join(kindFolder, entity))
            }), {} as Record<string, string[]>),
          }
        }, {} as Record<string, Record<string, string[]>>)
      }
    }, {} as Record<string, Record<string, Record<string, string[]>>>)

    return {
      js: manifest,
      ts: tsManifest,
    }
  }

  const {
    js,
    ts,
  } = doGen(imageAssetDir)

  const manifestTS = `export const manifest = ${stringify({
    location: imageAssetDir,
    relativePath: imageAssetDir.replace(process.cwd(), ''),
    data: js,
  }, null, 2)} as const

export type Manifest = ${stringify(ts, null, 2)?.replace(/ \| /g, `\' | \'`)}
  `

  const writeTo = path.join(outFileDir, 'asset-manifest.ts')
  fs.writeFileSync(writeTo, manifestTS)
  console.info(`Wrote asset manifest to ${writeTo}`)
}

generateAssetManifest({
  imageAssetDir: path.join(process.cwd(), String(process.env.AWS_S3_ASSETS_DIR)),
  outFileDir: path.join(__dirname, '..', 'src'),
})