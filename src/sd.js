const fs = require('fs')
const path = require('path')

const cfg = require('../cfg')

function getMediaFiles() {
  // Initialise list of media file paths
  const files = []
  // List items in the SD card top level
  const topLevelDirs = fs.readdirSync(cfg.sdLocation)
  // If no DCIM directory, stop here
  if (topLevelDirs.indexOf('DCIM') === -1) { return files }
  // Iterate inside the DCIM directory
  const dcimDirs = fs.readdirSync(path.join(cfg.sdLocation, 'DCIM'))
  dcimDirs.forEach(dir => {
    // Only look at xxxCANON directories
    if (!/\d+CANON/.test(dir)) { return }
    // Iterate inside the media directory
    fs.readdirSync(path.join(cfg.sdLocation, 'DCIM', dir)).forEach(filePath => {
      // Add to the list if it's of the right format
      if (/IMG_\d+\.JPG/.test(filePath) || /MVI_\d+\.MOV/.test(filePath)) {
        files.push(path.join(cfg.sdLocation, 'DCIM', dir, filePath))
      }
    })
  })
  return files
}

function isSDPresent() {
  try {
    fs.readdirSync(cfg.sdLocation)
    return true
  } catch(e) {
    return false
  }
}

module.exports = { getMediaFiles, isSDPresent }
