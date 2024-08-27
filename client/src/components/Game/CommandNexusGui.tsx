import * as GUI from "@babylonjs/gui";
import { Scene } from '@babylonjs/core';
import { Ability, UnitType,unitAbilities } from "../../utils/types";


class CommandNexusGui {
    private gui: GUI.AdvancedDynamicTexture;
    private mainMenuPanel: GUI.Rectangle;
    private unitsPanel: GUI.Rectangle;
    private marketplacePanel: GUI.Rectangle;
    private actionsPanel: GUI.Rectangle;
    private turnInfoText: GUI.TextBlock;
    private selectedUnitId: number | null = null;

    // Color scheme
    private readonly PANEL_COLOR = "rgba(0, 20, 0, 0.9)";
    private readonly BUTTON_COLOR = "rgba(0, 40, 0, 0.8)";
    private readonly HIGHLIGHT_COLOR = "rgba(0, 80, 0, 0.9)";
    private readonly TEXT_COLOR = "rgba(0, 255, 0, 0.9)";

    constructor(scene: Scene) {
        this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
        this.createTopBar();
        this.createMainMenuButton();
        this.createMainMenuPanel();
        this.createUnitsPanel();
        this.createMarketplacePanel();
        this.createActionsPanel();
    }

    private createButton(name: string, text: string): GUI.Button {
        const button = GUI.Button.CreateSimpleButton(name, text);
        button.width = "150px";
        button.height = "40px";
        button.color = this.TEXT_COLOR;
        button.background = this.BUTTON_COLOR;
        button.hoverCursor = "pointer";
        return button;
    }

    private createPanel(width: string, height: string): GUI.Rectangle {
        const panel = new GUI.Rectangle();
        panel.width = width;
        panel.height = height;
        panel.cornerRadius = 10;
        panel.color = this.TEXT_COLOR;
        panel.thickness = 2;
        panel.background = this.PANEL_COLOR;
        panel.isVisible = false;
        return panel;
    }

    private createTopBar(): void {
        const topBar = this.createPanel("100%", "50px");
        topBar.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        topBar.isVisible = true;
        this.gui.addControl(topBar);

        this.turnInfoText = new GUI.TextBlock();
        this.turnInfoText.text = "Turn 1 - Player Phase";
        this.turnInfoText.color = this.TEXT_COLOR;
        this.turnInfoText.fontSize = 20;
        topBar.addControl(this.turnInfoText);

        const endTurnBtn = this.createButton("endTurn", "End Turn");
        endTurnBtn.width = "120px";
        endTurnBtn.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        endTurnBtn.left = "-10px";
        endTurnBtn.onPointerUpObservable.add(() => {
            console.log("End Turn clicked");
            // Add your end turn logic here
        });
        topBar.addControl(endTurnBtn);
    }

    private createMainMenuButton(): void {
        const mainMenuBtn = this.createButton("mainMenu", "Main Menu");
        mainMenuBtn.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        mainMenuBtn.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        mainMenuBtn.left = "10px";
        mainMenuBtn.top = "60px";
        mainMenuBtn.onPointerUpObservable.add(() => {
            this.toggleMainMenuPanel();
        });
        this.gui.addControl(mainMenuBtn);
    }

    private createMainMenuPanel(): void {
        this.mainMenuPanel = this.createPanel("200px", "200px");
        this.mainMenuPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.mainMenuPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.mainMenuPanel.top = "110px";
        this.mainMenuPanel.left = "10px";
        this.gui.addControl(this.mainMenuPanel);
    
        // Create a StackPanel to hold the buttons
        const stackPanel = new GUI.StackPanel();
        stackPanel.paddingTop = 2;
        stackPanel.width = "100%";
        stackPanel.height = "100%";
        this.mainMenuPanel.addControl(stackPanel);
    
        const unitsBtn = this.createButton("units", "Units");
        unitsBtn.height = "40px";
        unitsBtn.width = "180px";
        unitsBtn.onPointerUpObservable.add(() => this.toggleUnitsPanel());
        stackPanel.addControl(unitsBtn);
    
        // Add some space between buttons
        const spacing = new GUI.Rectangle();
        spacing.height = "10px";
        spacing.width = "1px";
        spacing.thickness = 0;
        stackPanel.addControl(spacing);
    
        const marketplaceBtn = this.createButton("marketplace", "Marketplace");
        marketplaceBtn.height = "40px";
        marketplaceBtn.width = "180px";
        marketplaceBtn.onPointerUpObservable.add(() => this.toggleMarketplacePanel());
        stackPanel.addControl(marketplaceBtn);
    }

