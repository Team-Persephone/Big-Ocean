const { PearlQuest, ShrimpFact, Level, GameRoom } = require("../db/models");

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
  io.on("connection", async (socket) => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    //socket listen on createGame
    socket.on("createGame", async function () {
      let key = codeGenerator();
      while (Object.keys(activeGames).includes(key)) {
        key = codeGenerator();
      }
      activeGames[key] = {
        key,
        players: {},
        numPlayers: 0,
        avatars: ["scubaGreen", "scubaPink", "scubaPurple"],
        score: {},
        level: 1,
        questions: [],
        facts: [],
        // taskPositions: {},
      };

      socket.emit("gameCreated", key);
    });

    //socket listen on plaery joinGame
    socket.on("joinGame", async function (gameKey) {
      socket.join(gameKey); //WHAT IS THIS DOING??
      console.log("this is socket.id", socket.id);
      const gameInfo = activeGames[gameKey];
      const newAvatar = activeGames[gameKey].avatars.pop();
      activeGames[gameKey].players[socket.id] = {
        position: {
          x: 100,
          y: 100,
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
      const playerIds = Object.keys(activeGames[gameKey].players);
      console.log(playerIds);

      const newPlayer = activeGames[gameKey].players[socket.id];
      console.log("this is newPlayer--->", newPlayer);
      // const gameInfo = activeGames[gameKey];
      const allPlayers = activeGames[gameKey].players;
      console.log("this is allPlayers-->", allPlayers);
      //adding the correct information for active games object
      //socket id of the person joinging the game
      playerIds.forEach((playerId) => {
        //sends to everyone
        io.to(playerId).emit("joinedGame", { newPlayer, allPlayers });
      });
    });

    // const submitMemo = (io, key, username, message) => {
    //   io.in(key).emit('broadcastMessage', username, message);
    // };

    socket.on("submitMemo", async function (key, username, message){
      console.log("key", key);
      console.log("userColor", username);
      console.log("message", message);
      socket.to(key).emit("broadcastMessage", {
        username: username,
        message: message
      })
    });
  });
};


function codeGenerator() {
  let code = "";
  let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
