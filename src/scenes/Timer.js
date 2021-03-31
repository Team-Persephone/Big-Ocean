import Phaser from "phaser";

export default class Timer extends Phaser.Scene {
	constructor() {
		super("Timer");
	}

	init(data) {
		this.currentTime = data.currentTime;
	}
	preload() {}
	create() {
		console.log(this.currentTime);

		this.timeOnPause = this.currentTime;

		document.addEventListener("visibilitychange", () => {
			if (document.hidden) {
				this.scene.pause();
			} else {
				this.scene.resume();
			}
		});
    // 120
		this.initialTime = 20 - Math.floor((new Date() - this.timeOnPause) / 1000);

		this.text = this.add.text(
			32,
			32,
			"Countdown: " + formatTime(this.initialTime)
		);

		// Each 1000 ms call onEvent
		this.timedEvent = this.time.addEvent({
			delay: 1000,
			callback: onEvent,
			callbackScope: this,
			loop: true
		});

		this.events.on("resume", () => {

      const elapsedTime = Math.floor((new Date() - this.timeOnPause) / 1000);

			this.initialTime -= elapsedTime;

		});

		function formatTime(seconds) {
			// Minutes
			const minutes = Math.floor(seconds / 60);
			// Seconds
			let partInSeconds = seconds % 60;
			// Adds left zeros to seconds
			partInSeconds = partInSeconds.toString().padStart(2, "0");
			// Returns formated time
			return `${minutes}:${partInSeconds}`;
		}

		function onEvent() {
      this.timeOnPause = new Date();
      this.initialTime -= 1; // One second
      if(this.initialTime < 0) {
        //LAUNCH LOSER SCENE HERE
        this.text.setText("Game over");
        this.timedEvent.paused = true
      } else {
        this.text.setText("Countdown: " + formatTime(this.initialTime));
      }
		}
	}
	update() {
		// this.graphics.clear();
		// drawClock(400, 300, timerEvent);
	}
}
