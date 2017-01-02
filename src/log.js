const cfg = require('../cfg')

const say = require('say')

async function log(s, nosay=false) {
  await print(s)
  if (!cfg.speakingLogs || nosay) { return }
  return await speak(s)
}

function print(s) {
  console.log(s)
  return Promise.resolve()
}

function speak(s) {
  return new Promise((res, rej) => {
    say.speak(s, 'Daniel', 1, (err) => {
      if (err) { return rej(err) }
      return res()
    })
  })
}

module.exports = { log }
