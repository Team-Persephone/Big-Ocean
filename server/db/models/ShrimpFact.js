const Sequelize = require("sequelize");
const db = require('../db')

const ShrimpFact = db.define('shrimpFact', {
  fact: {
    type: Sequelize.TEXT
  },
  value: {
    type: Sequelize.INTEGER
  },
  answer: {
    type: Sequelize.STRING
  }
})

module.exports = ShrimpFact
