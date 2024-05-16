import { Scene } from '@babylonjs/core';
import { AdvancedDynamicTexture, CheckboxGroup, Control, Grid, RadioGroup, SelectionPanel, SliderGroup, Image, TextBlock, Button, Rectangle, StackPanel } from '@babylonjs/gui/2D';


export class GUI {
    private scene: Scene;
    private advancedTexture: AdvancedDynamicTexture;
    

    constructor(scene: Scene) {
        this.scene = scene;
        this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

  
        this.createSidePanel();
        this.createRightPanel();
        this.createBottomMenu();
    }


    createSidePanel() {
        const sidePanel = new StackPanel();
        sidePanel.width = "150px";
        sidePanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        sidePanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.advancedTexture.addControl(sidePanel);

        const units = ["Tanks", "Infantry", "Snipers", "Artillery", "Drones", "Helicopters", "Special Forces", "Naval Ships"];

        units.forEach(unit => {
            const container = new Rectangle();
            container.width = "50px";
            container.height = "60px"; // Increased height to accommodate the image and the button
            container.thickness = 0;
            container.paddingBottom = "10px";
            sidePanel.addControl(container);

            // Create an image placeholder
            const image = new Image(`${unit}_img`, "https://hambre.infura-ipfs.io/ipfs/QmR8ZXT5ka5wpY8ub8R1mQTLtb89Fxe9AEDdu5LR57jPp6");
            image.width = "40px";
            image.height = "40px";
            image.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
            container.addControl(image);

            // Create a button
            const button = Button.CreateSimpleButton(unit, unit);
            button.width = "50px";
            button.height = "20px";
            button.color = "rgb(6, 26, 7)";
            button.fontWeight = "bold"
            button.fontSize = "10px";
            button.background = "white";
            button.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            container.addControl(button);
        });
    }

    createRightPanel() {
        const rightPanel = new StackPanel();
        rightPanel.width = 0.20;
        rightPanel.height = 0.40;
        rightPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        rightPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.advancedTexture.addControl(rightPanel);

        const playerStats = ["Total Strength: 12345", "Captured Assets: 5", "Resources: 1000 Gold", "Banners: 16 NFTs"];
        playerStats.forEach(stat => {
            const textBlock = new TextBlock();
            textBlock.text = stat;
            textBlock.color = "white";
            textBlock.height = "30px";
            rightPanel.addControl(textBlock);
        });

        // Similar panel for opponent's stats
        const opponentStats = ["Opponent Strength: 9876", "Captured Assets: 3", "Resources: 800 Gold"];
        opponentStats.forEach(stat => {
            const textBlock = new TextBlock();
            textBlock.text = stat;
            textBlock.color = "white";
            textBlock.height = "30px";
            rightPanel.addControl(textBlock);
        });
    }

    createBottomMenu() {
        const bottomMenu = new StackPanel();
        bottomMenu.width = "100%";
        bottomMenu.height = "50px";
        bottomMenu.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        bottomMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        bottomMenu.isVertical = false;
        this.advancedTexture.addControl(bottomMenu);

        const menuItems = ["Map", "Army", "Assets", "Leaderboard"];
        menuItems.forEach(item => {
            const button = Button.CreateSimpleButton(item, item);
            button.width = "100px";
            button.height = "50px";
            button.color = "white";
            button.background = "black";
            bottomMenu.addControl(button);
        });
    }
}
