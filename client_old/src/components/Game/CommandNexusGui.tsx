import * as GUI from "@babylonjs/gui";
import { Scene, Vector3,Animation } from '@babylonjs/core';
import {  UnitType,UnitAbilities, AbilityType, Agent, ToastType, Infantry, Armored } from "../../utils/types";
import { DeployInfo } from "../../utils/types";
import { abilityStringToEnum, getBannerLevelString, stringToUnitType } from "../../utils/nexus";
import { getUnitAbilities } from "../../utils/nexus";
import { Button, Control, Rectangle, StackPanel, TextBlock,Image } from "@babylonjs/gui";
import { Player } from "../../utils/types";
import { useRef } from "react";
import { Account } from "@dojoengine/torii-client";
import { AccountInterface } from "starknet";

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
    private player:Player;
    private abilityMode:AbilityType| null;
    private baseText: GUI.TextBlock;
    private rankText: GUI.TextBlock;
    //private kickButton: GUI.Button;
    private getAccount: () => AccountInterface | Account;


    private deployButton: GUI.Ellipse;
    private isDeploymentMode: boolean = false;
    public selectedUnit: UnitType;
    private unitSelectionPanel: GUI.Rectangle;
    private closeButton: GUI.Button;
    private deployPosition: Vector3 | null;
    private unitButtons: GUI.Button[] = []
    private outerArc: Rectangle;
    private innerArc: Rectangle;
    private imagePlaceholder: Rectangle;
    private arena;
    private nexus;
    private game;
    private infoPanel: Rectangle;
   


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
    constructor(scene: Scene,arena,nexus,game,player, getAccount) {
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

        this.createArcs();
        this.arena = arena;
        this.nexus = nexus;
        this.game = game;
        this.player = player
        this.getAccount = getAccount;
        this.initializeInfoPanel();
       
    }

    private createArcs() {
        this.outerArc = new Rectangle("outerArc");
        this.outerArc.width = "700px";
        this.outerArc.height = "200px";
        this.outerArc.cornerRadius = 200;
        this.outerArc.color = "green";
        this.outerArc.thickness = 0;
        this.outerArc.background = "transparent";
        this.outerArc.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.gui.addControl(this.outerArc);

        this.innerArc = new Rectangle("innerArc");
        this.innerArc.width = "400px";
        this.innerArc.height = "100px";
        this.innerArc.cornerRadius = 150;
        this.innerArc.color = "green";
        this.innerArc.thickness = 0;
        this.innerArc.background = "transparent";
        this.innerArc.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.gui.addControl(this.innerArc);
    }


    private initializeInfoPanel (){
        this.infoPanel = new Rectangle("infoPanel");
        this.infoPanel.width = "250px";
        this.infoPanel.height = "300px";
        this.infoPanel.cornerRadius = 10;
        this.infoPanel.thickness = 0;
        this.infoPanel.background = this.PANEL_COLOR;
        this.infoPanel.alpha = 0.9;
        this.infoPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.infoPanel.left = "20px";
        this.infoPanel.isVisible = false;
        
        this.gui.addControl(this.infoPanel);
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
    
        // Create a StackPanel for the left side (Turn Info and Base/Rank)
        let leftPanel = new GUI.StackPanel();
        leftPanel.isVertical = false;
        leftPanel.height = "50px";
        leftPanel.width = "700px";
        leftPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    
        // Turn Info Panel
        let turnInfoPanel = new GUI.StackPanel();
        turnInfoPanel.isVertical = false;
        turnInfoPanel.height = "50px";
        turnInfoPanel.width = "200px";
    
        let playerImage = new GUI.Image("playerIcon", "/logo.png");
        playerImage.width = "40px";
        playerImage.height = "40px";
        playerImage.paddingLeft = '4px';
    
        this.turnInfoText = new GUI.TextBlock();
        this.turnInfoText.text = "Player";
        this.turnInfoText.width = '80px';
        this.turnInfoText.color = this.TEXT_COLOR;
        this.turnInfoText.fontSize = 20;
        this.turnInfoText.paddingLeft = '10px';
    
        turnInfoPanel.addControl(playerImage);
        turnInfoPanel.addControl(this.turnInfoText);
    
        // Base and Rank Panel
        let baseRankPanel = new GUI.StackPanel();
        baseRankPanel.isVertical = false;
        baseRankPanel.height = "50px";
        baseRankPanel.width = "200px";
        baseRankPanel.paddingLeft = '20px';
    
        let baseImage = new GUI.Image("baseIcon", "/images/base.png");
        baseImage.width = "30px";
        baseImage.height = "30px";
    
        this.baseText = new GUI.TextBlock();
        this.baseText.text = 'Base Name';
        this.baseText.color = 'blue';
        this.baseText.fontSize = 15;
        this.baseText.width = '100px';
        this.baseText.paddingLeft = '10px';

        baseRankPanel.addControl(baseImage);
        baseRankPanel.addControl(this.baseText);

        // Base and Rank Panel
        let rankPanel = new GUI.StackPanel();
        rankPanel.isVertical = false;
        rankPanel.height = "50px";
        rankPanel.width = "350px";
        rankPanel.paddingLeft = '20px';

        let rankImage = new GUI.Image("baseIcon", "/images/recruit.jpg");
        rankImage.width = "30px";
        rankImage.height = "30px";
    
        this.rankText = new GUI.TextBlock();
        this.rankText.text = 'Rank';
        this.rankText.color = 'orange';
        this.rankText.fontSize = 15;
        this.rankText.width = '100px';
        this.rankText.paddingLeft = '10px';
    

        rankPanel.addControl(rankImage);
        rankPanel.addControl(this.rankText);
    
        // Add Turn Info and Base/Rank panels to the left panel
        leftPanel.addControl(turnInfoPanel);
        leftPanel.addControl(baseRankPanel);
        leftPanel.addControl(rankPanel);
    
        // Add the left panel to the top bar
        topBar.addControl(leftPanel);
    
        // Create and add the End Turn button
        const endTurnBtn = this.createButton("endTurn", "End Turn");
        endTurnBtn.width = "120px";
        endTurnBtn.height = "40px";
        endTurnBtn.cornerRadius = 5;
        endTurnBtn.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        endTurnBtn.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
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

    // public showKick(){
    //     this.kickButton.isVisible = true;
    // }

    public updatePlayerInfo(playerData: Player): void {

       this.baseText.text = playerData.home_base
       this.rankText.text = getBannerLevelString(playerData.rank)
        
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
        // // Add cancel button
        // const kickButton = GUI.Button.CreateSimpleButton("kickButton", "kick");
        // kickButton.paddingTop = "10px"
        // kickButton.color = "white";
        // kickButton.cornerRadius = 5;
        // kickButton.background = "red";
        // kickButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        // kickButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        // kickButton.top = "5px";
        // kickButton.left = "-5px";
        // kickButton.hoverCursor = "pointer";
        // kickButton.width = "200px";
        // kickButton.height = "40px";
        // kickButton.color = "white";
        // kickButton.cornerRadius = 5;
        // kickButton.hoverCursor = "pointer";
        // kickButton.thickness = 0;
        // kickButton.fontFamily = "Arial, Helvetica, sans-serif";
        // kickButton.fontSize = 16;
        // kickButton.isVisible  = false
        // // Add hover effect
        // kickButton.onPointerEnterObservable.add(() => {
        //     kickButton.background = "rgba(180, 100, 50, 1)";
        // });
        // kickButton.onPointerOutObservable.add(() => {
        //     kickButton.background = "rgba(255, 80, 40, 0.9)";
        // });
        // kickButton.onPointerUpObservable.add(async () => {
        //     try {
        //         // Wait for the kickPlayer function to complete before hiding the panel
        //         await this.kickPlayer(this.player.index, this.game.game_id);
        //         this.opponentsPanel.isVisible = false;
        //         this.showToast("Player kicked out")
        //     } catch (error: any) {
        //         this.showToast(error.message);
        //     }
        // });
        

        
        // this.kickButton = kickButton;
        // contentStack.addControl(this.kickButton);
    
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

        const unit = stringToUnitType(unitType);

        if (unit === UnitType.Air || unit === UnitType.Cyber || unit === UnitType.Naval){
            button.isEnabled = false;
        }
    
        button.onPointerUpObservable.add(() => this.selectUnitToDeploy(unit));
    
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

    private selectUnitToDeploy(unitType: UnitType): void {
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
            this.deployPosition = position;
        }
    }

    public getSelectedUnitAndDeployPosition(): DeployInfo {
        return {unit: this.selectedUnit, position: this.deployPosition};
      }

    public handleDeployement() {
        this.isDeploymentMode = false;
        this.selectedUnit = null;
        this.deployPosition = null;
    }

    public getDeploymentMode(): boolean{
        return this.isDeploymentMode
    }

    public showActionsMenu(unitType: UnitType) {
        this.clearButtons(); // Clear existing buttons
        this.innerArc.thickness = 1;
    
        // Fetch abilities based on the unitType
        const abilities = getUnitAbilities(unitType);
        const availableAbilities = Object.entries(abilities)
            .filter(([_, level]) => level > 0)
            .map(([ability, _]) => ability as keyof typeof AbilityType);
    
        const numButtons = availableAbilities.length;
        const buttonSize = "80px";
        const outerWidth = 700; // Width of the outer arc
        const innerWidth = 300; // Width of the inner arc
        const outerHeight = 200; // Height of the outer arc
        const innerHeight = 100; // Height of the inner arc
        const buttonRadius = (outerWidth + innerWidth) / 4; // Average radius for horizontal positioning
    
        const paddingAngle = 0.2; // Padding in radians to reduce total range slightly
        const availableAngle = Math.PI - paddingAngle; // Total angle range with padding
        const angleStep = availableAngle / (numButtons - 1); // Even angle step between buttons
    
        availableAbilities.forEach((ability, index) => {
            // Calculate angle for buttons, evenly spaced with padding
            const angle = (index * angleStep) + (paddingAngle / 2); // Offset to center the arc
    
            // Horizontal position based on buttonRadius and angle
            let x = Math.cos(angle) * buttonRadius;
    
            // Vertical position to ensure it's between the outer and inner arc heights
            let y = -Math.sin(angle) * (outerHeight / 2 - innerHeight / 2) - (outerHeight - innerHeight) / 2;
    
            // Adjust the first and last buttons by pushing them slightly down
            if (index === 0 || index === numButtons - 1) {
                y += 40; // Push the button down by 20px (adjust this value as needed)
                if (index === 0){
                    x += 20;
                }else{
                    x -= 20;
                }
            }else{
                y -=10
            }
            function capitalizeFirstLetter(ability: string) {
                return ability.charAt(0).toUpperCase() + ability.slice(1);
            }

            const abilityEnum = abilityStringToEnum(capitalizeFirstLetter(ability));

            const abilityImagePath = this.getAbilityImage(abilityEnum);

           // console.log(abilityImagePath,abilityEnum, ability)
    
            // Create the button with image
            const button = Button.CreateImageWithCenterTextButton(
                ability,
                ability,
                abilityImagePath
            );
            button.width = buttonSize;
            button.height = "50px";
            button.color = "white";
            button.thickness = 0;
            button.cornerRadius = 35;
            button.background = "rgba(80, 80, 80, 0.6)";
            button.hoverCursor = "pointer";
            button.thickness = 0;
            button.fontFamily = "Arial, Helvetica, sans-serif";
            button.fontSize = 16;
        
            // Adjust image size and position
            if (button.image) {
                button.image.width = "20px";
                button.image.height = "20px";
                button.image.left = "-30px"; // Move image to the left
            }
        
            // Adjust text position
            if (button.textBlock) {
                button.textBlock.left = "10px"; // Move text to the right
            }
    
            // Handle click event
            button.onPointerUpObservable.add(() => {
                console.log(`${ability} ability used`);
                this.abilityMode = abilityEnum;
            });
    
            // Add hover effect
            button.onPointerEnterObservable.add(() => {
                button.background = "rgba(0, 80, 40, 0.9)"; // Light blue with slight transparency on hover
            });

            button.onPointerOutObservable.add(() => {
                button.background = "rgba(80, 80, 80, 0.6)"; // Dark gray with slight transparency in normal state
            });


            // Align buttons relative to the outer arc
            button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
            button.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    
            // Set the calculated position of the button relative to the center
            button.left = x + "px";
            button.top = y + "px";
    
            // Add the button to the GUI
            this.gui.addControl(button);
            this.unitButtons.push(button);
        });
    
        console.log("Actions menu displayed");
    }
    
    

    private clearButtons() {
        this.unitButtons.forEach(button => this.gui.removeControl(button));
        this.unitButtons = [];
    }

    private getAbilityImage(ability: AbilityType): string {
        switch (ability) {
            case AbilityType.Attack:
                return "/images/attack_icon.png";
            case AbilityType.Defend:
                return "/images/defend_icon.png";
            case AbilityType.Patrol:
                return "/images/patrol_icon.png";
            case AbilityType.Stealth:
                return "/images/stealth_icon.png";
            case AbilityType.Recon:
                return "/images/recon_icon.png";
            case AbilityType.Hack:
                return "/images/hack_icon.png";
            case AbilityType.Repair:
                return "/images/repair_icon.png";
            case AbilityType.Airlift:
                return "/images/airlift_icon.png";
            case AbilityType.Bombard:
                return "/images/bombard_icon.png";
            case AbilityType.Submerge:
                return "/images/submerge_icon.png";
            default:
                return "/images/default_icon.png"; // Fallback if no matching ability
        }
    }

    public getAbilityMode(): AbilityType | null {
        return this.abilityMode
    }

    public handleAttack(){
        this.abilityMode = null
    }

// Method to create the toast notification with message type
// Method to create the toast notification with message type as enum
public showToast(message: string, toastType: ToastType = ToastType.Info): void {
    // Create a background panel for the toast
    const toastPanel = new GUI.Rectangle();
    toastPanel.width = "800px";
    toastPanel.height = "80px";
    toastPanel.cornerRadius = 10;
    toastPanel.color = "white";  // Border color
    toastPanel.thickness = 0;    // Border thickness
    toastPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    toastPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    toastPanel.paddingBottom = "20px"; // Position the toast slightly above the bottom

    // Determine background and text colors based on the message type
    let backgroundColor = "rgba(0, 80, 40, 0.9)";  // Default: success (greenish)
    let textColor = "cyan";  // Default text color for success/info

    switch (toastType) {
        case ToastType.Error:
            backgroundColor = "rgba(139, 0, 0, 0.9)";  // Red background for errors
            textColor = "white";
            break;
        case ToastType.Warning:
            backgroundColor = "rgba(255, 165, 0, 0.9)";  // Orange background for warnings
            textColor = "black";
            break;
        case ToastType.Success:
            backgroundColor = "rgba(0, 128, 0, 0.9)";  // Green background for success
            textColor = "cyan";
            break;
        case ToastType.Info:
        default:
            backgroundColor = "rgba(0, 80, 40, 0.9)";  // Default to greenish
            textColor = "cyan";
            break;
    }

    // Set the background color of the toast
    toastPanel.background = backgroundColor;

    // Create the text block to show the message
    const toastText = new GUI.TextBlock();
    toastText.text = message;
    toastText.color = textColor;
    toastText.fontSize = 15;
    toastText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    toastText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    // Add the text block to the panel
    toastPanel.addControl(toastText);

    // Add the panel to the GUI
    this.gui.addControl(toastPanel);

    // Add animation: fade in, stay visible, and then fade out
    this.animateToast(toastPanel);
}


    private kickPlayer = async (player_index: number, game_id: number) => {
        try {
        //   setKickLoading(true);
          const result  = await this.arena.kick(this.getAccount(), game_id, player_index);
        } catch (error: any) {
          this.showToast(error.message);
        } finally {
          
        }
      };

    // Method to animate the toast panel (fade in, wait, fade out)
    private animateToast(panel: GUI.Rectangle): void {
        // Fade in animation
        panel.alpha = 0; // Start fully transparent
        let fadeIn = new Animation(
            "fadeIn", "alpha", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        let fadeInKeys = [
            { frame: 0, value: 0 },  // Initial transparency
            { frame: 20, value: 1 }  // Fully visible
        ];
        fadeIn.setKeys(fadeInKeys);

        // Fade out animation (after 3 seconds)
        let fadeOut = new Animation(
            "fadeOut", "alpha", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        let fadeOutKeys = [
            { frame: 0, value: 1 },  // Start fully visible
            { frame: 30, value: 0 }  // Fully transparent
        ];
        fadeOut.setKeys(fadeOutKeys);

        // Run fade in, wait for 3 seconds, then fade out
        this.gui.getScene().beginDirectAnimation(panel, [fadeIn], 0, 20, false, 1, () => {
            setTimeout(() => {
                this.gui.getScene().beginDirectAnimation(panel, [fadeOut], 0, 30, false, 1, () => {
                    // Remove the toast after fading out
                    panel.dispose();
                });
            }, 3000); // Toast stays visible for 3 seconds
        });
    }

    public updatePlayer(player: Player){
        this.player = player
    }

    public updateGame(game:any){
        this.game = game
    }
    
    public showInfantryInfo(infantry: Infantry): void {
        this.clearPanel();
        const stack = this.createBasePanel("/images/unit2.png", "");
    
        // Critical infantry stats with icons
        this.addStatRow(stack, "/images/health.png",'HP',`${infantry.health.current}/${infantry.health.max}`);
        this.addStatRow(stack, "/images/firepower.png",'FP' ,infantry.firepower.toString());
        this.addStatRow(stack, "/images/accuracy.png", 'ACC',`${infantry.accuracy}%`);
        this.addStatRow(stack, "/images/range.png",'Range' ,`${infantry.range}m`);
    
        this.infoPanel.isVisible = true;
      }
    
      public showArmoredInfo(armored: Armored): void {
        this.clearPanel();
        const stack = this.createBasePanel("/images/unit3.png", "");
    
        // Critical armored stats with icons
        this.addStatRow(stack, "/images/hull.png", 'Hull' ,`${armored.armored_health.hull_integrity}%`);
        this.addStatRow(stack, "/images/firepower.png",'FP' ,armored.firepower.toString());
        this.addStatRow(stack, "/images/ammo.png",'ACC' ,armored.accessories.main_gun_ammunition.toString());
        this.addStatRow(stack, "/images/range.png", 'Range',`${armored.range}m`);
    
        this.infoPanel.isVisible = true;
      }
    
      private createBasePanel(iconPath: string, unitType: string): StackPanel {
        const stack = new StackPanel();
        stack.width = "100%";
        stack.background = this.PANEL_COLOR;
        

        
        
        // Unit type icon
        const icon = new Image("unitIcon", iconPath);
        icon.width = "60px";
        icon.height = "60px";
        icon.paddingTop = "10px";
        stack.addControl(icon);
        
        // Unit type label
        const typeText = new TextBlock();
        typeText.text = unitType;
        typeText.color = "#ffffff";
        typeText.height = "30px";
        typeText.fontSize = 18;
        typeText.paddingBottom = "10px";
        stack.addControl(typeText);
    
        this.infoPanel.addControl(stack);
        return stack;
      }
    
      private addStatRow(parent: GUI.StackPanel, iconPath: string, label: string, value: string): void {
        const row = new Rectangle();
        row.height = "35px";
        row.thickness = 0;
        row.background = this.PANEL_COLOR;
        row.paddingLeft = "10px";
        row.paddingRight = "15px";
        
        // Stat icon
        const icon = new Image("statIcon", iconPath);
        icon.width = "20px";
        icon.height = "20px";
        icon.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        row.addControl(icon);
        
        // Label text
        const labelText = new TextBlock();
        labelText.text = label;
        labelText.color = "#88ff88"; // or whatever color you prefer
        labelText.fontSize = 14;
        labelText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        labelText.left = "30px"; // Space after icon
        row.addControl(labelText);
        
        // Value text
        const valueText = new TextBlock();
        valueText.text = value;
        valueText.color = "#ffffff";
        valueText.fontSize = 14;
        valueText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        row.addControl(valueText);
        
        parent.addControl(row);
    }
    
      private clearPanel(): void {
        const controls = this.infoPanel.getDescendants();
        controls.forEach(control => control.dispose());
      }
    
      public hide(): void {
        this.infoPanel.isVisible = false;
      }

}

