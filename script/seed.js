const {db}= require('../server/db');
const {PearlQuest, Level, GameRoom, ShrimpFact} = require('../server/db/models')

async function seed() {
  await db.sync({force: true});
  console.log('db is synced!!')
}

async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

if (module === require.main) {
  runSeed()
}

module.exports = seed
