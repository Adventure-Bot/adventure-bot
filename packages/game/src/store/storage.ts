import workspace from 'find-yarn-workspace-root'
import fsSync from 'fs'
import { constants } from 'fs'
import fs from 'fs/promises'
import mkdirp from 'mkdirp'
import path from 'path'

const dbFolder = path.join(workspace() ?? process.cwd(), 'db')
const dbFile = path.join(dbFolder, `db.json`)

const ensureDB = async () => {
  mkdirp(dbFolder)
  const exists = await fs
    .access(dbFile, constants.F_OK)
    .then(() => true)
    .catch(() => false)
  if (!exists) return fsSync.writeFileSync(dbFile, '{}')
}

export const disk = {
  getItem: async (): Promise<string> => {
    await ensureDB()
    try {
      return fs.readFile(dbFile).then((d) => d.toString('utf-8'))
    } catch (e) {
      return Promise.resolve('{}')
    }
  },
  setItem: async (_: string, item: string): Promise<void> => {
    await ensureDB()
    return fs.writeFile(dbFile, JSON.stringify(JSON.parse(item), null, 2))
  },
  removeItem: async (): Promise<void> => {
    await ensureDB()
    return fs.writeFile(dbFile, '{}')
  },
}
