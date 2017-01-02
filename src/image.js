const exiftool = require('exiftool')
const fs = require('fs')

function getExif(filePath) {
  return new Promise((res, rej) => {
    fs.readFile(filePath, (err, data) => {
      if (err) { return rej(err) }
      exiftool.metadata(data, (err, metadata) => {
        if (err) { return rej(err) }
        return res(metadata)
      })
    })
  })
}

module.exports = { getExif }
