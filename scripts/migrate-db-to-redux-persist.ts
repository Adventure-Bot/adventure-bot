import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'

const migrate = async () => {
  const reduxDBPath = path.join(__dirname, '..', 'db.json')
  const dbDir = path.join(__dirname, '..', 'db')
  const persistedReduxDBPath = path.join(dbDir, 'db.json')

  await mkdirp(dbDir)

  if (fs.existsSync(reduxDBPath)) {
    const reduxDBData = JSON.parse(
      fs.readFileSync(reduxDBPath).toString('utf-8')
    )

    const persistedReduxDB = {
      ...Object.keys(reduxDBData).reduce(
        (acc, k) => ({
          ...acc,
          [k]: JSON.stringify(reduxDBData[k]),
        }),
        {} as Record<string, string>
      ),
      _persist: `{"version":0,"rehydrated":true}`,
    }

    fs.writeFileSync(
      persistedReduxDBPath,
      JSON.stringify(persistedReduxDB, null, 2)
    )
  }
}

migrate()
