const { PearlQuest, ShrimpFact, Level, GameRoom } = require('../db/models');

const activeGames = {
  // key
  // [urlCode]: {
  //   players: { 'name': {position: [x, y], avatar: 'scubaGreen' }, 'name': {position: [x, y], avatar: 'scubaPink' }, 'name': {position: [x, y], avatar: 'scubaPurple' }},
  //   score: { 'name': 0, 'name': 0, 'name': 0},
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

const avatars = ['scubaPink', 'scubaPurple'];

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
        key,
        players: {
          //socket id of the person creating the game
          [socket.id]: {
            position: [100, 100],
            avatar: 'scubaGreen',
          },
        },
        score: { [socket.id]: 0 },
        level: 1,
        questions: [],
        facts: [],
        taskPositions: {},
      };

      const gameInfo = activeGames[key];
      socket.emit('gameCreated', gameInfo);
    });

    socket.on('joinGame', async function (gameKey) {
      activeGames[gameKey].players[socket.id] = {
        position: [100, 100],
        avatar: avatars.pop(),
      };
      activeGames[gameKey].score[socket.id] = 0;

      const playerIds = Object.keys(activeGames[gameKey].players);
      console.log(playerIds);

      const newPlayer = activeGames[gameKey].players[socket.id];
      // const gameInfo = activeGames[gameKey];

      //adding the correct information for active games object
      //socket id of the person joinging the game

      //sends to everyone
      playerIds.forEach((playerId) => {
        io.to(playerId).emit('joinedGame', newPlayer);
      });
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
