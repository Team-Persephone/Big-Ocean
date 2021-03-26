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

		this.load.image("rock-brown-1", "/assets/rock-brown-1.png");
		this.load.image("rock-brown-2", "/assets/rock-brown-2.png");
		this.load.image("rock-brown-3", "/assets/rock-brown-3.png");
		this.load.image("rock-gray-1", "/assets/rock-gray-1.png");
		this.load.image("rock-gray-2", "/assets/rock-gray-2.png");
		this.load.image("rock-gray-3", "/assets/rock-gray-3.png");
		this.load.image("rock-sand-1", "/assets/rock-sand-1.png");
		this.load.image("rock-sand-2", "/assets/rock-sand-2.png");

		//load background
		this.load.image("tiles", "/assets/background/big-ocean-tilesheet.png");
		this.load.tilemapTiledJSON("bigOcean", "/assets/background/big-ocean.json");

		this.load.image("instructions", "/assets/bubble.png");

		//Audio
		this.load.audio("music", ["/audio/Waiting_Room.mp3"]);
	}

	//helper function to create avatar for player
	createPlayer(scene, player) {
		scene.scubaDiver = new Scuba(scene, 100, 350, `${player.avatar}`).setScale(
			0.2
		);
		scene.scubaDiver.setAngle(-45);
		scene.scubaDiver.faceRight = true;

		//create animation
		scene.createAnimations(player.avatar);
		//add to physics group for collision detection
		scene.playerGroup.add(scene.scubaDiver);
		//scuba can't leave the screne
		scene.scubaDiver.body.collideWorldBounds = true;
		scene.cameras.main.startFollow(scene.scubaDiver);
	}

	createClam(scene, info, file) {
		const { x, y, question, options, answer } = info;
		scene.clam = new Clam(scene, x, y, file).setScale(0.07);
		scene.createAnimationsClam("clam");
		scene.clam.info = { question, options, answer };
		scene.clam.overlapTriggered = false;
		scene.clam.overlapCollider = scene.physics.add.overlap(
			scene.scubaDiver,
			scene.clam,
			scene.isOverlapping,
			null,
			scene
		);
	}
	createShrimp(scene, x, y, file) {
		scene.shrimp = new Shrimp(scene, x, y, file).setScale(0.07);
		scene.createAnimationsShrimp("shrimp");
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
	// in here scubadiver and clam are variables passed in from add.overlap
	//scubadiver and clam do not have to be connected to scene in this callback function
	isOverlapping(scubaDiver, clam) {
		if (clam.overlapTriggered) {
			this.physics.world.removeCollider(clam.overlapCollider);
		}
		clam.setTint(0xbdef83);
		clam.setInteractive();
		clam.on("pointerdown", () => {
			this.scene.launch("Question", { info: clam.info });
			clam.disableInteractive();
		});
		console.log("overlapping!");
		clam.overlapTriggered = true;
	}

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
		//connect the socket connection to IntoScene
		this.scene.launch("IntroScene", { socket: this.socket });
		this.scene.launch("ChatScene", { socket: this.socket });

		const sleep = async delay => {
			return new Promise(resolve => setTimeout(() => resolve(true), delay));
		};
		let waitingForHost;

		this.socket.on("startedCountdown", async seconds => {
			//INSTRUCTIONS BUBBLE
			scene.instructionsBubble = scene.add
				.image(734, 545, "instructions")
				.setScale(0.15)
				.setScrollFactor(0);

			scene.instructionsBubble.setInteractive();

			scene.showInstructions = false;

			scene.instructionsBubble.on("pointerdown", () => {
				if (!scene.showInstructions) {
					scene.showInstructions = !scene.showInstructions;
					scene.scene.launch("Instructions");
				} else if (scene.showInstructions) {
					scene.showInstructions = !scene.showInstructions;
					scene.scene.stop("Instructions");
				}
			});

			if (waitingForHost) waitingForHost.destroy();

			this.scene.stop("Instructions");

			const currentTimer = this.add.text(300, 200, `${seconds}`, {
				fontSize: 50
			});

			while (seconds > 0) {
				currentTimer.setText(`${seconds}`);
				await sleep(1000);
				seconds--;
			}
			this.scubaDiver.waiting = false;
			currentTimer.setText("gO!");
			await sleep(1000);
			currentTimer.destroy();
			//add clams and shrimps to game
			scene.state.questionsLevel1.forEach(question => {
				scene.createClam(scene, question, "clam");
			});
			scene.state.factsLevel1.forEach(fact => {
				scene.createShrimp(scene, fact.x, fact.y, "shrimp");
			});
		});

		//set background
		const map = this.make.tilemap({ key: "bigOcean" });
		const tileset = map.addTilesetImage("big-ocean-tilesheet", "tiles");

		//background layers
		map.createStaticLayer("gradient", tileset);
		map.createStaticLayer("stone", tileset);
		map.createStaticLayer("stone2", tileset);
		map.createStaticLayer("foam", tileset);

		// const displayPlay = this.displayPlayButton;

		if (window.location.pathname.length <= 1) {
			const display = this.add.text(
				170,
				590,
				"When yOu are ready tO plunge, click"
			);
			const playButton = this.add.text(520, 590, "< start >", {
				fontFamily: "menlo"
			});

			playButton.setInteractive();
			playButton.on("pointerdown", () => {
				playButton.setVisible(false);
				display.setVisible(false);
				this.socket.emit("startCountdown", 5);
			});
		} else {
			waitingForHost = this.add.text(
				170,
				590,
				"Waiting for host to start game"
			);
		}

		//set boundries to the game world
		this.physics.world.setBounds(0, 320, 1088, 4800);
		//makes friends visibel
		scene.playerFriends = this.physics.add.group();

		//set up camera
		this.cameras.main.setBounds(0, 0, 1088, 4800);

		//add the playerGroup of scubaDivers to collider
		this.playerGroup = this.physics.add.group();

		//add rocks
		this.decorations = this.physics.add.staticGroup();

		this.platform = this.add
			.sprite(60, 550, "rock-sand-1")
			.setScale(0.2)
			.setAngle(30);
		this.decorations.add(this.platform);

		this.decorations
			.create(25, 500, "rock-sand-1")
			.setScale(0.28)
			.setAngle(20)
			.refreshBody();
		this.decorations
			.create(135, 550, "rock-sand-2")
			.setScale(0.25)
			.refreshBody();

		this.decorations
			.create(600, 650, "rock-sand-2")
			.setScale(0.2)
			.setAngle(-50)
			.refreshBody();
		this.decorations
			.create(500, 900, "rock-sand-1")
			.setScale(0.15)
			.refreshBody();

		this.decorations
			.create(1000, 860, "rock-sand-1")
			.setScale(0.4)
			.refreshBody();
		this.decorations
			.create(935, 780, "rock-sand-2")
			.setScale(0.3)
			.setAngle(-130)
			.refreshBody();

		this.decorations
			.create(20, 900, "rock-brown-2")
			.setScale(0.35)
			.setAngle(90)
			.refreshBody();
		this.decorations
			.create(100, 910, "rock-sand-2")
			.setScale(0.3)
			.refreshBody();
		this.decorations
			.create(170, 870, "rock-sand-1")
			.setScale(0.2)
			.refreshBody();

		this.decorations
			.create(1050, 1360, "rock-brown-2")
			.setScale(0.6)
			.setAngle(-90)
			.refreshBody();
		this.decorations
			.create(835, 1180, "rock-sand-2")
			.setScale(0.3)
			.setAngle(0)
			.refreshBody();
		this.decorations
			.create(1035, 1500, "rock-brown-1")
			.setScale(0.5)
			.setAngle(-90)
			.refreshBody();
		this.decorations
			.create(760, 1470, "rock-brown-3")
			.setScale(0.2)
			.refreshBody();

		this.decorations
			.create(350, 1300, "rock-brown-3")
			.setScale(0.5)
			.refreshBody();

		this.decorations
			.create(150, 1500, "rock-brown-2")
			.setScale(0.3)
			.refreshBody();
		this.decorations
			.create(330, 1520, "rock-brown-1")
			.setScale(0.2)
			.refreshBody();
		this.decorations
			.create(250, 1550, "rock-gray-3")
			.setScale(0.4)
			.refreshBody();
		this.decorations
			.create(500, 1700, "rock-brown-1")
			.setScale(0.3)
			.refreshBody();
		this.decorations
			.create(370, 1600, "rock-gray-1")
			.setScale(0.35)
			.refreshBody();

		this.decorations
			.create(900, 2000, "rock-brown-3")
			.setScale(0.4)
			.setAngle(-50)
			.refreshBody();
		this.decorations
			.create(835, 2100, "rock-gray-1")
			.setScale(0.2)
			.setAngle(-120)
			.refreshBody();

		this.decorations
			.create(435, 2150, "rock-gray-1")
			.setScale(0.25)
			.setAngle(120)
			.refreshBody();
		this.decorations
			.create(505, 2100, "rock-gray-2")
			.setScale(0.3)
			.setAngle(20)
			.refreshBody();
		this.decorations
			.create(475, 2200, "rock-brown-1")
			.setScale(0.35)
			.setAngle(0)
			.refreshBody();

		this.decorations
			.create(100, 1800, "rock-gray-3")
			.setScale(0.55)
			.setAngle(-90)
			.refreshBody();

		this.decorations
			.create(835, 2500, "rock-brown-3")
			.setScale(0.6)
			.setAngle(0)
			.refreshBody();

		this.physics.add.collider(this.playerGroup, this.decorations);

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
