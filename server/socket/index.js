
const { PearlQuest, ShrimpFact, Level } = require('../db/models');

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
    questionsLevel1: [{question: '', options: [], answer: '', positionX: 0, positionY: 0}],
    questionsLevel2: [{question: '', options: [], answer: '', positionX: 0, positionY: 0}],
    questionsLevel3: [{question: '', options: [], answer: '', positionX: 0, positionY: 0}],
    questionsLevel4: [{question: '', options: [], answer: '', positionX: 0, positionY: 0}],
    questionsLevel5: [{question: '', options: [], answer: '', positionX: 0, positionY: 0}],
    facts: []
    //
  }*/

module.exports = (io) => {
  io.on("connection", async (socket) => {
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

      const questions = await PearlQuest.findAll();

      // console.log(questions);

      let questionsObj = questions.forEach((question) => {
        let x = Math.ceil(Math.random() * 700);
        let y = Math.ceil(Math.random() * 500);
        return {
          question: question.question,
          options: question.options,
          answer: question.answer,
          postionX: x,
          positionY: y,
        };
      });

      console.log(questionsObj);
      socket.emit("gameCreated", key);
    });

    //socket listen on plaery joinGame

    socket.on('joinWaitingRoom', async function (gameKey) {
      socket.join(gameKey); //WHAT IS THIS DOING??
      console.log('this is socket.id', socket.id);

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
        playerId: socket.id,
      };

      gameInfo.numPlayer = Object.keys(gameInfo.players).length;
      gameInfo.score[socket.id] = 0;
      //send state info

      socket.emit("setState", gameInfo);

      //send current players info
      socket.emit("currentPlayers", {
        players: gameInfo.players,
        numPlayers: gameInfo.numPlayers,
      });
      //send new player info
      socket.to(gameKey).emit("newPlayer", {
        newPlayer: gameInfo.players[socket.id],
        numPlayers: gameInfo.numPlayers,
      });

    socket.on("submitMemo", async function (key, username, message){
      console.log("key", key);
      console.log("userColor", username);
      console.log("message", message);
      socket.to(key).emit("broadcastMessage", {
        username: username,
        message: message
      });
      socket.emit("broadcastMessage", {
        username: username,
        message: message
      })
    });

    //Player Movement
    socket.on('playerMovement', async function (data) {
      const { x, y, angle, faceRight, key } = data;
      activeGames[key].players[socket.id].position.x = x;
      activeGames[key].players[socket.id].position.y = y;
      activeGames[key].players[socket.id].position.angle = angle;
      activeGames[key].players[socket.id].position.faceRight = faceRight;
      socket.to(key).emit('friendMoved', activeGames[key].players[socket.id]);

    });
  });
});


function codeGenerator() {
  let code = "";
  let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
}
