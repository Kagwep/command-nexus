import * as GUI from "@babylonjs/gui";
import { Scene } from '@babylonjs/core';
import { Ability, UnitType,unitAbilities } from "../../utils/types";


class CommandNexusGui {
    private gui: GUI.AdvancedDynamicTexture;
    private mainMenuPanel: GUI.Rectangle;
    private unitsPanel: GUI.Rectangle;
    private marketplacePanel: GUI.Rectangle;
    private actionsPanel: GUI.Rectangle;
    private playerPanel : GUI.Rectangle;
    private turnInfoText: GUI.TextBlock;
    private selectedUnitId: number | null = null;
    private ACCENT_COLOR = "#4CAF50";
    public player = {};

    // Color scheme
    private readonly PANEL_COLOR = "rgba(0, 20, 0, 0.9)";
    private readonly BUTTON_COLOR = "rgba(0, 40, 0, 0.8)";
    private readonly HIGHLIGHT_COLOR = "rgba(0, 80, 0, 0.9)";
    private readonly TEXT_COLOR = "rgba(0, 255, 0, 0.9)";
    private currentY: number = -250;

    private infoRows: Map<string, GUI.TextBlock> = new Map();
    private unitRows: Map<string, GUI.TextBlock> = new Map();
    private scoreRows: Map<string, GUI.TextBlock> = new Map();
    private supplyRows: Map<string, GUI.TextBlock> = new Map();
    constructor(scene: Scene) {
        this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
        this.createTopBar();
        this.createMainMenuButton();
        this.createMainMenuPanel();
        this.createUnitsPanel();
        this.createMarketplacePanel();
        this.createActionsPanel();
        this.createPlayerPanel();
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

        const playerBtn = this.createButton("player", "Player");
        playerBtn.height = "40px";
        playerBtn.width = "180px";
        playerBtn.onPointerUpObservable.add(() => this.togglePlayerPanel());
        stackPanel.addControl(playerBtn);
    
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

    private createPlayerPanel(): void {
        this.playerPanel = this.createPanel("400px", "600px");
        this.playerPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this.playerPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.playerPanel.left = "10px";
        this.gui.addControl(this.playerPanel);

        this.addPlayerInfoSection();
        this.addDivider(20);
        this.addPlayerScoreSection();
        this.addDivider(260);
        this.addSupplySection();
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
            this.playerPanel.isVisible = false;
        }
    }

    private toggleUnitsPanel(): void {
        this.unitsPanel.isVisible = !this.unitsPanel.isVisible;
        this.marketplacePanel.isVisible = false;
        this.playerPanel.isVisible = false;
    }

    private togglePlayerPanel(): void {
        this.playerPanel.isVisible = !this.playerPanel.isVisible;
        this.marketplacePanel.isVisible = false;
        this.unitsPanel.isVisible = false;
    }

    private toggleMarketplacePanel(): void {
        this.marketplacePanel.isVisible = !this.marketplacePanel.isVisible;
        this.unitsPanel.isVisible = false;
        this.playerPanel.isVisible = false;
    }

    public updateTurnInfo(text: string): void {
        this.turnInfoText.text = text;
    }

    private addPlayerInfoSection(): void {
        const infoSection = new GUI.Rectangle();
        infoSection.width = "380px";
        infoSection.height = "150px";
        infoSection.top = "-200px";
        // infoSection.left = "10px";
        infoSection.cornerRadius = 5;
        infoSection.color = this.ACCENT_COLOR;
        infoSection.thickness = 2;
        infoSection.background = "rgba(0, 0, 0, 0.3)";
        this.playerPanel.addControl(infoSection);

        const header = this.createHeader("Player Info", "20px", "10px");
        infoSection.addControl(header);

        const fields = ["Name", "Address", "Game ID", "Home Base", "Index", "Last Action"];
        fields.forEach((field, index) => {
            const row = index % 2 === 0 ? 0 : 1;
            const column = Math.floor(index / 2);
            this.addInfoField(field, infoSection, row, column);
        });
    }

    private addPlayerScoreSection(): void {
        const scoreSection = new GUI.Rectangle();
        scoreSection.width = "380px";
        scoreSection.height = "120px";
        scoreSection.top = "-50px";
        //scoreSection.left = "10px";
        scoreSection.cornerRadius = 5;
        scoreSection.color = this.ACCENT_COLOR;
        scoreSection.thickness = 2;
        scoreSection.background = "rgba(0, 0, 0, 0.3)";
        this.playerPanel.addControl(scoreSection);

        //const header = this.createHeader("Player Score", "20px", "10px");
       // scoreSection.addControl(header);

        const scorePanel = new GUI.StackPanel();
        scorePanel.width = "360px";
        scorePanel.height = "80px";
        scorePanel.top = "40px";
        scorePanel.left = "10px";
        scorePanel.isVertical = false;
        scoreSection.addControl(scorePanel);

        const fields = ["Assists", "Deaths", "Kills", "Score"];
        fields.forEach(field => this.addScoreField(field, scorePanel));
    }

