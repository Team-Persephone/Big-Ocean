const { PearlQuest, ShrimpFact, Level, GameRoom } = require('../db/models');

const activeGames = {};

//INSIDE ACTIVEGAMES:
/* key: {
    players: {
    socket.id: {
      position,
      playerId
      }
    },
    numPlayers: 0
    score: { socket.id: playerScore = 0},
    level: 1,
    questions: [],
    facts: []
    // 
  }*/ 


module.exports = (io) => {
  io.on('connection', async (socket) => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
      );
      
      //socket listen on createGame
      socket.on('createGame', async function () {
        let key = codeGenerator();
        while (Object.keys(activeGames).includes(key)) {
          key = codeGenerator();
        }
        activeGames[key] = {
          key,
          players: {},
          numPlayers: 0,
          avatars: ['scubaGreen', 'scubaPink', 'scubaPurple'],
          score: {},
          level: 1,
          questions: [],
          facts: [],
          // taskPositions: {},
        };

      socket.emit('gameCreated', key);
    });

    //socket listen on plaery joinGame
    socket.on('joinGame', async function (gameKey) {
      socket.join(gameKey); //WHAT IS THIS DOING??
      console.log('this is socket.id', socket.id)
      const gameInfo = activeGames[gameKey];
      const newAvatar = activeGames[gameKey].avatars.pop();
      activeGames[gameKey].players[socket.id] = {
        position: {
          x: 100,
          y: 100,
          angle: 0,
       //   faceRight: false,
        },
        avatar: newAvatar,
        playerId: socket.id
      };

      gameInfo.numPlayer = Object.keys(gameInfo.players).length
      gameInfo.score[socket.id] = 0;
      //send state info
      socket.emit('setState', gameInfo)
      //send current players info
      socket.emit('currentPlayers', {
        players: gameInfo.players,
        numPlayers: gameInfo.numPlayers
      });
      //send new player info
      socket.to(gameKey).emit('newPlayer', {
        newPlayer: gameInfo.players[socket.id],
        numPlayers: gameInfo.numPlayers,
      })
    });
    
    //Player Movement
    socket.on('playerMovement', async function (data) { 
      const { x, y, angle, faceRight, key } = data
      activeGames[key].players[socket.id].position.x = x;
      activeGames[key].players[socket.id].position.y = y;
      activeGames[key].players[socket.id].position.angle = angle;
    //  activeGames[key].players[socket.id].position.faceRight = faceRight;
      socket.to(key).emit('friendMoved', activeGames[key].players[socket.id]);
    })
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
