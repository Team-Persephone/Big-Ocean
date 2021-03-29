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
		this.load.image("instructions", "/assets/bubble.png");

		//rocks-Textures
		this.load.image("rock-brown-1", "/assets/rock-brown-1.png");
		this.load.image("rock-brown-2", "/assets/rock-brown-2.png");
		this.load.image("rock-brown-3", "/assets/rock-brown-3.png");
		this.load.image("rock-gray-1", "/assets/rock-gray-1.png");
		this.load.image("rock-gray-2", "/assets/rock-gray-2.png");
		this.load.image("rock-gray-3", "/assets/rock-gray-3.png");
		this.load.image("rock-sand-1", "/assets/rock-sand-1.png");
		this.load.image("rock-sand-2", "/assets/rock-sand-2.png");

		//Audio Images
		this.load.image("volumeOn", "/assets/volume/volumeOn.png");
		this.load.image("volumeOff", "/assets/volume/volumeOff.png");
		this.load.image("volumeUp", "/assets/volume/volumeUp.png");
		this.load.image("volumeDown", "/assets/volume/volumeDown.png");

		//Audio Sounds
		//background bubbles
		this.load.audio("music", ["/audio/Waiting_Room.mp3"]);
		//click on clam
		this.load.audio("clamClick", "/audio/clam-click.mp3");
		//click on shrimp
		this.load.audio("shrimpClick", "/audio/shrimpClick.mp3");
		//collide with rock
		this.load.audio("impact", "/audio/impact.mp3");
		//Start game timer countdown
		this.load.audio("countdown", "/audio/countdown.mp3");
		// question/fact click count
		this.load.audio("click", "/audio/click.mp3");
		//instructions pop up
		this.load.audio("infoBubble", "/audio/infoBubble.mp3");
		//level timer up/lose game
		this.load.audio("gameOver", "/audio/gameOver.mp3"); //not linked yet
		//win game
		this.load.audio("gameWin", "/audio/gameWin.mp3"); //not linked yet

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
				level: this.state.level
			});
			this.clamClick.play();
			this.startTimer(10, clam, scubaDiver);
			//	this.click.play();
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
				this.shrimpClick.play();
				this.startTimer(7, shrimp, scubaDiver, "Facts");
				//if fixing clam click count can remove below line
				this.click.play();
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
			//can add so is with clam click, but cannot stop it yet as timer
			//continues when answer is right or wrong
			//	this.click.play();
			await this.sleep(1000);
			time--;
		}
		if (view) {
			this.scene.stop(view);
		}
		scuba.frozen = false;
		animal.disableInteractive();
		this.click.stop();
	}

	addFriends(scene, player, score) {
		const playerFriend = scene.add
			.sprite(
				player.position.x + 40,
				player.position.y + 40,
				`${player.avatar}`
			)
			.setScale(0.2);
		playerFriend.faceRight = true;
		playerFriend.playerId = player.playerId;
		playerFriend.socre = score;
		scene.playerFriends.add(playerFriend);
	}

	async sleep(delay) {
		return new Promise(resolve => setTimeout(() => resolve(true), delay));
	}

	// THIS IS PHASER CREATE FUNCTION TO CREATE SCENE
	create() {
		const scene = this;
		this.music = this.sound.add("music", {
			volume: 0.05,
			loop: true
		});
		this.music.play();
		this.clamClick = this.sound.add("clamClick", { volume: 2 });
		this.shrimpClick = this.sound.add("shrimpClick", { volume: 0.6 });
		this.impact = this.sound.add("impact", { volume: 2 }); //not hooked up correctly
		this.countdown = this.sound.add("countdown", { volume: 1 });
		this.click = this.sound.add("click", {
			volume: 0.5,
			loop: true,
			rate: 0.9
		}); //needs work with clam
		this.infoBubble = this.sound.add("infoBubble", { volume: 6 });

		//launch the socket connection
		this.socket = io();
		//connect the socket connection to IntoScene
		this.scene.launch("IntroScene", { socket: this.socket });
		this.scene.launch("ChatScene", { socket: this.socket });

		let waitingForHost;
		this.socket.on("startedCountdown", async seconds => {

		//Volume
		this.volumeOn = this.add.image(700, 50, "volumeOn").setScrollFactor(0).setScale(.09);
		this.volumeUp = this.add.image(750, 50, "volumeUp").setScrollFactor(0).setScale(.07);
		this.volumeDown = this.add.image(650, 50, "volumeDown").setScrollFactor(0).setScale(.07);

		this.volumeOn.setInteractive();
		this.volumeUp.setInteractive();
		this.volumeDown.setInteractive();

		this.volumeUp.on("pointerdown", () => {
			this.volumeUp.setTint(0xc2c2c2);
			let newVol = this.sound.volume + 0.1;
			this.sound.setVolume(newVol);
			if (this.sound.volume < 0.1) {
				this.volumeOn.setTexture("volumeOn");
			}
			if (this.sound.volume >= 1.5) {
				this.volumeUp.setTint(0x056ff1);
				this.volumeUp.disableInteractive();
			  } else {
				this.volumeDown.clearTint();
				this.volumeDown.setInteractive();
			  } 
		});
		this.volumeDown.on("pointerdown", () => {
			this.volumeDown.setTint(0xc2c2c2);
			let newVol = this.sound.volume - 0.1;
			this.sound.setVolume(newVol);
			if (this.sound.volume <= 0.1) {
			  this.volumeDown.setTint(0x056ff1);
			  this.volumeDown.disableInteractive();
			  this.volumeSpeaker.setTexture("volumeOff");
			} else {
			  this.volumeUp.clearTint();
			  this.volumeUp.setInteractive();
			}
		  });
		  this.volumeDown.on("pointerup", () => {
			this.volumeDown.clearTint();
		  });
		  this.volumeUp.on("pointerup", () => {
			this.volumeUp.clearTint();
		  });

		  this.volumeOn.on("pointerdown", () => {
			if (this.volumeOn.texture.key === "volumeOn") {
			  this.volumeOn.setTexture("volumeOff");
			  this.sound.setMute(true);
			} else {
			  this.volumeOn.setTexture("volumeOn");
			  this.sound.setMute(false);
			}
		  });
  
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
					this.infoBubble.play();
					scene.scene.launch("Instructions");
				} else if (scene.showInstructions) {
					scene.showInstructions = !scene.showInstructions;
					this.infoBubble.play();
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
				this.countdown.play();
				await this.sleep(1000);
				seconds--;
			}
			this.scubaDiver.waiting = false;
			currentTimer.setText("swim!");
			await this.sleep(1000);
			this.countdown.stop();
			currentTimer.destroy();

			this.add
				.text(50, 50, `${scene.scubaDiver.avatar}: ${scene.scubaDiver.score}`, {
					fontSize: 20
				})
				.setScrollFactor(0);
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
				this.socket.emit("startCountdown", 5);
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

		this.physics.add.collider(this.playerGroup, this.decorations, function () {
			console.log("inside collider with rocks, tetsing sound");
			//this.impact.play();
		});

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
			scene.state.players = players;
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
		this.socket.on("newPlayer", function ({ score, newPlayer, numPlayers }) {
			scene.addFriends(scene, newPlayer, score);
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
