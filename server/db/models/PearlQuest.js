const Sequelize = require("sequelize");
const db = require('../db')

const PearlQuest = db.define('pearlQuest', {
  question: {
    type: Sequelize.TEXT
  },
  options: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  answer: {
    type: Sequelize.STRING
  }
})

module.exports = PearlQuest
