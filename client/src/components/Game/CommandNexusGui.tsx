import * as GUI from "@babylonjs/gui";
import { Scene, Vector3 } from '@babylonjs/core';
import { Ability, UnitType,unitAbilities } from "../../utils/types";


export default class CommandNexusGui {
    private gui: GUI.AdvancedDynamicTexture;
    private mainMenuPanel: GUI.Rectangle;
    private unitsPanel: GUI.Rectangle;
    private marketplacePanel: GUI.Rectangle;
    private actionsPanel: GUI.Rectangle;
    private playerPanel : GUI.Rectangle;
    private opponentsPanel : GUI.Rectangle;
    private turnInfoText: GUI.TextBlock;
    private selectedUnitId: number | null = null;
    private ACCENT_COLOR = "#4CAF50";
    public player = {};

    private deployButton: GUI.Ellipse;
    private isDeploymentMode: boolean = false;
    private selectedUnit: string | null = null;
    private unitSelectionPanel: GUI.Rectangle;
    private closeButton: GUI.Button;



    // Color scheme
    private readonly PANEL_COLOR = "rgba(0, 40, 20, 0.8)";
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
        this.createOpponentsPanel();

        this.createDeployButton();
        this.createUnitSelectionPanel();
    }

    private createButton(name: string, text: string): GUI.Button {
        const button = GUI.Button.CreateSimpleButton(name, text);
        button.width = "150px";
        button.height = "40px";
        button.color = this.TEXT_COLOR;
        button.background = this.BUTTON_COLOR;
        button.hoverCursor = "pointer";
        button.width = "200px";
        button.height = "50px";
        button.color = "white";
        button.cornerRadius = 5;
        button.background = "rgba(0, 80, 40, 0.9)";
        button.hoverCursor = "pointer";
        button.thickness = 0;
        button.fontFamily = "Arial, Helvetica, sans-serif";
        button.fontSize = 16;
        // Add hover effect
        button.onPointerEnterObservable.add(() => {
            button.background = "rgba(0, 100, 50, 1)";
        });
        button.onPointerOutObservable.add(() => {
            button.background = "rgba(0, 80, 40, 0.9)";
        });
        return button;
    }

    private createPanel(width: string, height: string): GUI.Rectangle {
        const panel = new GUI.Rectangle();
        panel.width = width;
        panel.height = height;
        panel.cornerRadius = 10;
        panel.color = this.TEXT_COLOR;
        panel.thickness = 0;
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
        endTurnBtn.cornerRadius = 5;
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

        const opponentsBtn = this.createButton("opponents", "Opponents");
        opponentsBtn.height = "40px";
        opponentsBtn.width = "180px";
        opponentsBtn.onPointerUpObservable.add(() => this.toggleOpponentsPanel());
        stackPanel.addControl(opponentsBtn);
    
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

        // Add cancel button
        const cancelButton = GUI.Button.CreateSimpleButton("cancelButton", "X");
        cancelButton.width = "15px";
        cancelButton.height = "15px";
        cancelButton.color = "white";
        cancelButton.cornerRadius = 15;
        cancelButton.background = "green";
        cancelButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        cancelButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        cancelButton.top = "5px";
        cancelButton.left = "-5px";
        cancelButton.onPointerUpObservable.add(() => {
            this.playerPanel.isVisible = false;
        });

        this.playerPanel.addControl(cancelButton);

        // Add cancel button
        const leaveButton = GUI.Button.CreateSimpleButton("leaveButton", "Leave");
        leaveButton.paddingTop = "1px"
        leaveButton.paddingBottom = "10px"
        leaveButton.background = "red";
        leaveButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        leaveButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        leaveButton.top = "5px";
        leaveButton.left = "-5px";
        leaveButton.hoverCursor = "pointer";
        leaveButton.width = "200px";
        leaveButton.height = "40px";
        leaveButton.color = "white";
        leaveButton.cornerRadius = 5;
        leaveButton.hoverCursor = "pointer";
        leaveButton.thickness = 0;
        leaveButton.fontFamily = "Arial, Helvetica, sans-serif";
        leaveButton.fontSize = 16;
        // Add hover effect
        leaveButton.onPointerEnterObservable.add(() => {
            leaveButton.background = "rgba(180, 100, 50, 1)";
        });
        leaveButton.onPointerOutObservable.add(() => {
            leaveButton.background = "rgba(255, 80, 40, 0.9)";
        });
        leaveButton.onPointerUpObservable.add(() => {
            this.opponentsPanel.isVisible = false;
        });
        this.playerPanel.addControl(leaveButton);
        
    }

    private createOpponentsPanel(): void {
        this.opponentsPanel = this.createPanel("600px", "600px");
        this.opponentsPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this.opponentsPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.opponentsPanel.left = "10px";
        this.gui.addControl(this.opponentsPanel);


        // Add cancel button
        const cancelButton = GUI.Button.CreateSimpleButton("cancelButton", "X");
        cancelButton.width = "15px";
        cancelButton.height = "15px";
        cancelButton.color = "white";
        cancelButton.cornerRadius = 15;
        cancelButton.background = "green";
        cancelButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        cancelButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        cancelButton.top = "5px";
        cancelButton.left = "-5px";
        cancelButton.onPointerUpObservable.add(() => {
            this.opponentsPanel.isVisible = false;
        });

        this.opponentsPanel.addControl(cancelButton);
        
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
            this.opponentsPanel.isVisible = false;
        }
    }

    private toggleUnitsPanel(): void {
        this.unitsPanel.isVisible = !this.unitsPanel.isVisible;
        this.marketplacePanel.isVisible = false;
        this.playerPanel.isVisible = false;
        this.opponentsPanel.isVisible = false;
    }

    private togglePlayerPanel(): void {
        this.playerPanel.isVisible = !this.playerPanel.isVisible;
        this.marketplacePanel.isVisible = false;
        this.unitsPanel.isVisible = false;
        this.opponentsPanel.isVisible = false;
    }

    private toggleOpponentsPanel(): void {
        this.opponentsPanel.isVisible = !this.opponentsPanel.isVisible;
        this.marketplacePanel.isVisible = false;
        this.unitsPanel.isVisible = false;
        this.playerPanel.isVisible = false;
    }

    private toggleMarketplacePanel(): void {
        this.marketplacePanel.isVisible = !this.marketplacePanel.isVisible;
        this.unitsPanel.isVisible = false;
        this.playerPanel.isVisible = false;
        this.opponentsPanel.isVisible = false;
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
        infoSection.thickness = 0;
        infoSection.background = this.PANEL_COLOR;
        this.playerPanel.addControl(infoSection);

        const header = this.createHeader("Player Info", "20px", "10px");
        infoSection.addControl(header);

        const fields = ["Name", "Address", "Game_ID", "Home_Base", "Index", "Last_Action"];
        fields.forEach((field, index) => {
            const row = index % 2 === 0 ? 0 : 1;
            const column = Math.floor(index / 2);
            this.addInfoField(field, infoSection, row, column);
        });


    }

    private addPlayerScoreSection(): void {
        const scoreSection = new GUI.Rectangle();
        scoreSection.width = "380px";
        scoreSection.height = "140px";
        scoreSection.top = "-50px";
        //scoreSection.left = "10px";
        scoreSection.cornerRadius = 5;
        scoreSection.color = this.ACCENT_COLOR;
        scoreSection.thickness = 0;
        scoreSection.background = this.PANEL_COLOR;
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
        supplySection.thickness = 0;
        supplySection.background = this.PANEL_COLOR;
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
        field.addControl(valueText);

        this.scoreRows.set(label.toLowerCase(), valueText);
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

        this.supplyRows.set(unitType.toLowerCase(), unitValue);
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
                return '/images/unit1.png';
            case 'armored':
                return '/images/unit3.png';
            case 'cyber':
                return '/images/unit4.png';
            case 'infantry':
                return '/images/unit2.png';
            case 'naval':
                return '/images/unit5.png';
            default:
                return '/images/unit2.png';
        }
    }

    public updatePlayerInfo(playerData: any): void {
        
        Object.entries(playerData).forEach(([key, value]) => {
            console.log(this.infoRows.has(key))
            if (this.infoRows.has(key)) {
                this.infoRows.get(key)!.text = value.toString();
                
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

    private addBorderToStackPanel(stackPanel: GUI.StackPanel, name: string): GUI.Rectangle {
        const border = new GUI.Rectangle(name + "_border");
        border.width = 1;
        border.thickness = 1;
        border.color = "white";
        border.background = "transparent";
        border.addControl(stackPanel);
        return border;
    }
    

    public updateOpponentsInfo(opponents: any[]): void {
        // Clear existing opponent cards
        this.opponentsPanel.children.slice(1).forEach(child => {
            this.opponentsPanel.removeControl(child);
        });
    
        const grid = new GUI.Grid();
        grid.width = 1;
        grid.height = "570px"; // Leave space for the cancel button
        grid.addColumnDefinition(0.5);
        grid.addColumnDefinition(0.5);
    
        const rows = Math.ceil(opponents.length / 2);
        for (let i = 0; i < rows; i++) {
            grid.addRowDefinition(1 / rows);
        }
    
        opponents.forEach((opponent, index) => {
            const card = this.createOpponentCard(opponent);
            grid.addControl(card, Math.floor(index / 2), index % 2);
        });
    
        this.opponentsPanel.addControl(grid);
    }
    
    private createOpponentCard(opponent: any): GUI.Rectangle {
        console.log("Creating card for opponent:", opponent);
    
        const card = new GUI.Rectangle();
        card.width = 0.95;
        card.height = 0.95;
        card.cornerRadius = 10;
        card.color = this.TEXT_COLOR;
        card.thickness = 0;
        card.background = this.PANEL_COLOR;
    
        const mainStack = new GUI.StackPanel();
        mainStack.width = 1;
        mainStack.height = 1;
        mainStack.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        card.addControl(mainStack);

        


      
    
        // Header
        const header = new GUI.Rectangle();
        header.height = "40px";
        header.background = "#2c3e50";
        header.thickness = 0;
        mainStack.addControl(header);
    
        const nameText = new GUI.TextBlock();
        nameText.text = opponent.name || "Unknown";
        nameText.color = this.TEXT_COLOR;
        nameText.fontSize = 20;
        nameText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        header.addControl(nameText);
    
        // Content
        const contentStack = new GUI.StackPanel();
        contentStack.width = 1;
        contentStack.height = "500px";
        contentStack.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        contentStack.paddingTop = "10px";
        contentStack.paddingLeft = "10px";
        contentStack.paddingRight = "10px";
        contentStack.spacing = 5;
        mainStack.addControl(contentStack);


    
        // Base and Last Action
        this.addInfoRow(contentStack, "Base", opponent.home_base);
        this.addInfoRow(contentStack, "Last Action", opponent.last_action);
    
        // Score
        if (opponent.player_score) {
            const scoreTitle = this.createTextBlock("Score", 16);
            contentStack.addControl(scoreTitle);
    
            const scoreGrid = new GUI.Grid();
            scoreGrid.addColumnDefinition(0.5);
            scoreGrid.addColumnDefinition(0.5);
            scoreGrid.addRowDefinition(0.5);
            scoreGrid.addRowDefinition(0.5);
            scoreGrid.height = "80px";
            contentStack.addControl(scoreGrid);
    
            this.addScoreItem(scoreGrid, "Kills", opponent.player_score.kills, 0, 0);
            this.addScoreItem(scoreGrid, "Deaths", opponent.player_score.deaths, 0, 1);
            this.addScoreItem(scoreGrid, "Assists", opponent.player_score.assists, 1, 0);
            this.addScoreItem(scoreGrid, "Score", opponent.player_score.score, 1, 1);
        } 
        else {
            this.addInfoRow(contentStack, "Score", "N/A");
        }
    
        // Supply
        if (opponent.supply && Object.keys(opponent.supply).length > 0) {
            const supplyTitle = this.createTextBlock("Supply", 16);
            supplyTitle.height = "20px";
            contentStack.addControl(supplyTitle);

            const supplyGrid = new GUI.Grid();
            supplyGrid.width = 1;
            supplyGrid.height = "120px"; // Adjust this value as needed

            const unitTypes = Object.keys(opponent.supply);
            const columns = 3; // We'll use 3 columns for a more compact layout
            const rows = Math.ceil(unitTypes.length / columns);

            for (let i = 0; i < columns; i++) {
                supplyGrid.addColumnDefinition(1 / columns);
            }
            for (let i = 0; i < rows; i++) {
                supplyGrid.addRowDefinition(1 / rows);
            }

            contentStack.addControl(supplyGrid);

            unitTypes.forEach((unitType, index) => {
                const count = opponent.supply[unitType];
                const row = Math.floor(index / columns);
                const column = index % columns;

                const unitContainer = new GUI.StackPanel();
                unitContainer.width = 1;
                unitContainer.height = 1;

                const unitImage = new GUI.Image("unitImage_" + unitType, this.getUnitImageUrl(unitType));
                unitImage.width = "30px";
                unitImage.height = "30px";
                unitContainer.addControl(unitImage);

                const unitText = this.createTextBlock(`${unitType}: ${count}`, 12);
                unitText.height = "15px";
                unitContainer.addControl(unitText);

                supplyGrid.addControl(unitContainer, row, column);
            });
        } else {
            this.addInfoRow(contentStack, "Supply", "N/A");
        }
        // Add cancel button
        const kickButton = GUI.Button.CreateSimpleButton("kickButton", "kick");
        kickButton.paddingTop = "10px"
        kickButton.color = "white";
        kickButton.cornerRadius = 5;
        kickButton.background = "red";
        kickButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        kickButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        kickButton.top = "5px";
        kickButton.left = "-5px";
        kickButton.hoverCursor = "pointer";
        kickButton.width = "200px";
        kickButton.height = "40px";
        kickButton.color = "white";
        kickButton.cornerRadius = 5;
        kickButton.hoverCursor = "pointer";
        kickButton.thickness = 0;
        kickButton.fontFamily = "Arial, Helvetica, sans-serif";
        kickButton.fontSize = 16;
        // Add hover effect
        kickButton.onPointerEnterObservable.add(() => {
            kickButton.background = "rgba(180, 100, 50, 1)";
        });
        kickButton.onPointerOutObservable.add(() => {
            kickButton.background = "rgba(255, 80, 40, 0.9)";
        });
        kickButton.onPointerUpObservable.add(() => {
            this.opponentsPanel.isVisible = false;
        });
        contentStack.addControl(kickButton);
    
        console.log(`Card created for ${opponent.name} with ${contentStack.children.length} content items`);
        return card;
    }
    
    private addInfoRow(parent: GUI.StackPanel, label: string, value: string): void {
        const row = new GUI.StackPanel();
        row.isVertical = false;
        row.height = "30px";
        parent.addControl(row);
    
        const labelText = this.createTextBlock(label + ":", 14);
        labelText.width = "40%";
        row.addControl(labelText);
    
        const valueText = this.createTextBlock(value || "N/A", 14);
        valueText.width = "60%";
        valueText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        row.addControl(valueText);
    
        console.log(`Added info row: ${label} - ${value}`);
    }
    
    private addScoreItem(grid: GUI.Grid, label: string, value: number | undefined, row: number, column: number): void {
        const container = new GUI.StackPanel();
        container.height = "100%";
        grid.addControl(container, row, column);
    
        const labelText = this.createTextBlock(label, 12);
        container.addControl(labelText);
    
        const valueText = this.createTextBlock(value?.toString() || "N/A", 14);
        container.addControl(valueText);
    
        console.log(`Added score item: ${label} - ${value}`);
    }
    
    private addSupplyItem(grid: GUI.Grid, label: string, value: number | undefined, row: number, column: number): void {
        const container = new GUI.StackPanel();
        container.height = "100%";
        grid.addControl(container, row, column);
    
        const labelText = this.createTextBlock(label, 12);
        container.addControl(labelText);
    
        const valueText = this.createTextBlock(value?.toString() || "N/A", 14);
        container.addControl(valueText);
    
        console.log(`Added supply item: ${label} - ${value}`);
    }

    private createTextBlock(text: string, fontSize: number): GUI.TextBlock {
        const textBlock = new GUI.TextBlock();
        textBlock.text = text;
        textBlock.color = this.TEXT_COLOR;
        textBlock.fontSize = fontSize;
        textBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        textBlock.resizeToFit = true;
        return textBlock;
    }

    private createDeployButton(): void {
        // Outer circle (green border)
        const outerCircle = new GUI.Ellipse();
        outerCircle.width = "120px";
        outerCircle.height = "120px";
        outerCircle.thickness = 2;
        outerCircle.color = "green";
        outerCircle.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        outerCircle.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        outerCircle.top = "-20px";
        outerCircle.left = "-20px";
        this.gui.addControl(outerCircle);
    
        // Middle circle (dark background)
        const middleCircle = new GUI.Ellipse();
        middleCircle.width = 0.9;
        middleCircle.height = 0.9;
        middleCircle.background = "black";
        middleCircle.thickness = 0
        outerCircle.addControl(middleCircle);
    
        // Inner circle (green with text)
        const innerCircle = new GUI.Ellipse();
        innerCircle.width = 0.7;
        innerCircle.height = 0.7;
        innerCircle.thickness = 0;
        innerCircle.background = "rgba(0, 80, 40, 0.9)";
        middleCircle.addControl(innerCircle);
    
        // Text
        const deployText = new GUI.TextBlock();
        deployText.text = "Deploy";
        deployText.color = "white";
        deployText.fontSize = 16;
        innerCircle.addControl(deployText);
    
        // Make the button interactive
        outerCircle.isPointerBlocker = true;
        outerCircle.onPointerUpObservable.add(() => {
            this.toggleUnitSelectionPanel();
            // Add a visual feedback when clicked
            innerCircle.background = "darkgreen";
            setTimeout(() => {
                innerCircle.background = "green";
            }, 100);
        });
    
        // Hover effect
        outerCircle.onPointerEnterObservable.add(() => {
            outerCircle.scaleX = 1.1;
            outerCircle.scaleY = 1.1;
        });
        outerCircle.onPointerOutObservable.add(() => {
            outerCircle.scaleX = 1;
            outerCircle.scaleY = 1;
        });
    
        this.deployButton = outerCircle;
    }

    private createUnitSelectionPanel(): void {
        // Create main panel
        this.unitSelectionPanel = new GUI.Rectangle();
        this.unitSelectionPanel.width = "240px";
        this.unitSelectionPanel.height = "340px"; // Increased height to accommodate larger buttons
        this.unitSelectionPanel.cornerRadius = 10;
        this.unitSelectionPanel.color = "rgba(0, 60, 30, 0.9)";
        this.unitSelectionPanel.thickness = 2;
        this.unitSelectionPanel.background = "rgba(0, 40, 20, 0.8)";
        this.unitSelectionPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.unitSelectionPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.unitSelectionPanel.top = "-20px";
        this.unitSelectionPanel.left = "-20px";
        this.unitSelectionPanel.isVisible = false;
        this.gui.addControl(this.unitSelectionPanel);
    
        // Create close button
        this.closeButton = GUI.Button.CreateSimpleButton("closeButton", "X");
        this.closeButton.width = "20px";
        this.closeButton.height = "20px";
        this.closeButton.color = "white";
        this.closeButton.cornerRadius = 15;
        this.closeButton.background = "rgba(0, 0, 0, 0.8)";
        this.closeButton.onPointerUpObservable.add(() => this.closePanel());
        this.closeButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.closeButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.closeButton.left = "-10px";
        this.closeButton.top = "10px";
        this.unitSelectionPanel.addControl(this.closeButton);
    
        // Create stack panel for buttons
        const buttonPanel = new GUI.StackPanel();
        buttonPanel.width = "220px";
        buttonPanel.isVertical = true;
        buttonPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        buttonPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.unitSelectionPanel.addControl(buttonPanel);
    
        // Add unit buttons to the panel
        const units = ["Infantry", "Armored", "Air", "Naval", "Cyber"];
        units.forEach(unit => this.addUnitButton(unit, buttonPanel));
    }
    
    private addUnitButton(unitType: string, parent: GUI.StackPanel): void {
        const button = GUI.Button.CreateImageWithCenterTextButton(unitType + "Button", unitType, this.getUnitImageUrl(unitType));
        button.width = "200px";
        button.height = "50px";
        button.color = "white";
        button.cornerRadius = 5;
        button.background = "rgba(0, 80, 40, 0.9)";
        button.hoverCursor = "pointer";
        button.thickness = 0;
        button.fontFamily = "Arial, Helvetica, sans-serif";
        button.fontSize = 16;
    
        // Adjust image size and position
        if (button.image) {
            button.image.width = "40px";
            button.image.height = "40px";
            button.image.left = "-70px"; // Move image to the left
        }
    
        // Adjust text position
        if (button.textBlock) {
            button.textBlock.left = "20px"; // Move text to the right
        }
    
        button.onPointerUpObservable.add(() => this.selectUnitToDeploy(unitType));
    
        // Add hover effect
        button.onPointerEnterObservable.add(() => {
            button.background = "rgba(0, 100, 50, 1)";
        });
        button.onPointerOutObservable.add(() => {
            button.background = "rgba(0, 80, 40, 0.9)";
        });
    
        parent.addControl(button);
    }
    

    private closePanel(): void {
        this.unitSelectionPanel.isVisible = false;
    }
    
    // Method to show the panel (call this when you want to display the unit selection panel)
    public showUnitSelectionPanel(): void {
        this.unitSelectionPanel.isVisible = true;
    }
    private toggleUnitSelectionPanel(): void {
        this.unitSelectionPanel.isVisible = !this.unitSelectionPanel.isVisible;
    }

    private selectUnitToDeploy(unitType: string): void {
        this.selectedUnit = unitType;
        this.isDeploymentMode = true;
        this.unitSelectionPanel.isVisible = false;
        console.log(`Selected unit: ${unitType}. Click on the map to deploy.`);
        // Here you would change the cursor and highlight valid deployment areas
    }

    public handleMapClick(position: Vector3): void {
        if (this.isDeploymentMode && this.selectedUnit) {
            console.log(`Deploying ${this.selectedUnit} at position: ${position}`);
            // Here you would actually create and place the unit at the clicked position
            this.isDeploymentMode = false;
            this.selectedUnit = null;
        }
    }
}

