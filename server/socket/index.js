const { PearlQuest, ShrimpFact, Level } = require("../db/models");

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
    questionsLevel1: [{question: '', options: [], answer: '', x: 0, y: 0}],
    questionsLevel2: [{question: '', options: [], answer: '', x: 0, y: 0}],
    questionsLevel3: [{question: '', options: [], answer: '', x: 0, y: 0}],
    questionsLevel4: [{question: '', options: [], answer: '', x: 0, y: 0}],
    questionsLevel5: [{question: '', options: [], answer: '', x: 0, y: 0}],
    facts: []
    //
  }*/

module.exports = io => {
	io.on("connection", async socket => {
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

				questionsLevel1: [],
				questionsLevel2: [],
				questionsLevel3: [],
				questionsLevel4: [],
				questionsLevel5: [],
				factsLevel1: [],
				factsLevel2: [],
				factsLevel3: [],
				factsLevel4: [],
				factsLevel5: []
			};

			const questions = await PearlQuest.findAll();
			const facts = await ShrimpFact.findAll();

			questions.forEach(question => {
				let x = Math.ceil(Math.random() * 1000);
				let y = Math.ceil(Math.random() * 600);
				let questionObj = {
					question: question.question,
					options: question.options,
					answer: question.answer,
					isResolved: false,
					x,
					y
				};
				if (question.levelId === 1) {
					questionObj.y = questionObj.y + 400;
					activeGames[key].questionsLevel1.push(questionObj);
				}
				if (question.levelId === 2) {
					activeGames[key].questionsLevel2.push(questionObj);
				}
				if (question.levelId === 3) {
					activeGames[key].questionsLevel3.push(questionObj);
				}
				if (question.levelId === 4) {
					activeGames[key].questionsLevel4.push(questionObj);
				}
				if (question.levelId === 5) {
					activeGames[key].questionsLevel5.push(questionObj);
				}
			});

			facts.forEach(fact => {
				let x = Math.ceil(Math.random() * 1000);
				let y = Math.ceil(Math.random() * 600);
				let factObj = {
					fact: fact.fact,
					isRead: false, //can multpile people read same fact???
					x,
					y
				};
				
				if (fact.levelId === 1) {
					factObj.y = factObj.y + 400;
					activeGames[key].factsLevel1.push(factObj);
				}
				if (fact.levelId === 2) {
					activeGames[key].factsLevel2.push(factObj);
				}
				if (fact.levelId === 3) {
					activeGames[key].factsLevel3.push(factObj);
				}
				if (fact.levelId === 4) {
					activeGames[key].factsLevel4.push(factObj);
				}
				if (fact.levelId === 5) {
					activeGames[key].factsLevel5.push(factObj);
				}
			});

			socket.emit("gameCreated", key);
		});

		//socket listen on plaery joinGame

		socket.on("joinWaitingRoom", async function (gameKey) {
			socket.join(gameKey); //WHAT IS THIS DOING??
			const gameInfo = activeGames[gameKey];
			const newAvatar = activeGames[gameKey].avatars.pop();
			activeGames[gameKey].players[socket.id] = {
				position: {
					x: 100,
					y: 100,
					angle: 0
					//   faceRight: false,
				},
				avatar: newAvatar,
				playerId: socket.id
			};

			socket.on("inWaitingRoom", async function () {});

			gameInfo.numPlayer = Object.keys(gameInfo.players).length;
			gameInfo.score[socket.id] = 0;
			//send state info

			socket.emit("setState", gameInfo);

			socket.on("startCountdown", (seconds) => {
				socket.to(gameKey).emit("startedCountdown", seconds)
				socket.emit("startedCountdown", seconds)
			})

			//send current players info
			socket.emit("currentPlayers", {
				players: gameInfo.players,
				numPlayers: gameInfo.numPlayers
			});
			//send new player info
			socket.to(gameKey).emit("newPlayer", {
				newPlayer: gameInfo.players[socket.id],
				numPlayers: gameInfo.numPlayers
			});

			socket.on("submitMemo", async function (key, username, message) {
				socket.to(key).emit("broadcastMessage", {
					username: username,
					message: message
				});
				socket.emit("broadcastMessage", {
					username: username,
					message: message
				});
			});

			//Player Movement
			socket.on("playerMovement", async function (data) {
				const { x, y, angle, faceRight, key } = data;
				activeGames[key].players[socket.id].position.x = x;
				activeGames[key].players[socket.id].position.y = y;
				activeGames[key].players[socket.id].position.angle = angle;
				activeGames[key].players[socket.id].position.faceRight = faceRight;
				socket.to(key).emit("friendMoved", activeGames[key].players[socket.id]);
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
};
