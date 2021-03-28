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
		//LOAD
		const progressBar = this.add.graphics();
		const progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(240, 270, 320, 50);
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;
		const loadingText = this.make.text({
			x: width / 2,
			y: height / 2 - 50,
			text: "suiting up...",
			style: {
				font: "20px monospace",
				fill: "#1abeff"
			}
		});
		loadingText.setOrigin(0.5, 0.5);

		//% amounts
		const percentText = this.make.text({
			x: width / 2,
			y: height / 2 - 5,
			text: "0%",
			style: {
				font: "18px monospace",
				fill: "#ffffff"
			}
		});
		percentText.setOrigin(0.5, 0.5);

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

		//LOAD ON
		this.load.on("progress", function (value) {
			percentText.setText(parseInt(value * 100) + "%");
			progressBar.clear();
			progressBar.fillStyle(0x1abeff, 1);
			progressBar.fillRect(250, 280, 300 * value, 30);
		});

		this.load.on("complete", function () {
			progressBar.destroy();
			progressBox.destroy();
			loadingText.destroy();
			percentText.destroy();
		});
	}

	//add gamekey to url for host to share
	addUrl(gameKey) {
		const url = `${window.location.href}${gameKey}`;
		const msg = `invite yOur friends:\n\n${url}`;
		const link = this.add.text(100, 100, msg);
		link.setInteractive();
		link.on("pointerdown", () => {
			navigator.clipboard.writeText(url);
			link.setText("copied!");
		});
		return link;
	}

	//take on functin for rocks
	createRock(scene, rockName, x, y, scale = 1, angle = 0) {
		scene.decorations
			.create(x, y, rockName)
			.setScale(scale)
			.setAngle(angle)
			.refreshBody();
	}

	//helper function to create avatar for player
	createPlayer(scene, player) {
		scene.scubaDiver = new Scuba(scene, 100, 350, `${player.avatar}`).setScale(
			0.2
		);
		scene.scubaDiver.setAngle(-45);
		scene.scubaDiver.faceRight = true;

		//create animation
		scene.createAnimations(`${player.avatar}`);
		//add to physics group for collision detection
		scene.playerGroup.add(scene.scubaDiver);
		//scuba can't leave the screne
		scene.scubaDiver.body.collideWorldBounds = true;
		scene.cameras.main.startFollow(scene.scubaDiver);
		scene.scubaDiver.score = player.score;
		scene.scubaDiver.avatar = player.avatar;
		scene.scubaDiver.playerId = player.playerId;
	}

	createClam(scene, info, file) {
		const { x, y, question, options, answer, isResolved } = info;
		scene.clam = new Clam(scene, x, y, file).setScale(0.07);
		scene.createAnimations("clam");
		scene.clam.info = { question, options, answer, isResolved };
		scene.clam.overlapTriggered = false;
		scene.clam.overlapCollider = scene.physics.add.overlap(
			scene.scubaDiver,
			scene.clam,
			scene.isOverlappingQuestion,
			null,
			scene
		);
	}
	createShrimp(scene, info, file) {
		const { x, y, fact, isRead } = info;
		scene.shrimp = new Shrimp(scene, x, y, file).setScale(0.07);
		scene.createAnimations("shrimp");
		scene.shrimp.info = { fact, isRead };
		scene.shrimp.overlapTriggered = false;
		scene.shrimp.overlapCollider = scene.physics.add.overlap(
			scene.scubaDiver,
			scene.shrimp,
			scene.isOverlappingFact,
			null,
			scene
		);
	}

	// helper function to add animation to avatars
	createAnimations(sprite) {
		switch (sprite) {
			case "shrimp":
				this.anims.create({
					key: "shrimpmove",
					frames: this.anims.generateFrameNumbers(sprite, {
						start: 0,
						end: 2
					}),
					frameRate: 1,
					repeat: -1
				});
			case "clam":
				this.anims.create({
					key: "openclose",
					frames: this.anims.generateFrameNumbers(sprite, {
						start: 0,
						end: 2
					}),
					frameRate: 1,
					repeat: -1
				});
			default:
				this.anims.create({
					key: "swim",
					frames: this.anims.generateFrameNumbers(sprite, {
						start: 5,
						end: 9
					}),
					frameRate: 5,
					repeat: -1
				});
		}
	}

	// in here scubadiver and clam are variables passed in from add.overlap
	//scubadiver and clam do not have to be connected to scene in this callback function
	isOverlappingQuestion(scubaDiver, clam) {
		console.log("overlaptriggeret at start", clam.overlapTriggered);
		if (clam.overlapTriggered) {
			this.physics.world.removeCollider(clam.overlapCollider);
			clam.setTint(0xcbc3e3);
		}
		clam.setInteractive();
		clam.on("pointerdown", () => {
			this.scene.launch("Question", {
				info: clam.info,
				scubaDiver: scubaDiver,
				level: this.state.level,
				socket: this.socket,
				key: this.state.key
			});
			this.startTimer(10, clam, scubaDiver);
		});
		clam.overlapTriggered = !clam.overlapTriggered;
		console.log("is this resolved?", clam.info.isResolved);
		console.log("overlaptriggeret at end", clam.overlapTriggered);
	}

	isOverlappingFact(scubaDiver, shrimp) {
		if (shrimp.overlapTriggered) {
			this.physics.world.removeCollider(shrimp.overlapCollider);
			shrimp.setTint(0xbdef83);
		}
		if (!shrimp.isRead) {
			shrimp.setInteractive();
			shrimp.on("pointerdown", () => {
				this.scene.launch("Facts", { info: shrimp.info });
				this.startTimer(7, shrimp, scubaDiver, "Facts");
				scubaDiver.score = scubaDiver.score + this.state.level / 2; //does not do devition cause float...
				shrimp.isRead = true;
			});
		}
		shrimp.overlapTriggered = true; //WHERE DOES THIS NEED TO GO, WHAT DOES IT ANYWAY??!
	}
	// const timer = this.add.text(50, 50, "")

	async startTimer(time, animal, scuba, view = null) {
		scuba.frozen = true;
		while (time > 0) {
			//timer.setText(`${time}`)
			await this.sleep(1000);
			time--;
		}
		if (view) {
			this.scene.stop(view);
		}
		scuba.frozen = false;
		animal.disableInteractive();
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
		playerFriend.score = player.score;
		playerFriend.avatar = player.avatar;
		scene.playerFriends.add(playerFriend);
	}

	async sleep(delay) {
		return new Promise(resolve => setTimeout(() => resolve(true), delay));
	}

	yourScore(scubaDiver) {
		this.add
			.text(50, 50, `${scubaDiver.avatar}: ${scubaDiver.score}`, {
				fill: "#02075D",
				fontSize: 20
			})
			.setScrollFactor(0);
	}

	friendsScores(playerFriends) {
		console.log("playerFriends --->", playerFriends);
		let y = 70;
		playerFriends.getChildren().forEach(friend => {
			this.add
				.text(50, y, `${friend.avatar}: ${friend.score}`, {
					fontSize: 20
				})
				.setScrollFactor(0);
			y += 20;
		});
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

		let link;

		this.socket.on("gameCreated", gameKey => {
			link = this.addUrl(gameKey);
		});

		let waitingForHost;
		this.socket.on("startedCountdown", async seconds => {
			if (waitingForHost) waitingForHost.destroy();

			this.scene.stop("Instructions");
			const currentTimer = this.add.text(400, 200, `${seconds}`, {
				fontSize: 50
			});

			while (seconds > 0) {
				currentTimer.setText(`${seconds}`);
				await this.sleep(1000);
				seconds--;
			}
			this.scubaDiver.waiting = false;
			currentTimer.setText("swim!");
			await this.sleep(1000);
			currentTimer.destroy();
			this.yourScore(scene.scubaDiver);
			this.friendsScores(scene.playerFriends);

			//add clams and shrimps to game
			scene.state.questionsLevel1.forEach(question => {
				scene.createClam(scene, question, "clam");
			});
			scene.state.factsLevel1.forEach(fact => {
				scene.createShrimp(scene, fact, "shrimp");
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
				link.destroy();
				this.socket.emit("startCountdown", {
					seconds: 5,
					key: this.state.key
				});
			});
		} else {
			waitingForHost = this.add.text(
				170,
				590,
				"waiting fOr hOst tO start game..."
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
		//create rocks
		this.createRock(this, "rock-sand-1", 25, 500, 0.28, 20);
		this.createRock(this, "rock-sand-2", 135, 550, 0.25);
		this.createRock(this, "rock-sand-2", 600, 650, 0.2, -50);
		this.createRock(this, "rock-sand-1", 500, 900, 0.15);
		this.createRock(this, "rock-sand-1", 1000, 860, 0.4);
		this.createRock(this, "rock-sand-2", 935, 780, 0.3, -130);
		this.createRock(this, "rock-brown-2", 20, 900, 0.35, 90);
		this.createRock(this, "rock-sand-2", 100, 910, 0.3);
		this.createRock(this, "rock-sand-1", 170, 870, 0.2);
		this.createRock(this, "rock-brown-2", 1050, 1360, 0.6, -90);
		this.createRock(this, "rock-sand-2", 835, 1180, 0.3, 0);
		this.createRock(this, "rock-brown-1", 1035, 1500, 0.5, -90);
		this.createRock(this, "rock-brown-3", 760, 1470, 0.2);
		this.createRock(this, "rock-brown-3", 350, 1300, 0.5);
		this.createRock(this, "rock-brown-2", 150, 1500, 0.3);
		this.createRock(this, "rock-brown-1", 330, 1520, 0.2);
		this.createRock(this, "rock-gray-3", 250, 1550, 0.4);
		this.createRock(this, "rock-brown-1", 500, 1700, 0.3);
		this.createRock(this, "rock-gray-1", 370, 1600, 0.35);
		this.createRock(this, "rock-brown-3", 900, 2000, 0.4, -50);
		this.createRock(this, "rock-gray-1", 835, 2100, 0.2, -120);
		this.createRock(this, "rock-gray-1", 435, 2150, 0.25, 120);
		this.createRock(this, "rock-gray-2", 505, 2100, 0.3, 20);
		this.createRock(this, "rock-brown-1", 475, 2200, 0.35, 0);
		this.createRock(this, "rock-gray-3", 100, 1800, 0.55, -90);
		this.createRock(this, "rock-brown-3", 835, 2500, 0.6, 0);

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
		this.socket.on(
			"setState",
			function ({
				key,
				players,
				avatars,
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
			}) {
				scene.state = {
					key,
					players,
					avatars,
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
				};
				//this.physics.resume() ----> WHAT DOES THIS??

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
			}
		);

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

		this.socket.on("friendScored", friend => {
			scene.playerFriends.getChildren().forEach(function (playerFriend) {
				if (friend.playerId === playerFriend.playerId) {
					playerFriend.score = friend.score;
				}
			});

			//NOT WORKING!
			this.friendsScores(scene.playerFriends);
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
