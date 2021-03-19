const { PearlQuest, ShrimpFact, Level, GameRoom } = require('../db/models');

const activeGames = {
  // [urlCode]: {
  //   player: { 'name': [x, y], 'name': [x, y], 'name': [x, y]},
  //   score: { 'name': 0, 'name': 0, 'name': 0},
  //   avatars: {'name': 'scubaOne', 'name':'scubaTwo', 'name':'scubaThree'},
  //   level: 1,
  //   question: {
  //     q1: {position: [x, y], isResolved: false},
  //     q2: {position: [x, y], isResolved: false},
  //     q3: {position: [x, y], isResolved: false},
  //     q4: {position: [x, y], isResolved: false},
  //     q5: {position: [x, y], isResolved: false},
  //     f1: {position: [x, y], isResolved: false},
  //     f2: {position: [x, y], isResolved: false},
  //     f3: {position: [x, y], isResolved: false},
  //     f4: {position: [x, y], isResolved: false},
  //     f5: {position: [x, y], isResolved: false},
  //   },
  // },
};

module.exports = (io) => {
  io.on('connection', async (socket) => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );
  });
};
