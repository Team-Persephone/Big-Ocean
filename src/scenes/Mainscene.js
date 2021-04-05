import Phaser from "phaser";
import Scuba from "../entities/Scuba";
import Clam from "../entities/Clam";
import Shrimp from "../entities/Shrimp";
import Jellyfish from "../entities/Jellyfish";

const chatContainer = document.getElementsByClassName(
	"chat-box chat-hidden"
)[0];

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
		this.load.spritesheet("scubaPurple", "/assets/scuba_divers/scubaPurpleNew.png", {
			frameWidth: 820,
			frameHeight: 420
		});
		this.load.spritesheet("clam", "/assets/animals/clam.png", {
			frameWidth: 990,
			frameHeight: 860
		});
		this.load.spritesheet("shrimp", "/assets/animals/shrimp.png", {
			frameWidth: 1000,
			frameHeight: 1090
		});
		this.load.spritesheet("jellyfish", "assets/animals/jellyfish_small.png", {
			frameWidth: 300,
			frameHeight: 300
		})

		this.load.image("pearl", "/assets/pearl.png")

		//load background
		this.load.image("tiles", "/assets/background/big-ocean-tilesheet.png");
		this.load.tilemapTiledJSON("bigOcean", "/assets/background/big-ocean.json");
		this.load.image("instructions", "/assets/bubble.png");

		//rocks-Textures
		this.load.image("rock-brown-1", "/assets/rocks/rock-brown-1.png");
		this.load.image("rock-brown-2", "/assets/rocks/rock-brown-2.png");
		this.load.image("rock-brown-3", "/assets/rocks/rock-brown-3.png");
		this.load.image("rock-gray-1", "/assets/rocks/rock-gray-1.png");
		this.load.image("rock-gray-2", "/assets/rocks/rock-gray-2.png");
		this.load.image("rock-gray-3", "/assets/rocks/rock-gray-3.png");
		this.load.image("rock-sand-1", "/assets/rocks/rock-sand-1.png");
		this.load.image("rock-sand-2", "/assets/rocks/rock-sand-2.png");

		//Audio Images
		this.load.image("volumeOn", "/assets/volume/volumeOn.png");
		this.load.image("volumeOff", "/assets/volume/volumeOff.png");
		this.load.image("volumeUp", "/assets/volume/volumeUp.png");
		this.load.image("volumeDown", "/assets/volume/volumeDown.png");

		//WATERPLANT IMAGE
		this.load.image("waterPlant", "/assets/waterplant3.png");

		//Audio Sounds
		//background bubbles
		this.load.audio("music", ["/audio/Waiting_Room.mp3"]);
		//click on clam
		this.load.audio("clamClick", "/audio/clam-click.mp3");
		//click on shrimp
		this.load.audio("shrimpClick", "/audio/shrimpClick.mp3");
		//Start game timer countdown
		this.load.audio("countdown", "/audio/countdown.mp3");
		// question/fact click count
		this.load.audio("click", "/audio/click.mp3");
		//instructions pop up
		this.load.audio("infoBubble", "/audio/infoBubble.mp3");
		//nextLevel -seaweed parting
		this.load.audio("nextLevel", "/audio/nextLevel.mp3");

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
			link.setText("cOpied!");
		});
		return link;
	}
	//take on function for rocks
	createRock(scene, rockName, x, y, scale = 1, angle = 0) {
		scene.decorations
			.create(x, y, rockName)
			.setScale(scale)
			.setAngle(angle)
			.refreshBody();
	}

	//helper function to create avatar for player
	createPlayer(scene, player) {
		scene.scubaDiver = new Scuba(scene, 100, 350, `${player.avatar}`).setScale(0.2);
		scene.scubaDiver.setAngle(-45);
		scene.scubaDiver.faceRight = true;
		scene.scubaDiver.setSize(scene.scubaDiver.width * 0.5, scene.scubaDiver.height * 0.5, true)
		//create animation
		scene.createScubaAnims(`${player.avatar}`);
		scene.scubaDiver.anims.play("swim")
		//add to physics group for collision detection
		scene.playerGroup.add(scene.scubaDiver);
		//add chat if new player created
		if (Object.keys(scene.state.players).length > 1) {
			chatContainer.classList.remove("chat-hidden");
		}
		//scuba can't leave the screne
		scene.scubaDiver.body.collideWorldBounds = true;
		scene.cameras.main.startFollow(scene.scubaDiver);
		scene.scubaDiver.score = player.score;
		scene.scubaDiver.avatar = player.avatar;
		scene.scubaDiver.playerId = player.playerId;
	}

	createClam(scene, level, info, file) {
		const { x, y, question, options, answer, isResolved } = info;
		scene.createAnimations("clam");
		const clam = new Clam(scene, x, y, file).setScale(0.07);
		clam.setSize(clam.width * 2, clam.height * 2, true)
		clam.info = { question, options, answer, isResolved };
		if (level === 1) {
			scene.clamsLevel1.add(clam);
		}
		if (level === 2) {
			scene.clamsLevel2.add(clam);
		}
		if (level === 3) {
			scene.clamsLevel3.add(clam);
		}
		if (level === 4) {
			scene.clamsLevel4.add(clam);
		}
		if (level === 5) {
			scene.clamsLevel5.add(clam);
		}
		return clam;
	}
	createShrimp(scene, info, file) {
		const { x, y, fact, isRead } = info;
		const level = scene.state.level;
		scene.createAnimations("shrimp");
		const shrimp = new Shrimp(scene, x, y, file).setScale(0.05);
		shrimp.setSize(shrimp.width, shrimp.height, true)
		shrimp.info = { fact, isRead, level };
		scene.shrimps.add(shrimp);
	}

	createJellyfish(scene, file) {
		scene.createAnimations("jellyfish");
		let y = scene.physics.world.bounds.height;
		let x = scene.physics.world.bounds.width;
		let startX =  Math.ceil(Math.random() * x);
		let startY =  Math.ceil(Math.random() * 500) + y;
		let jellyfishCloud = [];
		for(let i = 0; i < 10; i++){
			let addX = Math.ceil(Math.random() * 150)
			let addY = Math.ceil(Math.random() * 150)
			jellyfishCloud.push(new Jellyfish(scene, startX + addX, startY + addY, file).setScale(0.2).setVelocity(10, -50)) 
		}
		this.physics.add.overlap(scene.scubaDiver, jellyfishCloud, this.jellyBuzz, this.checkOverlappingJelly, scene)
		// scene.jellyfishs.add(jellyfishCloud);
		//add collition and collition effect
		console.log(scene.scubaDiver)
	}

	jellyBuzz(scubaDiver, jellyfish) {
		//make buzz happeing here!!
		jellyfish.setTint("0xfffff");
		scubaDiver.anims.play("scubaHit",true)
		console.log("got buzzed")
	}

	checkOverlappingJelly(scubaDiver, jellyfish) {
		const boundsJelly = jellyfish.getBounds();
		const boundsScuba = scubaDiver.getBounds();
		if ( !Phaser.Geom.Intersects.GetRectangleToRectangle(boundsJelly, boundsScuba).length < 1) {
			this.deactivateJelly(scubaDiver, jellyfish)
		}
	}
	
	async deactivateJelly(scubaDiver, jellyfish){
		await this.sleep(1000);
		jellyfish.clearTint();
		scubaDiver.anims.play("swim", true);
		console.log("deactivated.")
	}
	// helper function to add animation to avatars
	createScubaAnims(scuba){
		this.anims.create({
				key: "scubaHit",
				frames: this.anims.generateFrameNumbers(scuba, {
					start: 10,
					end: 14
				}),
				frameRate: 5,
				repeat: 5
			})
		this.anims.create({
			key: "swim",
			frames: this.anims.generateFrameNumbers(scuba, {
				start: 5,
				end: 9
			}),
			frameRate: 5,
			repeat: -1
		});
	}
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
				break;
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
				break;
			case "jellyfish":
				this.anims.create({
					key: "float",
					frames: this.anims.generateFrameNumbers(sprite, {
						start: 0,
						end: 2
					}),
					frameRate: 2,
					repeat: -1
				})
				break;
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
	createWaterPlant(scene, waterPlant, x, y, size=(.01, .008), angle = 0) {
		return scene.decorations
			.create(x, y, waterPlant)
			.setSize(size)
			.setAngle(angle)
			.refreshBody();
	}

	overlappingEffectsClam(scubaDiver, clam) {
		clam.setTint(0xcbc3e3);
		clam.setInteractive();
		clam.on("pointerdown", () => {
			this.scene.launch("Question", {
				clam: clam,
				scubaDiver: scubaDiver,
				level: this.state.level,
				socket: this.socket,
				key: this.state.key,
				score: this.score,
				click: this.click
			});
			//needed an error thrown/stop it
			throw new Error();
		});
	}

	overlappingEffectsShrimp(scubaDiver, shrimp) {
		shrimp.setTint(0xcbc3e3);
		shrimp.setInteractive();
		shrimp.on("pointerdown", () => {
			this.scene.launch("Facts", {
				socket: this.socket,
				shrimp: shrimp,
				level: this.state.level,
				scubaDiver: scubaDiver,
				score: this.score,
				key: this.state.key,
				click: this.click,
			});
			this.shrimpClick.play();
			throw new Error();
		});
	}

	checkOverlappingEffects(scene, scubaDiver, animal) {
		const boundsAnimal = animal.getBounds();
		const boundsScuba = scubaDiver.getBounds();
		if (
			!Phaser.Geom.Intersects.RectangleToRectangle(boundsAnimal, boundsScuba)
		) {
			scene.deactivateAnimal(animal);
		}
	}

	deactivateAnimal(animal) {
		animal.clearTint();
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

	friendsScores(playerFriends) {
		let y = 70;
		let scores = [];
		playerFriends.getChildren().forEach(friend => {
			scores.push(
				this.add
					.text(50, y, `${friend.avatar}: ${friend.score}`, {
						fill:
							friend.avatar === "scubaPurple"
								? "#A37CFD"
								: friend.avatar === "scubaGreen"
								? "#00FF00"
								: "#FFB1EE",
						fontSize: 20,
						fontStyle: "bold"
					})
					.setScrollFactor(0)
			);
			y += 20;
		});
			//using reduce from reacto
			let questionsLevel = [this.state.questionsLevel1, this.state.questionsLevel2, this.state.questionsLevel3, this.state.questionsLevel4, this.state.questionsLevel5][this.state.level - 1];


			// this.pearl = this.add.image(300, 115, "pearl").setScrollFactor(0);
			// this.pearl = this.add.image(350, 115, "pearl").setScrollFactor(0);
			// this.pearl = this.add.image(400, 115, "pearl").setScrollFactor(0);
			// this.pearl = this.add.image(450, 115, "pearl").setScrollFactor(0);
			// this.pearl = this.add.image(500, 115, "pearl").setScrollFactor(0);

			//            number of clams
			// let numClams = 5 - questionsLevel.reduce((acc, question) => {
			// 	if (question.isResolved){
			// 		acc++
			// 	}
			// 	return acc
			// }, 0);
			// if(numClams === 0) numClams = 5;
			// // scores.push(this.add.text(300, 100, `${Array(numClams).fill("clam")	}`).setScrollFactor(0))
			// scores.push(this.add.text(300, 100, `${Array(numClams).fill("clam")}`).setScrollFactor(0))
			// scores.push(this.add.image(300, 100, `${Array(numClams).fill("pearl")}`).setScrollFactor(0))

			 return scores;
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
		this.countdown = this.sound.add("countdown", { volume: 1 });
		this.click = this.sound.add("click", {
			volume: 0.5,
			loop: true,
			rate: 0.7
		}); //needs work with clam
		this.infoBubble = this.sound.add("infoBubble", { volume: 6 });
		this.nextLevel = this.sound.add("nextLevel", { volume: 9 });

		//launch the socket connection
		this.socket = io();
		//connect the socket connection to IntoScene
		this.scene.launch("IntroScene", {
			socket: this.socket
		});
		this.scene.launch("ChatScene", { socket: this.socket });

		let link;
		this.socket.on("gameCreated", gameKey => {
			link = this.addUrl(gameKey);
		});

		let waitingForHost, scores;

		this.socket.on("startedCountdown", async seconds => {
			if (waitingForHost) waitingForHost.destroy();

			this.scene.stop("Instructions");
			const currentTimer = this.add.text(400, 200, `${seconds}`, {
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

			this.scene.launch("Timer", {
				currentTime: new Date(),
				avatar: this.scubaDiver.avatar,
				socket: scene.socket,
				scubaDiver: scene.scubaDiver,
				playerFriends: scene.playerFriends
			});

			await this.sleep(1000);
			this.countdown.stop();
			currentTimer.destroy();
			this.score = this.add
				.text(50, 50, `${this.scubaDiver.avatar}: ${this.scubaDiver.score}`, {
					fill:
						this.scubaDiver.avatar === "scubaPurple"
							? "#A37CFD"
							: this.scubaDiver.avatar === "scubaGreen"
							? "#00FF00"
							: "#FFB1EE",
					fontSize: 20,
					fontStyle: "bold"
				})
				.setScrollFactor(0);
			scores = this.friendsScores(scene.playerFriends);

			//add clams and shrimps to game
			scene.state.questionsLevel1.forEach(question => {
				scene.createClam(scene, 1, question, "clam");
			});
			scene.state.factsLevel1.forEach(fact => {
				scene.createShrimp(scene, fact, "shrimp");
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

			//Volume
			this.volumeOn = this.add
				.image(700, 50, "volumeOn")
				.setScrollFactor(0)
				.setScale(0.09);
			this.volumeUp = this.add
				.image(750, 50, "volumeUp")
				.setScrollFactor(0)
				.setScale(0.07);
			this.volumeDown = this.add
				.image(650, 50, "volumeDown")
				.setScrollFactor(0)
				.setScale(0.07);

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
				"when yOu are ready tO plunge, click"
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

		//makes friends visibel
		scene.playerFriends = this.physics.add.group();
		scene.clamsLevel1 = this.physics.add.group();
		scene.clamsLevel2 = this.physics.add.group();
		scene.clamsLevel3 = this.physics.add.group();
		scene.clamsLevel4 = this.physics.add.group();
		scene.clamsLevel5 = this.physics.add.group();
		scene.shrimps = this.physics.add.group();
		//not solving the problem!

		//set world bounds
		this.physics.world.setBounds(0, 320, 1088, 1216);
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
		this.createRock(this, "rock-sand-1", 300, 900, 0.15);
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

		let depths = [1216, 2112, 3008, 3904];

		this.seaweed = [[], [], [], []];

		for (let level = 0; level < 4; level++) {
			for (let x = 0; x <= 1088; x += 70) {
				this.seaweed[level].push(
					this.createWaterPlant(
						this,
						"waterPlant",
						x, //x
						depths[level], //y
						this.size, //scale
						0, //angle
					)
				);
			}
		}

		this.physics.add.collider(
			this.playerGroup,
			this.decorations,
			function () {}
		);

		//create navigation and animation for scuba divers
		this.cursors = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.UP,
			down: Phaser.Input.Keyboard.KeyCodes.DOWN,
			left: Phaser.Input.Keyboard.KeyCodes.LEFT,
			right: Phaser.Input.Keyboard.KeyCodes.RIGHT
		});

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
				factsLevel5,
				count
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
					factsLevel5,
					count
				};
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
			chatContainer.classList.remove("chat-hidden");
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

		this.socket.on("someoneScored", ({ friend, question, level }) => {
			if (level === 1) {
				scene.clamsLevel1.getChildren().forEach(function (clam) {
					if (clam.info.question === question) {
						clam.info.isResolved = true;
						clam.destroy();
					}
				});
				scene.createJellyfish(scene, "jellyfish");
			}
			if (level === 2) {
				scene.clamsLevel2.getChildren().forEach(function (clam) {
					if (clam.info.question === question) {
						clam.info.isResolved = true;
						clam.setTint(0xcbc3e3);
						clam.destroy();
					}
				});
				scene.createJellyfish(scene, "jellyfish");
			}
			if (level === 3) {
				scene.clamsLevel3.getChildren().forEach(function (clam) {
					if (clam.info.question === question) {
						clam.info.isResolved = true;
						clam.setTint(0xcbc3e3);
						clam.destroy();
					}
				});
				scene.createJellyfish(scene, "jellyfish");
			}
			if (level === 4) {
				scene.clamsLevel4.getChildren().forEach(function (clam) {
					if (clam.info.question === question) {
						clam.info.isResolved = true;
						clam.setTint(0xcbc3e3);
						clam.destroy();
					}
				});
				scene.createJellyfish(scene, "jellyfish");
			}
			if (level === 5) {
				scene.clamsLevel5.getChildren().forEach(function (clam) {
					if (clam.info.question === question) {
						clam.info.isResolved = true;
						clam.setTint(0xcbc3e3);
						clam.destroy();
					}
				});
				scene.createJellyfish(scene, "jellyfish");
			}

			scores.forEach(score => {
				score.destroy();
			});
			scene.playerFriends.getChildren().forEach(function (playerFriend) {
				if (friend.playerId === playerFriend.playerId) {
					playerFriend.score = friend.score;
				}
			});
			scores = this.friendsScores(scene.playerFriends);
		});

		this.socket.on("nextLevel", level => {
			scene.state.level = level;
			this.nextLevel.play();

			this.scene.stop("Timer");

			this.scene.launch("Timer", {
				currentTime: new Date(),
				avatar: this.scubaDiver.avatar,
				socket: scene.socket,
				scubaDiver: scene.scubaDiver,
				playerFriends: scene.playerFriends
			});

			let seaweedLength = this.seaweed[0].length;
			if (scene.state.level === 2) {
				//all weeds for level
				scene.state.questionsLevel2.forEach(question => {
					scene.createClam(scene, 2, question, "clam");
				});
				scene.state.factsLevel2.forEach(fact => {
					scene.createShrimp(scene, fact, "shrimp");
				});
				this.seaweed[0]
					.slice(seaweedLength / 4, (seaweedLength / 4) * 3)
					.forEach(eachWeed => {
						eachWeed.destroy();
					});
				scene.physics.world.setBounds(0, 320, 1088, 2112);
			}
			if (scene.state.level === 3) {
				scene.state.questionsLevel3.forEach(question => {
					scene.createClam(scene, 3, question, "clam");
				});
				scene.state.factsLevel3.forEach(fact => {
					scene.createShrimp(scene, fact, "shrimp");
				});
				this.seaweed[1]
					.slice(seaweedLength / 4, (seaweedLength / 4) * 3)
					.forEach(eachWeed => {
						eachWeed.destroy();
					});
				scene.physics.world.setBounds(0, 320, 1088, 3008);
			}
			if (scene.state.level === 4) {
				scene.state.questionsLevel4.forEach(question => {
					scene.createClam(scene, 4, question, "clam");
				});
				scene.state.factsLevel4.forEach(fact => {
					scene.createShrimp(scene, fact, "shrimp");
				});
				this.seaweed[2]
					.slice(seaweedLength / 4, (seaweedLength / 4) * 3)
					.forEach(eachWeed => {
						eachWeed.destroy();
					});
				scene.physics.world.setBounds(0, 320, 1088, 3904);
			}
			if (scene.state.level === 5) {
				scene.state.questionsLevel5.forEach(question => {
					scene.createClam(scene, 5, question, "clam");
				});
				scene.state.factsLevel5.forEach(fact => {
					scene.createShrimp(scene, fact, "shrimp");
				});
				this.seaweed[3]
					.slice(seaweedLength / 4, (seaweedLength / 4) * 3)
					.forEach(eachWeed => {
						eachWeed.destroy();
					});
				scene.physics.world.setBounds(0, 320, 1088, 4800);
			}

			if (scene.state.level === 6) {
				scene.scene.launch("WinScene", { scubaDiver: scene.scubaDiver, playerFriends: scene.playerFriends });
			}
		});

		this.socket.on("disconnected", function ({ playerId, numPlayers }) {
			scene.state.numPlayers = numPlayers;
			scene.playerFriends.getChildren().forEach(function (friend) {
				if (playerId === friend.playerId) {
					friend.destroy();
				}
			});
			if (numPlayers < 2) {
				chatContainer.classList.add("chat-hidden");
			}
		});
	}

	update() {
		//updates overlap for every frame
		const scene = this;
		//update the movement
		if (this.scubaDiver) {
			this.scubaDiver.update(this.cursors);

			[
				this.clamsLevel1,
				this.clamsLevel2,
				this.clamsLevel3,
				this.clamsLevel4,
				this.clamsLevel5
			].forEach(clamsLevel => {
				clamsLevel.getChildren().forEach(clam => {
					this.physics.add.overlap(
						this.scubaDiver,
						clam,
						scene.overlappingEffectsClam,
						null,
						scene
					);
					scene.checkOverlappingEffects(scene, this.scubaDiver, clam);
				});
			});

			this.shrimps.getChildren().forEach(shrimp => {
				this.physics.add.overlap(
					this.scubaDiver,
					shrimp,
					scene.overlappingEffectsShrimp,
					null,
					scene
				);
				scene.checkOverlappingEffects(scene, this.scubaDiver, shrimp);
			});
		}

	}
}
