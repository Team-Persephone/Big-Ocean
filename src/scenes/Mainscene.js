import Phaser from "phaser";
import Scuba from "../entities/Scuba";
import Clam from "../entities/Clam";
import Shrimp from "../entities/Shrimp";

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

		this.load.spritesheet("shrimp", "/assets/shrimp.png", {
			frameWidth: 1000,
			frameHeight: 1090
		});

		//load background
		this.load.image("tiles", "/assets/background/big-ocean-tilesheet.png");
		this.load.tilemapTiledJSON("bigOcean", "/assets/background/big-ocean.json");

		//rocks-Textures
		this.load.image("rocks", "/assets/rocks.png");

		//Audio
		this.load.audio("music", ["/audio/Waiting_Room.mp3"]);
	}

	//helper function to create avatar for player
	createPlayer(scene, player) {
		scene.scubaDiver = new Scuba(this, 100, 350, `${player.avatar}`).setScale(
			0.2
		);
		scene.scubaDiver.setAngle(-45);
		scene.scubaDiver.faceRight = true;
		//scuba can't leave the screne
		scene.scubaDiver.body.collideWorldBounds = true;
		scene.cameras.main.startFollow(scene.scubaDiver);
		//create animation
		this.createAnimations(player.avatar);
		// this.physics.add.collider(scene.scubaDiver, this.decorations);
	}

	createClam(scene, x, y, file) {
		scene.clam = new Clam(this, x, y, file).setScale(0.07);
		this.createAnimationsClam("clam");
		this.createOverlap(scene, scene.scubaDiver, scene.clam);
	}
	createShrimp(scene, x, y, file) {
		scene.shrimp = new Shrimp(this, x, y, file).setScale(0.07);
		this.createAnimationsShrimp("shrimp");
		this.createOverlap(scene, scene.scubaDiver, scene.shrimp);
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

	createAnimationsShrimp(object) {
		this.anims.create({
			key: "shrimpmove",
			frames: this.anims.generateFrameNumbers(object, {
				start: 0,
				end: 2
			}),
			frameRate: 1,
			repeat: -1
		});
	}

	createOverlap(scene, scubaDiver, object) {
		scene.physics.add.overlap(scubaDiver, object, () =>
			object.setTint(0xbdef83)
		);
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
		console.log("this is phaser.world", this);
		this.music = this.sound.add("music", {
			volume: 0.5,
			loop: true
		});
		this.music.play();

		//launch the socket connection
		this.socket = io();

		// const sleep = async delay => {
		// 	return new Promise(resolve => setTimeout(() => resolve(true), delay));
		// };

		// this.socket.on("startedCountdown", async seconds => {
		// 	const currentTimer = this.add.text(300, 200, `${seconds}`);

		// 	while (seconds > 0) {
		// 		console.log(seconds)
		//     currentTimer.setText(`${seconds}`);
		//     // await sleep(1000);
		// 		await sleep(0);
		// 		seconds--;
		//   }
		//   currentTimer.destroy();

		//   this.scubaDiver.setWaiting(false)
		// });

		//connect the socket connection to IntoScene
		this.scene.launch("ChatScene", { socket: this.socket });
		this.scene.launch("IntroScene", { socket: this.socket });

		//set background
		const map = this.make.tilemap({ key: "bigOcean" });
		const tileset = map.addTilesetImage("big-ocean-tilesheet", "tiles");

		//background layers
		map.createStaticLayer("gradient", tileset);
		map.createStaticLayer("stone", tileset);
		map.createStaticLayer("stone2", tileset);
		map.createStaticLayer("foam", tileset);

		const playButton = this.add.text(400, 500, "Play", { fontFamily: "menlo" });
		playButton.setInteractive();
		playButton.on("pointerdown", () => {
			playButton.setVisible(false);
			scene.state.questionsLevel1.forEach(question => {
				scene.createClam(scene, question.x, question.y, "clam");
			});
			scene.state.factsLevel1.forEach(fact => {
				scene.createShrimp(scene, fact.x, fact.y, "shrimp");
			});
		});
		//set boundries to the game world
		this.physics.world.setBounds(0, 320, 1088, 4800);
		//makes friends visibel
		scene.playerFriends = this.physics.add.group();
		//create navigation and animation for scuba divers
		this.cursors = this.input.keyboard.createCursorKeys();
		//set up camera
		this.cameras.main.setBounds(0, 0, 1088, 4800);
		//add rock
		this.decorations = this.physics.add.staticGroup();

		//this.physics.arcade.checkCollision.down = false;
		this.platform = this.add.sprite(100, 100, "rocks").setScale(0.2);
		this.decorations.add(this.platform);

		//  this.physics.add.existing(platform, true);
		//  platform.body.immovable = true;

		//	ground.create(50, 100, "rocks").setScale(0.4).refreshBody();
		//	ground.create(500, 300, "rocks").setScale(0.3).refreshBody();
		//  console.log(this.state, 'this.state<--');
		// this.physics.add.collider(this.state.players, platform);

		//create navigation and animation for scuba divers
		//this.cursors = this.input.keyboard.createCursorKeys();

		this.cursors = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.UP,
			down: Phaser.Input.Keyboard.KeyCodes.DOWN,
			left: Phaser.Input.Keyboard.KeyCodes.LEFT,
			right: Phaser.Input.Keyboard.KeyCodes.RIGHT
		});

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
				factsLevel1,
				factsLevel2,
				factsLevel3,
				factsLevel4,
				factsLevel5
			} = gameInfo;
			//this.physics.resume() ----> WHAT DOES THIS??

			//set state to gameInfo
			scene.state.key = key;
			scene.state.players5 = players;
			scene.state.avatars = avatars;
			scene.state.score = score;
			scene.state.level = level;

			scene.state.questionsLevel1 = questionsLevel1;
			scene.state.questionsLevel2 = questionsLevel2;
			scene.state.questionsLevel3 = questionsLevel3;
			scene.state.questionsLevel4 = questionsLevel4;
			scene.state.questionsLevel5 = questionsLevel5;
			scene.state.factsLevel1 = factsLevel1;
			scene.state.factsLevel2 = factsLevel2;
			scene.state.factsLevel3 = factsLevel3;
			scene.state.factsLevel4 = factsLevel4;
			scene.state.factsLevel5 = factsLevel5;
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
