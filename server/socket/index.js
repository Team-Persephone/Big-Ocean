const { PearlQuest, ShrimpFact, Level } = require("../db/models");

const activeGames = {};

//INSIDE ACTIVEGAMES:
/* key: {
    players: {
    socket.id: {
      position: {x, y, angle},
			avatar
      playerId,
			score
      }
    },
    numPlayers: 0,
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
				factsLevel5: [],
				count: 0
			};

			const questions = await PearlQuest.findAll();
			const facts = await ShrimpFact.findAll();

			questions.forEach(question => {
				let x = Math.ceil(Math.random() * 1000);
				let y = Math.ceil(Math.random() * 880);
				let questionObj = {
					question: question.question,
					options: question.options,
					answer: question.answer,
					isResolved: false,
					isOpen: false,
					x,
					y
				};
				if (question.levelId === 1) {
					questionObj.y = questionObj.y + 320;
					activeGames[key].questionsLevel1.push(questionObj);
				}
				if (question.levelId === 2) {
					questionObj.y = questionObj.y + 1216;
					activeGames[key].questionsLevel2.push(questionObj);
				}
				if (question.levelId === 3) {
					questionObj.y = questionObj.y + 2112;
					activeGames[key].questionsLevel3.push(questionObj);
				}
				if (question.levelId === 4) {
					questionObj.y = questionObj.y + 3008;
					activeGames[key].questionsLevel4.push(questionObj);
				}
				if (question.levelId === 5) {
					//CHANGE 5500! THIS IS JUST A GUESS FOR TESTING!
					questionObj.y = questionObj.y + 3904;
					activeGames[key].questionsLevel5.push(questionObj);
				}
			});

			facts.forEach(fact => {
				let x = Math.ceil(Math.random() * 1000);
				let y = Math.ceil(Math.random() * 560);
				let factObj = {
					fact: fact.fact,
					isRead: false, //can multpile people read same fact???
					x,
					y
				};

				if (fact.levelId === 1) {
					factObj.y = factObj.y + 380;
					activeGames[key].factsLevel1.push(factObj);
				}
				if (fact.levelId === 2) {
					factObj.y = factObj.y + 380 + (2880 - 1920);
					activeGames[key].factsLevel2.push(factObj);
				}
				if (fact.levelId === 3) {
					factObj.y = factObj.y + 380 + (3840 - 1920);
					activeGames[key].factsLevel3.push(factObj);
				}
				if (fact.levelId === 4) {
					factObj.y = factObj.y + 380 + (4800 - 1920);
					activeGames[key].factsLevel4.push(factObj);
				}
				if (fact.levelId === 5) {
					//CHANGE 6000! THIS IS JUST A GUESS FOR TESTING!
					factObj.y = factObj.y + 380 + (5500 - 1920);
					activeGames[key].factsLevel5.push(factObj);
				}
			});
			socket.emit("gameCreated", key);
		});

		//socket listen on player joinGame
		socket.on("joinWaitingRoom", async function (gameKey) {
			const gameInfo = activeGames[gameKey];

			if (!activeGames[gameKey].avatars.length) {
				socket.emit("gameFull");
			} else {
				socket.join(gameKey); //WHAT IS THIS DOING??

				const newAvatar = activeGames[gameKey].avatars.pop();
				activeGames[gameKey].players[socket.id] = {
					position: {
						x: 100,
						y: 100,
						angle: 0
						//   faceRight: false,
					},
					avatar: newAvatar,
					playerId: socket.id,
					score: 0
				};

				gameInfo.numPlayer = Object.keys(gameInfo.players).length;
				//send state info

				socket.emit("setState", gameInfo);

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
			}
		});

		socket.on("startCountdown", ({ seconds, key }) => {
			io.to(key).emit("startedCountdown", seconds);
		});

		socket.on("submitMemo", async function (key, username, message) {
			io.to(key).emit("broadcastMessage", {
				username: username,
				message: message
			});
		});

		//Player Movement
		socket.on("playerMovement", async function (data) {
			const { x, y, angle, faceRight, key, playerId } = data;
			activeGames[key].players[playerId].position.x = x;
			activeGames[key].players[playerId].position.y = y;
			activeGames[key].players[playerId].position.angle = angle;
			activeGames[key].players[playerId].position.faceRight = faceRight;
			socket.to(key).emit("friendMoved", activeGames[key].players[playerId]);
		});

		socket.on("QuestionOpen", async function ({ clamInfo, key, level }) {
			let currentLevel = level;
			switch (level) {
				case 1:
					activeGames[key].questionsLevel1.forEach(question => {
						if (clamInfo.question === question.question) {
							question.isOpen = !question.isOpen;
						}
					});
					break;
				case 2:
					activeGames[key].questionsLevel2.forEach(question => {
						if (clamInfo.question === question.question) {
							question.isOpen = !question.isOpen;
						}
					});
					break;
				case 3:
					activeGames[key].questionsLevel3.forEach(question => {
						if (clamInfo.question === question.question) {
							question.isOpen = !question.isOpen;
						}
					});
					break;
				case 4:
					activeGames[key].questionsLevel4.forEach(question => {
						if (clamInfo.question === question.question) {
							question.isOpen = !question.isOpen;
						}
					});
					break;
				default:
					activeGames[key].questionsLevel5.forEach(question => {
						if (clamInfo.question === question.question) {
							question.isOpen = !question.isOpen;
						}
					});
					break;
			}

			socket.to(key).emit("QuestionOpened", {
				question: clamInfo.question,
				level: currentLevel
			});
		});

		socket.on(
			"Scored",
			async function ({ key, playerId, score, clamQuestion, level }) {
				activeGames[key].players[playerId].score = score;
				let answeredQuestion = clamQuestion;

				if (level === 1) {
					activeGames[key].questionsLevel1.forEach(question => {
						if (question.question === clamQuestion) {
							question.isResolved = true;
							activeGames[key].count++;
						}
					});
				}
				if (level === 2) {
					activeGames[key].questionsLevel2.forEach(question => {
						if (question.question === clamQuestion) {
							question.isResolved = true;
							activeGames[key].count++;
						}
					});
				}
				if (level === 3) {
					activeGames[key].questionsLevel3.forEach(question => {
						if (question.question === clamQuestion) {
							question.isResolved = true;
							activeGames[key].count++;
						}
					});
				}
				if (level === 4) {
					activeGames[key].questionsLevel4.forEach(question => {
						if (question.question === clamQuestion) {
							question.isResolved = true;
							activeGames[key].count++;
						}
					});
				}
				if (level === 5) {
					activeGames[key].questionsLevel5.forEach(question => {
						if (question.question === clamQuestion) {
							question.isResolved = true;
							activeGames[key].count++;
						}
					});
				}
				// change it back to 5
				// if (count < 5) {
				io.to(key).emit("setState", activeGames[key]);
				io.to(key).emit("someoneScored", {
					friend: activeGames[key].players[playerId],
					question: answeredQuestion,
					level: activeGames[key].level
				});
				// }
				//change back to 5!
				if (activeGames[key].count >= 5) {
					activeGames[key].level++;
					io.to(key).emit("nextLevel", activeGames[key].level);
					activeGames[key].count = 0;
				}
			}
		);

		// when a player disconnects, remove them from our players object
		socket.on("disconnect", function () {
			//find which room they belong to
			let key = 0;
			for (let keys1 in activeGames) {
				for (let keys2 in activeGames[keys1]) {
					Object.keys(activeGames[keys1][keys2]).map(el => {
						if (el === socket.id) {
							key = keys1;
						}
					});
				}
			}

			const gameInfo = activeGames[key];

			if (gameInfo) {
				console.log("user disconnected: ", socket.id);
				delete gameInfo.players[socket.id];
				gameInfo.numPlayers = Object.keys(gameInfo.players).length;
				io.to(key).emit("disconnected", {
					playerId: socket.id,
					numPlayers: gameInfo.numPlayers
				});
			}
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
