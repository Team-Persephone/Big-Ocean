const Sequelize = require('sequelize');
const db = require('../db');

const ShrimpFact = db.define('shrimpFact', {
  fact: {
    type: Sequelize.TEXT,
  },
});

module.exports = ShrimpFact;
