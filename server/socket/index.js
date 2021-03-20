const { PearlQuest, ShrimpFact, Level, GameRoom } = require('../db/models');

const activeGames = {
  // [urlCode]: {
  //   player: { 'name': {position: [x, y], avatar: 'scubaOne' }, 'name': {position: [x, y], avatar: 'scubaTwo' }, 'name': {position: [x, y], avatar: 'scubaThree' }},
  //   score: { 'name': 0, 'name': 0, 'name': 0},
  //   avatars: ['scubaOne', 'scubaTwo','scubaThree'],
  //   level: 1,
  //   questions: [],
  //    facts: [],
  //   taskPositions: {
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
    socket.on('createNewGame', async function () {
      let key = codeGenerator();
      while (Object.keys(activeGames).includes(key)) {
        key = codeGenerator();
      }
      activeGames[key] = {
        player: { player1: { position: [100, 100], avatar: 'scubaOne' } },
        score: { player1: 0 },
        level: 1,
        question: {},
      };
      socket.emit('gameCreated', key);
    });
  });
};

function codeGenerator() {
  let code = '';
  let chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