    private createUnitsPanel(): void {
        this.unitsPanel = this.createPanel("400px", "600px");
        this.unitsPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this.unitsPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.unitsPanel.left = "10px";
        this.gui.addControl(this.unitsPanel);

        const header = new GUI.TextBlock();
        header.text = "Units";
        header.height = "40px";
        header.color = this.TEXT_COLOR;
        header.fontSize = 24;
        this.unitsPanel.addControl(header);

        // Add more units info here
    }

    private createMarketplacePanel(): void {
        this.marketplacePanel = this.createPanel("400px", "600px");
        this.marketplacePanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this.marketplacePanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.marketplacePanel.left = "10px";
        this.gui.addControl(this.marketplacePanel);

        const header = new GUI.TextBlock();
        header.text = "Marketplace";
        header.height = "40px";
        header.color = this.TEXT_COLOR;
        header.fontSize = 24;
        this.marketplacePanel.addControl(header);

        // Add more marketplace info here
    }

    // private createActionsPanel(): void {
    //     this.actionsPanel = this.createPanel("600px", "60px");
    //     this.actionsPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    //     this.actionsPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    //     this.actionsPanel.top = "-10px";
    //     this.actionsPanel.isVisible = true;
    //     this.gui.addControl(this.actionsPanel);

    //     const actions = ["Move", "Attack", "Overwatch", "Reload", "Special"];
    //     actions.forEach((action, index) => {
    //         const button = this.createButton(action, action);
    //         button.width = "110px";
    //         button.left = (index - 2) * 120 + "px";  // Center the buttons
    //         this.actionsPanel.addControl(button);
    //     });
    // }
    private createActionsPanel(): void {
        this.actionsPanel = this.createPanel("600px", "60px");
        this.actionsPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.actionsPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.actionsPanel.top = "-10px";
        this.actionsPanel.isVisible = false;
        this.gui.addControl(this.actionsPanel);
    }

    public selectUnit(unitId: number, unitType: UnitType): void {
        this.selectedUnitId = unitId;
        this.updateActionsPanel(unitType);
    }

    private updateActionsPanel(unitType: UnitType): void {
        if (this.selectedUnitId === null) {
            this.actionsPanel.isVisible = false;
            return;
        }

        // Clear existing buttons
        this.actionsPanel.clearControls();

        // Get available abilities for the unit type
        const abilities = unitAbilities[unitType];

        // Create a button for each available ability
        abilities.forEach((ability: Ability, index: number) => {
            const button = GUI.Button.CreateSimpleButton(`${ability}Button`, Ability[ability]);
            button.width = "110px";
            button.height = "40px";
            button.color = "white";
            button.background = "green";
            button.onPointerUpObservable.add(() => {
                this.useAbility(ability);
            });
            button.left = (index - (abilities.length - 1) / 2) * 120 + "px";  // Center the buttons
            this.actionsPanel.addControl(button);
        });

        this.actionsPanel.isVisible = true;
    }

    private useAbility(ability: Ability): void {
        if (this.selectedUnitId === null) return;

        console.log(`Using ability ${Ability[ability]} for unit ${this.selectedUnitId}`);
        // Here you would typically update game state, animate the action, etc.
    }
    
    private toggleMainMenuPanel(): void {
        this.mainMenuPanel.isVisible = !this.mainMenuPanel.isVisible;
        if (!this.mainMenuPanel.isVisible) {
            this.unitsPanel.isVisible = false;
            this.marketplacePanel.isVisible = false;
        }
    }

    private toggleUnitsPanel(): void {
        this.unitsPanel.isVisible = !this.unitsPanel.isVisible;
        this.marketplacePanel.isVisible = false;
    }

    private toggleMarketplacePanel(): void {
        this.marketplacePanel.isVisible = !this.marketplacePanel.isVisible;
        this.unitsPanel.isVisible = false;
    }

    public updateTurnInfo(text: string): void {
        this.turnInfoText.text = text;
    }
}

export default CommandNexusGui;