    private addSupplySection(): void {
        const supplySection = new GUI.Rectangle();
        supplySection.width = "380px";
        supplySection.height = "200px";
        supplySection.top = "150px";
       // supplySection.left = "10px";
        supplySection.cornerRadius = 5;
        supplySection.color = this.ACCENT_COLOR;
        supplySection.thickness = 2;
        supplySection.background = "rgba(0, 0, 0, 0.3)";
        this.playerPanel.addControl(supplySection);

        //const header = this.createHeader("Supply", "20px", "10px");
        //supplySection.addControl(header);

        const units = ["Air", "Armored", "Cyber", "Infantry", "Naval"];
        units.forEach((unit, index) => this.addSupplyRow(unit, supplySection, index));
    }

    private createHeader(text: string, top: string, left: string): GUI.TextBlock {
        const header = new GUI.TextBlock();
        header.text = text;
        header.color = this.ACCENT_COLOR;
        header.fontSize = 24;
        header.height = "30px";
        header.top = `${this.currentY}px`;
        header.left = left;
        header.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        return header;
    }

    private addInfoField(label: string, parent: GUI.Container, row: number, column: number): void {
        const field = new GUI.StackPanel();
        field.width = "180px";
        field.height = "50px";
        field.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        field.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        field.top = `${row * 33}%`;
        field.left = `${column * 50}%`;
        field.isVertical = false;
        parent.addControl(field);
    
        const labelText = new GUI.TextBlock();
        labelText.text = label + ":";
        labelText.color = this.TEXT_COLOR;
        labelText.fontSize = 14;
        labelText.width = "80px";
        labelText.height = "20px";
        labelText.paddingLeft =2;
        labelText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        field.addControl(labelText);
    
        const valueText = new GUI.TextBlock();
        valueText.color = this.ACCENT_COLOR;
        valueText.fontSize = 16;
        valueText.width = "100px";
        valueText.height = "20px";
        valueText.text = "";
        valueText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        field.addControl(valueText);
    
        this.infoRows.set(label.toLowerCase(), valueText);
    }

    private addScoreField(label: string, parent: GUI.Container): void {
        const field = new GUI.StackPanel();
        field.width = "90px";
        field.height = "80px";
        field.isVertical = true;
        parent.addControl(field);

        const labelText = new GUI.TextBlock();
        labelText.text = label;
        labelText.color = this.TEXT_COLOR;
        labelText.fontSize = 14;
        labelText.height = "20px";
        field.addControl(labelText);

        console.log(this.player);

        console.log(this.player["player_score"]);

        const valueText = new GUI.TextBlock();
        valueText.color = this.ACCENT_COLOR;
        valueText.fontSize = 24;
        valueText.height = "60px";
        valueText.text = this.player["player_score"][label.toLowerCase()] ? this.player["player_score"][label.toLowerCase()] : "";
        field.addControl(valueText);

        this.scoreRows.set(label, valueText);
    }

    private addSupplyRow(unitType: string, parent: GUI.Container, index: number): void {
        const row = new GUI.StackPanel();
        row.width = "360px";
        row.height = "40px";
       row.top = `${-40 + index * 30}px`;
        row.left = "10px";
        row.isVertical = false;
        parent.addControl(row);

        const unitImage = new GUI.Image("unitImage-" + unitType, this.getUnitImageUrl(unitType));
        unitImage.width = "30px";
        unitImage.height = "30px";
        row.addControl(unitImage);

        const unitName = new GUI.TextBlock();
        unitName.text = unitType;
        unitName.color = this.TEXT_COLOR;
        unitName.fontSize = 16;
        unitName.width = "100px";
        unitName.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        unitName.left = "10px";
        row.addControl(unitName);

        const unitValue = new GUI.TextBlock();
        unitValue.color = this.ACCENT_COLOR;
        unitValue.fontSize = 18;
        unitValue.width = "220px";
        unitValue.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        row.addControl(unitValue);

        this.supplyRows.set(unitType, unitValue);
    }

    private addDivider(top: number): void {
        const divider = new GUI.Rectangle();
        divider.width = "360px";
        divider.height = "2px";
        divider.top = `${top}px`;
        // divider.left = "20px";
        divider.color = this.ACCENT_COLOR;
        this.playerPanel.addControl(divider);
    }

    private getUnitImageUrl(unitType: string): string {
        // This method can be updated later to return real image URLs
        // For now, it returns a placeholder or a default image URL
        switch (unitType.toLowerCase()) {
            case 'air':
                return '/logo.png';
            case 'armored':
                return '/path/to/armored-unit-image.png';
            case 'cyber':
                return '/path/to/cyber-unit-image.png';
            case 'infantry':
                return '/path/to/infantry-unit-image.png';
            case 'naval':
                return '/path/to/naval-unit-image.png';
            default:
                return '/path/to/default-unit-image.png';
        }
    }

    public updatePlayerInfo(playerData: any): void {
        console.log(playerData)
        console.log(this.infoRows);
        this.player = playerData;
        Object.entries(playerData).forEach(([key, value]) => {
            console.log(this.infoRows.has(key))
            if (this.infoRows.has(key)) {
                this.infoRows.get(key)!.text = value.toString();
                console.log("updated")
            }
        });

        if (playerData.player_score) {
            Object.entries(playerData.player_score).forEach(([key, value]) => {
                console.log(key)
                if (this.scoreRows.has(key)) {
                    this.scoreRows.get(key)!.text = value.toString();
                }
            });
        }

        if (playerData.supply) {
            Object.entries(playerData.supply).forEach(([key, value]) => {
                if (this.supplyRows.has(key)) {
                    this.supplyRows.get(key)!.text = value.toString();
                }
            });
        }
    }
}

export default CommandNexusGui;