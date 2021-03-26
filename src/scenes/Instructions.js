import Phaser from "phaser";

export default class Instructions extends Phaser.Scene {
  constructor() {
    super("Instructions");
  }

  init(data) {
		this.showReturnText = data.showReturnText;
	}

  preload() {

  }

  async create() {
    const scene = this;

    scene.add.text(275, 10, "instructiOns", {
      fill: "#00ff00",
      backgroundColor: "#1abeff",
      fontSize: "34px",
      fontStyle: "bold",
    });

    scene.returnText = scene.add.text(650, 270, "gO back", {
      fill: "#ffffff",
      fontSize: "17px",
      fontStyle: "bold",
    });

    scene.returnText.visible = false;
    if (this.showReturnText) scene.returnText.visible = true;

    scene.returnText.setInteractive();

    scene.returnText.on("pointerover", () => {
      scene.returnText.setStyle({ fill: '#0f0'});
    });
    scene.returnText.on("pointerout", () => {
      scene.returnText.setStyle({ fill: '#fff'});
    });

    scene.returnText.on("pointerdown", () => {
      scene.scene.stop("Instructions");
    });


    scene.add.text(
      50,
      50,
      "\n\n1. navigate yOur surrOundings + lOcate preciOus clams, whOse pearls cOntain ancient queries On big-O nOtatiOn. \n\n \n 2. dOn’t fOrget tO keep an eye On the clOck. \n \n 3. need help? apprOach a shrimp fOr a hint. \n \n 4. finish with the mOst pOints, and win the title of “mighty O.” \n \n 5. ready tO play? click the buttOn belOw tO cOntinue.\n \n ",
      {
        fill: "#00ff00",
        backgroundColor: "#1abeff",
        fontSize: "17px",
        fontStyle: "bold",
        align: "left",
        wordWrap: { width: 700, height: 445, useAdvancedWrap: true },
      }
    );
  }
}
