const mkdirp = require('mkdirp')
const mv = require('mv')
const path = require('path')

const cfg = require('./cfg')
const image = require('./src/image')
const log = require('./src/log')
const sd = require('./src/sd')

function moveFile(src, dest) {
  return new Promise((res, rej) => {
    mv(src, dest, (err) => {
      if (err) { return rej(err) }
      return res()
    })
  })
}

async function performOffload() {
  await log.log('Checking SD card is present...')
  const sdPresent = sd.isSDPresent()
  if (!sdPresent) {
    await log.log('SD card not present, quitting')
    process.exit(1)
  }
  await log.log('SD card found!')
  await log.log('Looking for image files...')
  const mediaFiles = await sd.getMediaFiles()
  await log.log(`Found ${mediaFiles.length} image files`)
  for (const imageFile of mediaFiles) {
    const exifData = await image.getExif(imageFile)
    const dateMatch = exifData.createDate.match(
      /(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/
    )
    const components = dateMatch.slice(1, 7)
    const [year, month, date, hour, min, second] = components
    components[1]--
    const createdDate = new Date(...components)
    const destinationDir = path.join(
      cfg.photoDestination,
      `${year}-${month}-${date}`
    )
    if (cfg.dryRun) {
      await log.log(` Would mkdirp directory ${destinationDir}`, true)
    } else {
      mkdirp.sync(destinationDir)
      await log.log(` Created directory ${destinationDir}`, true)
    }
    const destinationPath = path.join(destinationDir, imageFile.split('/').slice(-1)[0])
    if (cfg.dryRun) {
      await log.log(`  Would move ${imageFile} -> ${destinationPath}`, true)
    } else {
      await moveFile(imageFile, destinationPath)
      await log.log(`  Moved ${imageFile} -> ${destinationPath}`, true)
    }
  }
  await log.log(`Successfully moved ${mediaFiles.length} files into Dropbox`)
}

performOffload().catch(console.error)
