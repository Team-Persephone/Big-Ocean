const PearlQuest = require("./PearlQuest")
const ShrimpFact = require("./ShrimpFact")
const Level = require("./Level")
const GameRoom = require("./GameRoom")

Level.hasMany(ShrimpFact)
ShrimpFact.belongsTo(Level)

Level.hasMany(PearlQuest)
PearlQuest.belongsTo(Level)




module.exports = {
  Level,
  ShrimpFact,
  PearlQuest,
  GameRoom
}
