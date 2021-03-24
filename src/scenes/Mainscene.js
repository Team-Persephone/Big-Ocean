import Phaser from "phaser";
import Scuba from "../entities/Scuba";
import Clam from "../entities/Clam";

export default class MainScene extends Phaser.Scene {
	constructor() {
		super("MainScene");
		//state will be used to hold socket info
		this.state = {};
	}

	// THIS IS PHASER PRELOAD FUCNTION TO LOAD ALL FILES NEEDED TO CREATE SCENE
	preload() {
		// all avatars are loaded
		this.load.spritesheet("scubaPink", "/assets/scuba_divers/scubaPink.png", {
			frameWidth: 820,
			frameHeight: 420
		});
		this.load.spritesheet("scubaGreen", "/assets/scuba_divers/scubaGreen.png", {
			frameWidth: 820,
			frameHeight: 420
		});
		this.load.spritesheet(
			"scubaPurple",
			"/assets/scuba_divers/scubaPurple.png",
			{
				frameWidth: 820,
				frameHeight: 420
			}
		);
		this.load.spritesheet("clam", "/assets/clam.png", {
			frameWidth: 990,
			frameHeight: 860
		});

		// our background scene is loaded
		this.load.image("tiles", "/assets/ocean-tilesheet.png");
		this.load.tilemapTiledJSON("tilemap", "/assets/big-ocean-level1.json");

		//Audio
		this.load.audio("music", ["/audio/Waiting_Room.mp3"]);
	}

	//helper function to create avatar for player
	createPlayer(scene, player) {
		scene.scubaDiver = new Scuba(this, 100, 200, `${player.avatar}`).setScale(
			0.2
		);
		scene.scubaDiver.setAngle(-45);
		scene.scubaDiver.faceRight = true;
		//scuba can't leave the screne
		scene.scubaDiver.body.collideWorldBounds = true;
		this.createAnimations(player.avatar);
	}

	createClam(scene, x, y, file) {
		scene.clam = new Clam(this, x, y, file).setScale(0.07);
		console.log(scene.clam);
		this.createAnimationsClam("clam");
	}

	// helper function to add animation to avatars
	createAnimations(avatar) {
		this.anims.create({
			key: "swim",
			frames: this.anims.generateFrameNumbers(avatar, {
				start: 5,
				end: 9
			}),
			frameRate: 5,
			repeat: -1
		});
	}

	createAnimationsClam(object) {
		this.anims.create({
			key: "openclose",
			frames: this.anims.generateFrameNumbers(object, {
				start: 0,
				end: 2
			}),
			frameRate: 1,
			repeat: -1
		});
	}

	//helper function to add other players to scene
	addFriends(scene, player) {
		const playerFriend = scene.add
			.sprite(
				player.position.x + 40,
				player.position.y + 40,
				`${player.avatar}`
			)
			.setScale(0.2);
		playerFriend.faceRight = true;
		playerFriend.playerId = player.playerId;
		scene.playerFriends.add(playerFriend);
	}

	// THIS IS PHASER CREATE FUNCTION TO CREATE SCENE
	create() {
		const scene = this;

		this.music = this.sound.add("music", {
			volume: 0.5,
			loop: true
		});
		this.music.play();

		//launch the socket connection
		this.socket = io();
		//connect the socket connection to the WaitingRoom

		// const clam = this.scene.add.sprite(0, 0, "clam");

		// this.scene.clams.add(clam);

		this.scene.launch("WaitingRoom", { socket: this.socket });
		this.scene.launch("ChatScene", { socket: this.socket });
		this.scene.launch("IntroScene", { socket: this.socket });

		scene.playerFriends = this.physics.add.group(); //---> WHAT DOES THIS AND IS THIS CORRECTLY IMPLIED FOR OUR PROJECT?!
		// scene.clams = this.physics.add.group();
		// create scene from tilemap
		const map = this.make.tilemap({ key: "tilemap" });
		const tileset = map.addTilesetImage("ocean-scene", "tiles");

		map.createStaticLayer("water", tileset);
		map.createStaticLayer("rocklevel1", tileset);
		map.createStaticLayer("rocklevel2", tileset);
		map.createStaticLayer("seeweed", tileset);

		const playButton = this.add.text(400, 500, "Play", { fontFamily: "menlo" });
		playButton.setInteractive();
		playButton.on("pointerdown", () => {
			playButton.setVisible(false);
			scene.state.questionsLevel1.forEach(question => {
				scene.createClam(scene, question.x, question.y, "clam");
			});
		});

		//create navigation and animation for scuba divers
		this.cursors = this.input.keyboard.createCursorKeys();

		//Volume - add volume sound bar for display here

		// this.createPlayer(gameInfo.players[socketId])
		this.socket.on("setState", function (gameInfo) {
			const {
				key,
				players,
				avatars,
				score,
				level,
				questionsLevel1,
				questionsLevel2,
				questionsLevel3,
				questionsLevel4,
				questionsLevel5,
				facts
			} = gameInfo;
			//this.physics.resume() ----> WHAT DOES THIS??

			//set state to gameInfo
			scene.state.key = key;
			scene.state.players = players;
			scene.state.avatars = avatars;
			scene.state.score = score;
			scene.state.level = level;
			scene.state.questionsLevel1 = questionsLevel1;
			scene.state.questionsLevel2 = questionsLevel2;
			scene.state.questionsLevel3 = questionsLevel3;
			scene.state.questionsLevel4 = questionsLevel4;
			scene.state.questionsLevel5 = questionsLevel5;
			scene.state.facts = facts;

			// console.log("state -->", scene.state);
		});

		this.socket.on("currentPlayers", function ({ players, numPlayers }) {
			scene.state.numPlayers = numPlayers;
			Object.keys(players).forEach(function (id) {
				if (players[id].playerId === scene.socket.id) {
					scene.createPlayer(scene, players[id]);
				} else {
					scene.addFriends(scene, players[id]);
				}
			});
		});
		//listen to add new player to scene
		this.socket.on("newPlayer", function ({ newPlayer, numPlayers }) {
			scene.addFriends(scene, newPlayer);
			scene.state.numPlayers = numPlayers;
		});

		this.socket.on("friendMoved", function (friend) {
			scene.playerFriends.getChildren().forEach(function (playerFriend) {
				if (friend.playerId === playerFriend.playerId) {
					const previousX = playerFriend.x;
					const previousY = playerFriend.y;
					const previousAngle = playerFriend.angle;
					const previousFaceRight = playerFriend.faceRight;

					if (previousX !== friend.position.x) {
						playerFriend.x = friend.position.x;
					}
					if (previousY !== friend.position.y) {
						playerFriend.y = friend.position.y;
					}
					if (previousAngle !== friend.position.angle) {
						playerFriend.angle = friend.position.angle;
					}
					if (previousFaceRight !== friend.position.faceRight) {
						playerFriend.flipX = !playerFriend.flipX;
						playerFriend.faceRight = friend.position.faceRight;
					}
				}
			});
		});
	}

	update() {
		const scene = this;
		//update the movement
		if (this.scubaDiver) {
			this.scubaDiver.update(this.cursors);
		}
	}
}
