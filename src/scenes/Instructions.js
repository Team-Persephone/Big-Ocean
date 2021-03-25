import Phaser from "phaser";

export default class Instructions extends Phaser.Scene {
  constructor() {
    super("Instructions");
  }

  preload() {
    this.load.image("blue", "assets/backgrounds/babyGotBlue.png");
    // this.load.image("dark", "assets/dark.png");
  }

  async create() {
    const scene = this;

    scene.graphics = scene.add.image(400, 300, "blue");

    scene.add.text(125, 83, "Instructions", {
      fill: "#00ff00",
      fontSize: "34px",
      fontStyle: "bold",
    });

    scene.returnText = scene.add.text(148, 494, "Go Back", {
      fill: "#000000",
      fontSize: "15px",
      fontStyle: "bold",
    });

    scene.returnText.setInteractive();
    scene.returnText.on("pointerover", () => {
    });
    scene.returnText.on("pointerout", () => {
    });
    scene.returnText.on("pointerdown", () => {
      scene.scene.stop("Instructions");
    });


    scene.add.text(
      155,
      140,
      "1. navigate yOur surrOundings + lOcate preciOus clams, whOse pearls cOntain ancient queries On big-O nOtatiOn.  \n\nanswer cOrrectly + be awarded the pearl. \n\n\n\n-Walk up to the red highlighted item. \n\n\n-answer incOrrectly, + be fOrced back tO the Ocean surface, faced with the lOnely sOjOurn back dOwn.",
      {
        fill: "#00ff00",
        fontSize: "15px",
        fontStyle: "bold",
        align: "left",
        wordWrap: { width: 240, height: 445, useAdvancedWrap: true },
      }
    );
  }
}
