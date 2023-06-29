import crypto from 'crypto'
import { AttachmentBuilder } from 'discord.js'
import path from 'path'

import { Manifest, manifest } from '@adventure-bot/game/asset-manifest'

function asset<
  Theme extends keyof Manifest,
  Kind extends keyof Manifest[Theme],
  Entity extends Manifest[Theme][Kind]
>(
  theme: Theme,
  kind: Kind,
  entity: Entity,
  seed?: string
): {
  path: string
  attachment: AttachmentBuilder
  attachmentString: string
  s3Url: string
  values: [Theme, Kind, Entity]
} {
  // @ts-ignore: TS sucks and is losing context cause the object is deeply nested
  const images = manifest.data[theme][kind][entity]

  let index: number
  if (seed) {
    const hash = crypto.createHash('md5').update(seed).digest('hex')
    index = parseInt(hash, 16) % images.length
  } else {
    index = Math.floor(Math.random() * images.length)
  }

  const image = images[index]

  const assetPath = path.join(theme, String(kind), String(entity), image)
  const absolutePath = path.join(manifest.location, assetPath)

  const file = [theme, String(kind), String(entity), image]
    .join('--')
    .replace(/ /g, '-')

  const s3Url = encodeURI(
    `${process.env.AWS_S3_HOST}/${theme}/${kind}/${entity}/${image}`
  )

  return {
    path: absolutePath,
    attachment: new AttachmentBuilder(absolutePath, { name: file }),
    attachmentString: `attachment://${file}`,
    s3Url,
    values: [theme, kind, entity],
  }
}

export { asset }
