const Sequelize = require("sequelize");
const db = require('../db')

const GameRoom = db.define('gameRoom', {
  code: {
    type: Sequelize.STRING
  },
  socketId: {
    type: Sequelize.STRING
  },
  isActive: {
    type: Sequelize.BOOLEAN
  }
})

module.exports = GameRoom
