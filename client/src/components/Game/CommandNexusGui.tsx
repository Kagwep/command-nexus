import * as GUI from "@babylonjs/gui";
import { Scene, Vector3,Animation, Mesh } from '@babylonjs/core';
import {  UnitType,UnitAbilities, AbilityType, Agent, ToastType, Armored } from "../../utils/types";
import { DeployInfo } from "../../utils/types";
import { abilityStringToEnum, battlefieldTypeToString, getBannerLevelString, guideContent, positionEncoder, stringToUnitType } from "../../utils/nexus";
import { getUnitAbilities } from "../../utils/nexus";
import { Button, Control, Rectangle, StackPanel, TextBlock,Image, ScrollViewer } from "@babylonjs/gui";
import { AbilityState, Infantry, Player, TerrainType,UnitModeEnum, UnitsSupply, UnitState, UnitTypeEnum } from "../../dojogen/models.gen";
import { useRef } from "react";
import { Account, AccountInterface, encode } from "starknet";
import { GameState } from "./GameState";
import { StarknetErrorParser } from "./ErrorParser";
import { ScanEye } from "lucide-react";
import { TutorialUI } from "./TutorialUI";

interface TopBarConfig {
    TEXT_COLOR: string;
    BACKGROUND_COLOR: string;
    ACCENT_COLOR: string;
    HOVER_COLOR: string;
    HEIGHT: string;
}



export default class CommandNexusGui {
    private gui: GUI.AdvancedDynamicTexture;
    private mainMenuPanel: GUI.Rectangle = new Rectangle;
    private unitsPanel: GUI.Rectangle = new Rectangle;
    private marketplacePanel: GUI.Rectangle = new Rectangle;
    private actionsPanel: GUI.Rectangle = new Rectangle;
    private playerPanel: GUI.Rectangle = new Rectangle;
    private opponentsPanel: GUI.Rectangle = new Rectangle;
    private turnInfoText: GUI.TextBlock = new TextBlock;
    private selectedUnitId: number | null = null;
    private selectedUnitInfo :any;
    private ACCENT_COLOR = "#4CAF50";
    private player:Player;
    private abilityMode: AbilityType | null;
    private baseText: GUI.TextBlock = new TextBlock;
    private rankText: GUI.TextBlock = new TextBlock;
    //private kickButton: GUI.Button;
    private getAccount: () => AccountInterface | Account;
    private getGameState: () => GameState;
    private scoreText: GUI.TextBlock;
    private commandsText: GUI.TextBlock;
    private ACTIVE_COLOR = "#4CAF50";
    private COOLDOWN_COLOR = "#f44336";
    private INACTIVE_COLOR = "#808080";
    private rect: GUI.Rectangle;
    private text: GUI.TextBlock;
    private tutorialContainer: Rectangle;
    private scrollViewer: GUI.ScrollViewer;
    private contentPanel: StackPanel;
    private tutorialUI: TutorialUI;
    private scorePanel: GUI.Rectangle;
    private killsText: GUI.TextBlock;
    private deathsText: GUI.TextBlock;
    private kills: number = 0;
    private deaths: number = 0;
    private opponentsData: Record<string, Player> = {};
    private isVisible: boolean = false;
    private opponentTextBlocks: { [address: string]: { 
        nameText: GUI.TextBlock, 
        scoreText: GUI.TextBlock,
        killsText: GUI.TextBlock,
        deathsText: GUI.TextBlock,
        supplyText: GUI.TextBlock
    } } = {};

    // Default style values
    private defaultStyles = {
        rectBackground: "grey",
        rectAlpha: 0.7,
        textColor: "White",
        textBackground: '#006994',
        fontSize: 14
    };


    private config: TopBarConfig = {
        TEXT_COLOR: "#E5E7EB",
        BACKGROUND_COLOR: "#065F46",
        ACCENT_COLOR: "#059669",
        HOVER_COLOR: "#047857",
        HEIGHT: "60px"
    };

    private deployButton: GUI.Ellipse = new GUI.Ellipse;
    private isDeploymentMode: boolean = false;
    public selectedUnit: UnitType | null = null;
    private unitSelectionPanel: GUI.Rectangle = new Rectangle;
    private closeButton: GUI.Button = new Button;
    private deployPosition: Vector3 | null = new Vector3;
    private unitButtons: GUI.Button[] = []
    private outerArc: Rectangle = new Rectangle;
    private innerArc: Rectangle = new Rectangle;
    private imagePlaceholder: Rectangle = new Rectangle;
    private client;
    private game;
    private infoPanel: Rectangle = new Rectangle;
    private boostPanel: Rectangle = new Rectangle;
    private unitStatesPanel: Rectangle = new Rectangle;
    private textElements: Map<string, GUI.TextBlock> = new Map();
    private animations: Animation[];
    private infoButton: GUI.Ellipse = new GUI.Ellipse;
    private nexusOpponentsPanel: GUI.Rectangle;

    private regionContainer: GUI.Rectangle;
    private regionText: GUI.TextBlock;
    private regionEmoji: GUI.TextBlock;
    private currentRegion: string = "FreeRoam"; // Default region
    // Color scheme
    private readonly PANEL_COLOR = "rgba(0, 40, 20, 0.8)";
    private readonly BUTTON_COLOR = "rgba(0, 40, 0, 0.8)";
    private readonly HIGHLIGHT_COLOR = "rgba(0, 80, 0, 0.9)";
    private readonly TEXT_COLOR = "rgba(0, 255, 0, 0.9)";
    private currentY: number = -250;
    private hideTimeout: number | null = null;
    private infoRows: Map<string, GUI.TextBlock> = new Map();
    private unitRows: Map<string, GUI.TextBlock> = new Map();
    private scoreRows: Map<string, GUI.TextBlock> = new Map();
    private supplyRows: Map<string, GUI.TextBlock> = new Map();
    constructor(scene: Scene,client: any,game: any,player: Player, getAccount:  () => AccountInterface | Account ,getGameState: () => GameState) {
        this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
        this.createTopBar();
        //this.createMainMenuButton();
        this.createMainMenuPanel();
        this.createUnitsPanel();
        this.createMarketplacePanel();
        this.createActionsPanel();
        this.createPlayerPanel();
        this.createOpponentsPanel();

        this.createDeployButton();
        this.createInfoButton();
        this.createUnitSelectionPanel();

        this.createArcs();
        this.client = client;
        this.game = game;
        this.player = player
        this.getAccount = getAccount;
        this.initializeInfoPanel();
        this.initializeUnitStatePanel();
        this.getGameState = getGameState;
        this.initializeBoostPanel();
        this.initializeBoxInfo();
        this.tutorialUI = new TutorialUI(scene);
        this.showPlayerScores();
        this.createOpponentsButton();
        this.createNexusOpponentsPanel();
        this.createRegionDisplay();
       
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

    private initializeBoxInfo(): void {
        if (!this.rect) {
            this.rect = new GUI.Rectangle();
            this.gui.addControl(this.rect);
            this.rect.width = "300px";
            this.rect.height = "200px";
            this.rect.thickness = 2;
            this.rect.linkOffsetX = "150px";
            this.rect.linkOffsetY = "-100px";
            this.rect.transformCenterX = 0;
            this.rect.transformCenterY = 1;
            this.rect.scaleX = 0;
            this.rect.scaleY = 0;
            this.rect.cornerRadius = 30;
            this.rect.thickness = 0;
    
            this.text = new GUI.TextBlock();
            this.text.textWrapping = true;
            this.text.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
            this.rect.addControl(this.text);
            this.text.paddingTop = "20px";
            this.text.paddingBottom = "20px";
            this.text.paddingLeft = "20px";
            this.text.paddingRight = "20px";
    
            // Setup animations
            const scaleXAnimation = new Animation(
                "scaleXAnimation",
                "scaleX",
                30,
                Animation.ANIMATIONTYPE_FLOAT,
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );
    
            const scaleYAnimation = new Animation(
                "scaleYAnimation",
                "scaleY",
                30,
                Animation.ANIMATIONTYPE_FLOAT,
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );
    
            const keys = [
                { frame: 0, value: 0 },
                { frame: 10, value: 1 }
            ];
    
            scaleXAnimation.setKeys(keys);
            scaleYAnimation.setKeys(keys);
            this.animations = [scaleXAnimation, scaleYAnimation];
        }
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

    private initializeBoostPanel() {
        this.boostPanel = new Rectangle("boostPanel");
        this.boostPanel.width = "150px";
        this.boostPanel.height = "150px";
        this.boostPanel.cornerRadius = 10;
        this.boostPanel.thickness = 0;
        this.boostPanel.background = this.PANEL_COLOR;
        this.boostPanel.alpha = 0.9;
        this.boostPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.boostPanel.left = "20px";
        this.boostPanel.isVisible = false;
    
        this.gui.addControl(this.boostPanel);
    }
    

    private initializeUnitStatePanel (){
        this.unitStatesPanel = new Rectangle("unitStatePanel");
        this.unitStatesPanel.width = "250px";
        this.unitStatesPanel.height = "300px";
        this.unitStatesPanel.cornerRadius = 10;
        this.unitStatesPanel.thickness = 0;
        this.unitStatesPanel.background = this.PANEL_COLOR;
        this.unitStatesPanel.alpha = 0.9;
        this.unitStatesPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.unitStatesPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.unitStatesPanel.left = "20px";
        this.unitStatesPanel.isVisible = false;
        
        this.gui.addControl(this.unitStatesPanel);
    }

    private showPlayerScores(): void {
        // Create main panel
        this.scorePanel = new GUI.Rectangle("scorePanel");
        this.scorePanel.width = "200px";
        this.scorePanel.height = "100px";
        this.scorePanel.cornerRadiusW = 10;
        this.scorePanel.cornerRadiusZ = 10;
        this.scorePanel.thickness = 0;
        this.scorePanel.background = this.PANEL_COLOR;
        this.scorePanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.scorePanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.scorePanel.left = "10px";
        this.scorePanel.top = "60px";
        
        // Create kills panel (top half)
        const killsPanel = new GUI.StackPanel("killsPanel");
        killsPanel.height = "50px";
        killsPanel.isVertical = false;
        killsPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        killsPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.scorePanel.addControl(killsPanel);

        // Kills emoji
        const killsEmoji = new GUI.TextBlock("killsEmoji");
        killsEmoji.text = "💥";
        killsEmoji.fontSize = 20;
        killsEmoji.width = "40px";
        killsEmoji.color = "white";
        killsEmoji.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        killsPanel.addControl(killsEmoji);

        // Kills text
        this.killsText = new GUI.TextBlock("killsText");
        this.killsText.text = "Kills: 0";
        this.killsText.fontSize = 16;
        this.killsText.width = "160px";
        this.killsText.color = "yellow";
        this.killsText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        killsPanel.addControl(this.killsText);

        // Create deaths panel (bottom half)
        const deathsPanel = new GUI.StackPanel("deathsPanel");
        deathsPanel.height = "50px";
        deathsPanel.isVertical = false;
        deathsPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        deathsPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.scorePanel.addControl(deathsPanel);

        // Deaths emoji
        const deathsEmoji = new GUI.TextBlock("deathsEmoji");
        deathsEmoji.text = "☠️";
        deathsEmoji.fontSize = 20;
        deathsEmoji.width = "40px";
        deathsEmoji.color = "white";
        deathsEmoji.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        deathsPanel.addControl(deathsEmoji);

        // Deaths text
        this.deathsText = new GUI.TextBlock("deathsText");
        this.deathsText.text = "Deaths: 0";
        this.deathsText.fontSize = 16;
        this.deathsText.width = "160px";
        this.deathsText.color = "red";
        this.deathsText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        deathsPanel.addControl(this.deathsText);

        // Add to GUI
        this.gui.addControl(this.scorePanel);
        // Update with initial player data if available
    }


    public updateKills(kills: number): void {
        this.kills = kills;
        this.killsText.text = `Kills: ${this.kills}`;
    }
    
    public updateDeaths(deaths: number): void {
        this.deaths = deaths;
        this.deathsText.text = `Deaths: ${this.deaths}`;
    }

    private createRegionDisplay(): void {
        // Create container rectangle
        this.regionContainer = new GUI.Rectangle();
        this.regionContainer.width = "200px";
        this.regionContainer.height = "50px";
        this.regionContainer.cornerRadiusW = 10;
        this.regionContainer.cornerRadiusZ = 10;
        this.regionContainer.color = "white";
        this.regionContainer.thickness = 0;
        this.regionContainer.background = this.PANEL_COLOR;
        this.regionContainer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.regionContainer.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.regionContainer.top = "160px";
        this.regionContainer.left = "10px";
        this.gui.addControl(this.regionContainer);

        // Create emoji display
        this.regionEmoji = new GUI.TextBlock();
        this.regionEmoji.text = "🌍"; // Default neutral emoji
        this.regionEmoji.color = "white";
        this.regionEmoji.fontSize = 24;
        this.regionEmoji.width = "30px";
        this.regionEmoji.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.regionEmoji.left = "10px";
        this.regionContainer.addControl(this.regionEmoji);

        // Create region text
        this.regionText = new GUI.TextBlock();
        this.regionText.text = this.currentRegion;
        this.regionText.color = "rgb(0, 255, 255)"

        this.regionText.fontSize = 18;
        this.regionText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.regionText.left = "20px";
        this.regionContainer.addControl(this.regionText);

        // Initialize with default region
        this.updateRegion(this.currentRegion);
    }


    public updateRegion(regionName: string): void {
        // Update current region
        this.currentRegion = regionName;
        
        // Update text display
        this.regionText.text = regionName;
        
        // Apply a simple animation effect for the update
        const animation = new Animation(
            "regionChangeAnimation",
            "scaleX",
            30,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CYCLE
        );
        
        const keys = [
            { frame: 0, value: 1 },
            { frame: 15, value: 1.1 },
            { frame: 30, value: 1 }
        ];
        
        animation.setKeys(keys);
        this.regionContainer.animations = [animation];
        
        // Start the animation
        this.gui.getScene().beginAnimation(this.regionContainer, 0, 30, false);
        
        console.log(`Region updated to: ${regionName}`);
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

    // private createTopBar(): void {
    //     const topBar = this.createPanel("100%", "50px");
    //     topBar.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    //     topBar.isVisible = true;
    //     this.gui.addControl(topBar);
    
    //     // Create a StackPanel for the left side (Turn Info and Base/Rank)
    //     let leftPanel = new GUI.StackPanel();
    //     leftPanel.isVertical = false;
    //     leftPanel.height = "50px";
    //     leftPanel.width = "700px";
    //     leftPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    
    //     // Turn Info Panel
    //     let turnInfoPanel = new GUI.StackPanel();
    //     turnInfoPanel.isVertical = false;
    //     turnInfoPanel.height = "50px";
    //     turnInfoPanel.width = "200px";
    
    //     let playerImage = new GUI.Image("playerIcon", "/logo.png");
    //     playerImage.width = "40px";
    //     playerImage.height = "40px";
    //     playerImage.paddingLeft = '4px';
    
    //     this.turnInfoText = new GUI.TextBlock();
    //     this.turnInfoText.text = "Player";
    //     this.turnInfoText.width = '80px';
    //     this.turnInfoText.color = this.TEXT_COLOR;
    //     this.turnInfoText.fontSize = 20;
    //     this.turnInfoText.paddingLeft = '10px';
    
    //     turnInfoPanel.addControl(playerImage);
    //     turnInfoPanel.addControl(this.turnInfoText);
    
    //     // Base and Rank Panel
    //     let baseRankPanel = new GUI.StackPanel();
    //     baseRankPanel.isVertical = false;
    //     baseRankPanel.height = "50px";
    //     baseRankPanel.width = "200px";
    //     baseRankPanel.paddingLeft = '20px';
    
    //     let baseImage = new GUI.Image("baseIcon", "/images/base.png");
    //     baseImage.width = "30px";
    //     baseImage.height = "30px";
    
    //     this.baseText = new GUI.TextBlock();
    //     this.baseText.text = 'Base Name';
    //     this.baseText.color = 'blue';
    //     this.baseText.fontSize = 15;
    //     this.baseText.width = '100px';
    //     this.baseText.paddingLeft = '10px';

    //     baseRankPanel.addControl(baseImage);
    //     baseRankPanel.addControl(this.baseText);

    //     // Base and Rank Panel
    //     let rankPanel = new GUI.StackPanel();
    //     rankPanel.isVertical = false;
    //     rankPanel.height = "50px";
    //     rankPanel.width = "350px";
    //     rankPanel.paddingLeft = '20px';

    //     let rankImage = new GUI.Image("baseIcon", "/images/recruit.jpg");
    //     rankImage.width = "30px";
    //     rankImage.height = "30px";
    
    //     this.rankText = new GUI.TextBlock();
    //     this.rankText.text = 'Rank';
    //     this.rankText.color = 'orange';
    //     this.rankText.fontSize = 15;
    //     this.rankText.width = '100px';
    //     this.rankText.paddingLeft = '10px';
    

    //     rankPanel.addControl(rankImage);
    //     rankPanel.addControl(this.rankText);
    
    //     // Add Turn Info and Base/Rank panels to the left panel
    //     leftPanel.addControl(turnInfoPanel);
    //     leftPanel.addControl(baseRankPanel);
    //     leftPanel.addControl(rankPanel);
    
    //     // Add the left panel to the top bar
    //     topBar.addControl(leftPanel);
    
    //     // Create and add the End Turn button
    //     const endTurnBtn = this.createButton("endTurn", "End Turn");
    //     endTurnBtn.width = "120px";
    //     endTurnBtn.height = "40px";
    //     endTurnBtn.cornerRadius = 5;
    //     endTurnBtn.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    //     endTurnBtn.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    //     endTurnBtn.left = "-10px";
    //     endTurnBtn.onPointerUpObservable.add(() => {
    //         //console.log("End Turn clicked");
    //         // Add your end turn logic here
    //     });
    //     topBar.addControl(endTurnBtn);
    // }
    
    private createTopBar(): void {
        // const topBar = this.createPanel("100%", this.config.HEIGHT);
        // topBar.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        // topBar.zIndex = 100;
        // this.gui.addControl(topBar);

        const topBar = this.createPanel("100%", this.config.HEIGHT);
        topBar.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        topBar.isVisible = true;
        this.gui.addControl(topBar);

        // Left container for player info, base, rank
        const leftContainer = new GUI.StackPanel();
        leftContainer.isVertical = false;
        leftContainer.height = this.config.HEIGHT;
        leftContainer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        leftContainer.paddingLeft = "10px";

        // Player Info Section
        const playerSection = this.createInfoSection(
            "playerIcon",
            "👨‍✈️",
            "Player",
            "#E5E7EB",
            "player-text"
        );
        
        // Base Section
        const baseSection = this.createInfoSection(
            "base",
            "⛺",
            "Base Name",
            "#93C5FD",
            "base-text"
        );

        // Rank Section
        const rankSection = this.createInfoSection(
            "rank",
            "🎖️",
            "0",
            "#FCD34D",
             "rank-text"
        );

        // Rank Section
        const boostSection = this.createInfoSection(
            "boost",
            "⚡",
            "0",
            "#FCD34D",
            "boost-text"
        );

        // Rank Section
        const commandsSection = this.createInfoSection(
            "commands",
            "⌨️",
            "0",
            "#FCD34D",
            "commands-text"
        );

        // Rank Section
        const turnSection = this.createInfoSection(
            "turns",
            "",
            "🔴",
            "#FCD34D",
            "turn-text"
        );


                        // Rank Section
        const flagSection = this.createInfoSection(
            "flag",
            "🏁",
            "Captured",
            "#FCD34D",
            "flag-text"
        );


        // Rank Section
        const scoreSection = this.createInfoSection(
            "score",
            "🔢",
            "Score",
            "#FCD34D",
            "score-text"
        );

        // // Center container for score and commands
        // const centerContainer = new GUI.StackPanel();
        // centerContainer.isVertical = false;
        // centerContainer.height = this.config.HEIGHT;
        // centerContainer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        // centerContainer.width = "500px";

        // Create score and commands text blocks directly
        // this.scoreText = new GUI.TextBlock();
        // this.scoreText.text = "Score: 0";
        // this.scoreText.color = "#10B981";
        // this.scoreText.fontSize = 18;
        // this.scoreText.width = "180px";
        // this.scoreText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

        // this.commandsText = new GUI.TextBlock();
        // this.commandsText.text = "Commands: 3";
        // this.commandsText.color = "#10B981";
        // this.commandsText.fontSize = 18;
        // this.commandsText.width = "180px";
        // this.commandsText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

        // Add sections to containers
        leftContainer.addControl(playerSection);
        leftContainer.addControl(baseSection);
        leftContainer.addControl(rankSection);
        leftContainer.addControl(flagSection);
        leftContainer.addControl(boostSection);
        leftContainer.addControl(scoreSection);
        leftContainer.addControl(commandsSection);
        leftContainer.addControl(turnSection);

        // centerContainer.addControl(this.scoreText);
        // centerContainer.addControl(this.commandsText);

        this.turnInfoText = new GUI.TextBlock();
        this.turnInfoText.text = "Player";
        this.turnInfoText.width = '100px';
        this.turnInfoText.color = "#10B981";
        this.turnInfoText.fontSize = 20;
        this.turnInfoText.textHorizontalAlignment =GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

       // centerContainer.addControl(this.turnInfoText);
        // End Turn Button
        const endTurnBtn = this.createEndTurnButton();

        // Add all containers to top bar
        topBar.addControl(leftContainer);
        //topBar.addControl(centerContainer);
        topBar.addControl(endTurnBtn);
    }

    private createInfoSection(emojiName: string, emoji: string, defaultText: string, textColor: string, textId: string): GUI.StackPanel {
        const section = new GUI.StackPanel();
        section.isVertical = false;
        section.height = "100%";
        section.width = "150px";
        section.paddingRight = "30px";
    
        // Create emoji text block instead of image
        const emojiText = new GUI.TextBlock(emojiName);
        emojiText.text = emoji;  // e.g. "🚩", "⚡", "🎯"
        emojiText.fontSize = 24; // Might need to adjust size
        emojiText.width = "30px";
        emojiText.height = "30px";
        emojiText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        
        const text = new GUI.TextBlock();
        text.text = defaultText;
        text.color = textColor;
        text.fontSize = 16;
        text.paddingLeft = "10px";
        text.width = "150px";
        text.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    
        console.log(this.textElements, textId, text);
        this.textElements.set(textId, text);
    
        section.addControl(emojiText);
        section.addControl(text);
    
        return section;
    }

        // Method to update text
        public updateText(textId: string, newText: string): void {
            const textElement = this.textElements.get(textId);
            if (textElement) {
                textElement.text = newText;
            } else {
                console.warn(`Text element with ID ${textId} not found`);
            }
        }

    private createEndTurnButton(): GUI.Button {
        const button = GUI.Button.CreateSimpleButton("endTurn", "End Turn");
        button.width = "120px";
        button.height = "40px";
        button.color = this.config.TEXT_COLOR;
        button.background = this.BUTTON_COLOR;
        button.cornerRadius = 5;
        button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        button.left = "-20px";

        // Hover effects
        button.onPointerEnterObservable.add(() => {
            button.background = this.config.HOVER_COLOR;
        });
        button.onPointerOutObservable.add(() => {
            button.background = this.config.ACCENT_COLOR;
        });

        button.onPointerUpObservable.add(async () => {
            //console.log("End Turn clicked");
            // Add your end turn logic here
            //fn force_end_player_turn (ref self: TContractState, game_id: u32,target_player_index: u32);
            //forceEndPlayerTurn

            const result  = await (await this.client).nexus.forceEndPlayerTurn(this.getAccount(), this.getGameState().game.game_id)
                        
            //console.log(result)

            if (result && result.transaction_hash){
             this.showToastSide(`Turn Switched`, ToastType.Success);
            }else{
             const errorMessage = StarknetErrorParser.parseError(result);
             //console.log(errorMessage)
             this.showToastSide(errorMessage,ToastType.Error)
            }
            
        });

        return button;
    }

    // Public methods to update the display
    public updateScore(score: number): void {
        this.scoreText.text = `Score: ${score}`;
    }

    public updateCommands(remaining: number): void {
        this.commandsText.text = `Commands: ${remaining}`;
    }


    public updateBase(name: string): void {
        this.baseText.text = name;
    }

    public updateRank(rank: string): void {
        this.rankText.text = rank;
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
        this.turnInfoText.text = `${text}`;
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

        const fields = ["Deaths", "Kills", "Score"];
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

        

       this.baseText.text = playerData.home_base as unknown as string
       this.rankText.text = getBannerLevelString(Number(playerData.rank))
        
        Object.entries(playerData).forEach(([key, value]) => {
            //console.log(this.infoRows.has(key))
            if (this.infoRows.has(key)) {
                this.infoRows.get(key)!.text = value.toString();
                
            }
        });

        if (playerData.player_score) {
            Object.entries(playerData.player_score).forEach(([key, value]) => {
                //console.log(playerData.player_score)
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
        //console.log("Creating card for opponent:", opponent);
    
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
    
        //console.log(`Card created for ${opponent.name} with ${contentStack.children.length} content items`);
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
    
        //console.log(`Added info row: ${label} - ${value}`);
    }
    
    private addScoreItem(grid: GUI.Grid, label: string, value: number | undefined, row: number, column: number): void {
        const container = new GUI.StackPanel();
        container.height = "100%";
        grid.addControl(container, row, column);
    
        const labelText = this.createTextBlock(label, 12);
        container.addControl(labelText);
    
        const valueText = this.createTextBlock(value?.toString() || "N/A", 14);
        container.addControl(valueText);
    
        //console.log(`Added score item: ${label} - ${value}`);
    }
    
    private addSupplyItem(grid: GUI.Grid, label: string, value: number | undefined, row: number, column: number): void {
        const container = new GUI.StackPanel();
        container.height = "100%";
        grid.addControl(container, row, column);
    
        const labelText = this.createTextBlock(label, 12);
        container.addControl(labelText);
    
        const valueText = this.createTextBlock(value?.toString() || "N/A", 14);
        container.addControl(valueText);
    
        //console.log(`Added supply item: ${label} - ${value}`);
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
        innerCircle.hoverCursor = "pointer";
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

    private createInfoButton(): void {
        // Outer circle
        const outerCircle = new GUI.Ellipse();
        outerCircle.width = "40px";
        outerCircle.height = "40px";
        outerCircle.thickness = 2;
        outerCircle.color = "green";  // Info blue color
        outerCircle.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        outerCircle.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        outerCircle.top = "70px";
        outerCircle.left = "-30px";
        this.gui.addControl(outerCircle);
    
        // Middle circle
        const middleCircle = new GUI.Ellipse();
        middleCircle.width = 0.9;
        middleCircle.height = 0.9;
        middleCircle.background = "black";  // Dark blue-gray
        middleCircle.thickness = 0;
        outerCircle.addControl(middleCircle);
    
        // Inner circle
        const innerCircle = new GUI.Ellipse();
        innerCircle.width = 0.7;
        innerCircle.height = 0.7;
        innerCircle.thickness = 0;
        innerCircle.background = "green";  // Lighter blue
        innerCircle.hoverCursor = "pointer";
        middleCircle.addControl(innerCircle);
    
        // "i" Text
        const infoText = new GUI.TextBlock();
        infoText.text = "i";
        infoText.color = "white";
        infoText.fontSize = 20;
        infoText.fontStyle = "bold";
        innerCircle.addControl(infoText);
    
        // Interactivity
        outerCircle.isPointerBlocker = true;
        outerCircle.onPointerUpObservable.add(() => {
            this.tutorialUI.showInfo(guideContent as any);  // Call showInfo method when clicked
            // Click feedback
            innerCircle.background = "rgba(0, 40, 20, 0.8)";  // Darker blue on click
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
    
        this.infoButton = outerCircle;
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

        if (unit === UnitType.Air || unit === UnitType.Cyber || unit === UnitType.Naval || unit === UnitType.Armored){
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
        //console.log(`Selected unit: ${unitType}. Click on the map to deploy.`);
        // Here you would change the cursor and highlight valid deployment areas
    }

    public handleMapClick(position: Vector3): void {
        if (this.isDeploymentMode && this.selectedUnit) {
            //console.log(`Deploying ${this.selectedUnit} at position: ${position}`);
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
        console.log("hgsdgsjfh")
    }

    public getDeploymentMode(): boolean{
        return this.isDeploymentMode
    }

    public showActionsMenu(unitType: UnitType) {
        this.clearButtons(); // Clear existing buttons

    // Fetch abilities based on the unitType
    const abilities = getUnitAbilities(unitType);
    const availableAbilities = Object.entries(abilities)
        .filter(([_, level]) => level > 0)
        .map(([ability, _]) => ability as keyof typeof AbilityType);

    // Emoji mappings
    const abilityEmojis: { [key: string]: string } = {
        attack: "⚔️",
        defend: "🛡️",
        patrol: "👁️",
        stealth: "🌑",
        recon: "🔭",
        repair: "🔧",
        airlift: "🚁",
        bombard: "💥",
        submerge: "🌊",
        hack: "💻"
    };

    // Layout properties
    const numButtons = availableAbilities.length;
    const buttonSize = "80px";
    const padding = 15; // Padding between buttons
    const containerHeight = "120px";
    const containerWidth = `${numButtons * (parseInt(buttonSize) + padding + 5)}px`;

    // Create container
    const container = new Rectangle("menu-container");
    container.width = containerWidth;
    container.height = containerHeight;
    container.color = "white";
    container.thickness = 2;
    container.color ="rgba(0, 120, 60, 0.9)";
    container.background = "rgba(80, 80, 80, 0.9)";
    container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    container.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    container.top = "-50px";
    container.cornerRadius = 15;

    // Add the container first
    this.gui.addControl(container);
     // Add to unitButtons for cleanup

    availableAbilities.forEach((ability, index) => {
        //console.log(ability)
        const abilityEnum = abilityStringToEnum(ability.charAt(0).toUpperCase() + ability.slice(1));

        //console.log(abilityEnum)
        
        // Create button with emoji and text
        const buttonText = `${abilityEmojis[ability.toLowerCase()] || '❓'} ${ability}`;
        const button = Button.CreateSimpleButton(ability, buttonText);

        // Button style
        button.width = buttonSize;
        button.height = "60px";
        button.color = "white";
        button.thickness = 0;
        button.background = "rgba(50, 50, 50, 0.9)";
        button.hoverCursor = "pointer";
        button.cornerRadius = 15;

        if (button.textBlock) {
            button.textBlock.fontSize = 16;
            button.textBlock.fontFamily = "Arial";
            button.textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        }

        // Calculate position within container
        const totalWidth = numButtons * (parseInt(buttonSize) + padding);
        const startX = -totalWidth / 2 + parseInt(buttonSize) / 2;
        const xPosition = startX + index * (parseInt(buttonSize) + padding);
        
        button.left = `${xPosition}px`;
        button.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

        // Add hover effect
        button.onPointerEnterObservable.add(() => {
            button.background = "rgba(0, 120, 60, 0.9)";
        });

        button.onPointerOutObservable.add(() => {
            button.background = "rgba(50, 50, 50, 0.9)";
        });
    
            // Handle click event
            button.onPointerUpObservable.add(async () => {
                //console.log(`${ability} ability used`);
                this.abilityMode = abilityStringToEnum(ability.charAt(0).toUpperCase() + ability.slice(1));
                //console.log(this.abilityMode)
                switch (this.abilityMode) {
                    case AbilityType.Hack:
                        //console.log("Executing hacking protocol...");
                        break;
                    case AbilityType.Attack as any:
                        //console.log("Engaging in combat...");
                        break;
                    case AbilityType.Defend:
                        //console.log("Raising defenses...");

                        //console.log(this.getSelectedUnitInfo())

                        const encodedPositionDefend= positionEncoder(this.getSelectedUnitInfo().visualMesh.position);
                        const unitIdDefend = this.getSelectedUnitInfo().visualMesh.metadata.UnitData.unit_id
                        const unitTypeDefend = 1

                        //console.log(encodedPositionDefend);

                        //const nexus_defend = async (snAccount: Account, gameId: number, unitId: number, unitType: number, x: number, y: number, z: number) 

                       const resultDefend  = await (await this.client).nexus.defend(this.getAccount(), this.getGameState().game.game_id, unitIdDefend, unitTypeDefend, encodedPositionDefend.x,encodedPositionDefend.y,encodedPositionDefend.z)
                        
                       //console.log(resultDefend)

                       if (resultDefend && resultDefend.transaction_hash){
                        this.showToastSide(`Unit  Defending`, ToastType.Success);
                       }else{
                        const errorMessage = StarknetErrorParser.parseError(resultDefend);
                        //console.log(errorMessage)
                        this.showToastSide(errorMessage,ToastType.Error)
                       }

                        break;
                    case AbilityType.Patrol:
                        //console.log("Initiating patrol...");

                        //console.log(this.getSelectedUnitInfo())

                        const encodedPosition= positionEncoder(this.getSelectedUnitInfo().visualMesh.position);
                        const unitId = this.getSelectedUnitInfo().visualMesh.metadata.UnitData.unit_id
                        const unitType = 1

                        //console.log(encodedPosition);

                        //const nexus_patrol = async (snAccount: Account, gameId: number, unitId: number, unitType: number, startX: number, startY: number, startZ: number) => {

                       const result  = await (await this.client).nexus.patrol(this.getAccount(), this.getGameState().game.game_id, unitId, unitType, encodedPosition.x,encodedPosition.y,encodedPosition.z)
                        
                       //console.log(result)

                       if (result && result.transaction_hash){
                        this.showToastSide(`Unit ${unitId} Patrolling`, ToastType.Success);
                       }else{
                        const errorMessage = StarknetErrorParser.parseError(result);
                        //console.log(errorMessage)
                        this.showToastSide(errorMessage,ToastType.Error)
                       }

                        break;
                    case AbilityType.Stealth:
                        //console.log("Entering stealth mode...");

                        //console.log(this.getSelectedUnitInfo())

                        const encodedPositionStealth= positionEncoder(this.getSelectedUnitInfo().visualMesh.position);
                        const unitIdStealth = this.getSelectedUnitInfo().visualMesh.metadata.UnitData.unit_id
                        const unitTypeStealth = 1

                        //console.log(encodedPositionStealth);

                        //const nexus_stealth = async (snAccount: Account, gameId: number, unitId: number, unitType: number, x: number, y: number, z: number) 

                       const resultStealth  = await (await this.client).nexus.stealth(this.getAccount(), this.getGameState().game.game_id, unitIdStealth, unitTypeStealth, encodedPositionStealth.x,encodedPositionStealth.y,encodedPositionStealth.z)
                        
                       //console.log(resultStealth)

                       if (resultStealth && resultStealth.transaction_hash){
                        this.showToastSide(`Unit ${unitIdStealth} In stealth`, ToastType.Success);
                       }else{
                        const errorMessage = StarknetErrorParser.parseError(resultStealth);
                        //console.log(errorMessage)
                        this.showToastSide(errorMessage,ToastType.Error)
                       }
                        break;
                    case AbilityType.Recon:
                        //console.log("Performing reconnaissance...");
                        break;
                    case AbilityType.Repair:
                        //console.log("Starting repairs...");
                        break;
                    case AbilityType.Airlift:
                        //console.log("Preparing for airlift...");
                        break;
                    case AbilityType.Bombard:
                        //console.log("Launching bombardment...");
                        break;
                    case AbilityType.Submerge:
                        //console.log("Submerging...");
                        break;
                    default:
                        //console.error("Unknown ability!");
                }
            
            });

            this.unitButtons.push(button);
    
            container.addControl(button);
            this.unitButtons.push(button);
        });
    
        //console.log("Actions menu displayed");
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
        //console.log(this.abilityMode)
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


public showToastSide(message: string, toastType: ToastType = ToastType.Info): void {
    // Create a background panel for the toast
    const toastPanel = new GUI.Rectangle();
    toastPanel.width = "300px";  // Narrower for side display
    toastPanel.height = "80px";
    toastPanel.cornerRadius = 10;
    toastPanel.color = "white";  // Border color
    toastPanel.thickness = 0;    // Border thickness
    toastPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT; // Changed to RIGHT
    toastPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    toastPanel.paddingRight = "20px"; // Right padding instead of bottom
    toastPanel.paddingTop = "20px";   // Add top padding

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
    toastText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Changed to LEFT
    toastText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    toastText.textWrapping = true; // Enable text wrapping
    toastText.paddingLeft = "15px"; // Add some padding for text
    toastText.paddingRight = "15px";

    // Add the text block to the panel
    toastPanel.addControl(toastText);

    // Add the panel to the GUI
    this.gui.addControl(toastPanel);

    // Use the same animation function
    this.animateToast(toastPanel);
}



    // private kickPlayer = async (player_index: number, game_id: number) => {
    //     try {
    //     //   setKickLoading(true);
    //       const result  = await this.arena.kick(this.getAccount(), game_id, player_index);
    //     } catch (error: any) {
    //       this.showToast(error.message);
    //     } finally {
          
    //     }
    //   };

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
        this.gui.getScene()?.beginDirectAnimation(panel, [fadeIn], 0, 20, false, 1, () => {
            setTimeout(() => {
                this.gui.getScene()?.beginDirectAnimation(panel, [fadeOut], 0, 30, false, 1, () => {
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

    public showBooststOptions(agent: Agent, player: Player, ability_state: AbilityState): void {
        this.clearBoostPanel();
        const stack = this.createBoostBasePanel();

        // Create button container
        const buttonContainer = new StackPanel();
        buttonContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        buttonContainer.height = "100px";
        buttonContainer.spacing = 10;
        stack.addControl(buttonContainer);


        const encodedPosition= positionEncoder(agent.visualMesh.position);
        const unitId = agent.visualMesh.metadata.UnitData.unit_id
        const unitType = 1

        // Heal Button
        const healButton = Button.CreateSimpleButton("healBtn", "💚Heal");
        healButton.width = "120px";
        healButton.height = "40px";
        healButton.color = "white";
        healButton.background = "green";
        healButton.thickness = 0;
        healButton.hoverCursor = "pointer";
        healButton.onPointerClickObservable.add(async () => {
            if (Number(player.booster) > 0 && Number(ability_state.units_abilities_state.repair_level) > 0) {
                //fn heal(ref self: TContractState, game_id: u32, unit_id: u32, unit_type:u8,area_x: u256, area_y: u256, area_z: u256);
            
 
                const resultHeal  = await (await this.client).nexus.heal(this.getAccount(), this.getGameState().game.game_id, unitId, unitType, encodedPosition.x,encodedPosition.y,encodedPosition.z);
                        
                //console.log(resultStealth)

                if (resultHeal && resultHeal.transaction_hash){
                 this.showToastSide(`Unit ${unitId} Healing`, ToastType.Success);
                }else{
                 const errorMessage = StarknetErrorParser.parseError(resultHeal);
                 //console.log(errorMessage)
                 this.showToastSide(errorMessage,ToastType.Error)
                }
            
            }
        });
        healButton.onPointerEnterObservable.add(() => {
            healButton.background = "rgba(0, 120, 60, 0.9)";
        });

        healButton.onPointerOutObservable.add(() => {
            healButton.background = "green";
        });
        healButton.isEnabled = Number(player.booster) > 0 && Number(ability_state.units_abilities_state.repair_level) ? true : false;
        buttonContainer.addControl(healButton);

        // Boost Button
        const boostButton = Button.CreateSimpleButton("boostBtn", "⚡Boost");
        boostButton.width = "120px";
        boostButton.height = "40px";
        boostButton.color = "white";
        boostButton.background = "blue";
        boostButton.thickness = 0;
        boostButton.hoverCursor = "pointer";
        boostButton.onPointerClickObservable.add(async () => {
            if (Number(player.booster) > 0 && Number(ability_state.units_abilities_state.repair_level) > 0) {
                //fn boost(ref self: TContractState, game_id: u32, unit_id: u32, unit_type:u8,area_x: u256, area_y: u256, area_z: u256);
                const resultBoost  = await (await this.client).nexus.boost(this.getAccount(), this.getGameState().game.game_id, unitId, unitType, encodedPosition.x,encodedPosition.y,encodedPosition.z);
                        
                //console.log(resultStealth)

                if (resultBoost && resultBoost.transaction_hash){
                 this.showToastSide(`Unit ${unitId} Boost`, ToastType.Success);
                }else{
                 const errorMessage = StarknetErrorParser.parseError(resultBoost);
                 //console.log(errorMessage)
                 this.showToastSide(errorMessage,ToastType.Error)
                }

            
            }
        });
        boostButton.isEnabled = Number(player.booster) > 0 && Number(ability_state.units_abilities_state.repair_level) ? true : false;
        buttonContainer.addControl(boostButton);
           
    
        this.boostPanel.isVisible = true;
      }
    
    public showInfantryInfo(infantry: Infantry): void {
        this.clearPanel();
        const stack = this.createBasePanel("/images/unit2.png", "");
    
        // Critical infantry stats with icons
        this.addStatRow(stack, "/images/health.png",'HP',`${infantry.health.current}/${infantry.health.current}`);
        this.addStatRow(stack, "/images/energy.png",'EN' ,infantry.energy.toString());
        this.addStatRow(stack, "/images/accuracy.png", 'ACC',`${infantry.accuracy}%`);
        this.addStatRow(stack, "/images/range.png",'Range' ,`${parseInt(infantry.range.toString())}m`);
    
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

      private createBoostBasePanel(): StackPanel {
        const stack = new StackPanel();
        stack.width = "100%";
        stack.background = this.PANEL_COLOR;
        
        this.boostPanel.addControl(stack);
        return stack;
      }

      private createBasePanelSate(iconPath: string, unitType: string): StackPanel {
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
    
        this.unitStatesPanel.addControl(stack);
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

    private addStatRowStates(parent: GUI.StackPanel, iconPath: string, label: string, value: string): void {
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
        icon.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        row.addControl(icon);
        
        // Label text
        const labelText = new TextBlock();
        labelText.text = label;
        labelText.color = "#88ff88"; // or whatever color you prefer
        labelText.fontSize = 14;
        labelText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        labelText.verticalAlignment =   Control.VERTICAL_ALIGNMENT_BOTTOM;
        labelText.left = "30px"; // Space after icon
        row.addControl(labelText);
        
        // Value text
        const valueText = new TextBlock();
        valueText.text = value;
        valueText.color = "#ffffff";
        valueText.fontSize = 14;
        valueText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        valueText.verticalAlignment  = Control.VERTICAL_ALIGNMENT_BOTTOM;
        row.addControl(valueText);
        
        parent.addControl(row);
    }

    public showUnitStateInfo(unitState: UnitState): void {
        this.clearUnitStatePanel();
        const stack = this.createBasePanelSate("/images/unit_state.png", "");

        // Position group
       // this.addStatRow(stack, "/images/location.png", 'Position', `${unitState.x.toFixed(1)}, ${unitState.y.toFixed(1)}, ${unitState.z.toFixed(1)}`);
        
        // Unit identifiers
        console.log("csdsdsdsdsdsdsd",unitState)
        this.addStatRowStates(stack, "/images/id.png", 'Unit ID', `#${unitState.unit_id}`);
        this.addStatRowStates(stack, "/images/player.png", 'Player', `#${unitState.player_id}`);
        

        
        
        // Mode info with colored indicator
        this.addStatRowStates(stack, this.getModeIcon(unitState.mode), 'Mode', unitState.mode as unknown as string);

        // // Environment group
        // const envTitle = new GUI.TextBlock();
        // envTitle.text = "Environment";
        // envTitle.color = "#88ff88";
        // envTitle.fontSize = 16;
        // envTitle.height = "25px";
        // envTitle.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        // envTitle.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        // envTitle.paddingLeft = "10px";
        // stack.addControl(envTitle);

        // this.addStatRowStates(stack, "/images/terrain.png", 'Terrain', this.formatTerrain(unitState.environment.terrain));
        // this.addStatRowStates(stack, "/images/cover.png", 'Cover', `Level ${unitState.environment.cover_level}`);
        // this.addStatRowStates(stack, "/images/elevation.png", 'Elevation', `${unitState.environment.elevation}m`);

        this.unitStatesPanel.isVisible = true;
    }


    

    private getModeIcon(mode: UnitModeEnum): string {
        const modeValue = mode as unknown as string;
    
        const iconMap: { [key: string]: string } = {
            'Idle': "/images/idle.png",
            'Moving': "/images/moving.png",
            'Attacking': "/images/attacking.png",
            'Defending': "/images/defending.png",
            'Patrolling': "/images/patrolling.png",
            'Stealthed': "/images/stealth.png",
            'Reconning': "/images/recon.png",
            'Healing': "/images/healing.png",
            'Retreating': "/images/retreat.png",
            'Repairing': "/images/repair.png",
        };
    
        return iconMap[modeValue] || "/images/unknown.png"
    }

    public showAbilityInfo(abilityState: AbilityState): void {
        this.clearPanel();
        const stack = this.createBasePanel(
            this.getUnitTypeIcon(abilityState.unit as UnitTypeEnum),
            `${(abilityState.unit as UnitTypeEnum).activeVariant()} Unit`
        );

        // Status header
        this.addStatusRow(stack, abilityState.is_active, Number(abilityState.cooldown));

        // Only show abilities with level > 0
        const abilities = abilityState.units_abilities_state;
        const abilityRows = [
            { name: 'Move', level: abilities.move_level, icon: '/images/move.png' },
            { name: 'Attack', level: abilities.attack_level, icon: '/images/attack.png' },
            { name: 'Defend', level: abilities.defend_level, icon: '/images/defend.png' },
            { name: 'Patrol', level: abilities.patrol_level, icon: '/images/patrol.png' },
            { name: 'Stealth', level: abilities.stealth_level, icon: '/images/stealth.png' },
            { name: 'Recon', level: abilities.recon_level, icon: '/images/recon.png' },
            { name: 'Hack', level: abilities.hack_level, icon: '/images/hack.png' },
            { name: 'Repair', level: abilities.repair_level, icon: '/images/repair.png' },
            { name: 'Airlift', level: abilities.airlift_level, icon: '/images/airlift.png' },
            { name: 'Bombard', level: abilities.bombard_level, icon: '/images/bombard.png' },
            { name: 'Submerge', level: abilities.submerge_level, icon: '/images/submerge.png' }
        ].filter(ability => Number(ability.level) > 0);

        // Add abilities with level bars
        abilityRows.forEach(ability => {
            this.addAbilityRow(stack, ability.icon, ability.name, Number(ability.level));
        });

        // Add effectiveness indicator at the bottom
        this.addEffectivenessBar(stack, Number(abilityState.effectiveness));

        this.infoPanel.isVisible = true;
    }

    private addStatusRow(parent: GUI.StackPanel, isActive: boolean, cooldown: number): void {
        const row = new GUI.Rectangle();
        row.height = "35px";
        row.thickness = 0;
        row.background = this.PANEL_COLOR;
        row.paddingLeft = "10px";
        row.paddingRight = "15px";

        // Status indicator
        const statusText = new GUI.TextBlock();
        statusText.text = isActive ? "ACTIVE" : "INACTIVE";
        statusText.color = isActive ? this.ACTIVE_COLOR : this.INACTIVE_COLOR;
        statusText.fontSize = 16;
        statusText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        row.addControl(statusText);

        // Cooldown if applicable
        if (cooldown > 0) {
            const cooldownText = new GUI.TextBlock();
            cooldownText.text = `Cooldown: ${cooldown}s`;
            cooldownText.color = this.COOLDOWN_COLOR;
            cooldownText.fontSize = 16;
            cooldownText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            row.addControl(cooldownText);
        }

        parent.addControl(row);
    }

    private addAbilityRow(parent: GUI.StackPanel, iconPath: string, abilityName: string, level: number): void {
        const row = new GUI.Rectangle();
        row.height = "45px";
        row.thickness = 0;
        row.background = this.PANEL_COLOR;
        row.paddingLeft = "10px";
        row.paddingRight = "15px";

        // Ability icon
        const icon = new GUI.Image("abilityIcon", iconPath);
        icon.width = "25px";
        icon.height = "25px";
        icon.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        row.addControl(icon);

        // Ability name
        const nameText = new GUI.TextBlock();
        nameText.text = abilityName;
        nameText.color = "#88ff88";
        nameText.fontSize = 14;
        nameText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        nameText.left = "35px";
        row.addControl(nameText);

        // Level bar background
        const levelBarBg = new GUI.Rectangle();
        levelBarBg.width = "100px";
        levelBarBg.height = "8px";
        levelBarBg.background = "#333333";
        levelBarBg.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        levelBarBg.cornerRadius = 4;
        row.addControl(levelBarBg);

        // Level bar fill
        const levelBarFill = new GUI.Rectangle();
        levelBarFill.width = `${level}px`;
        levelBarFill.height = "8px";
        levelBarFill.background = this.getLevelColor(level);
        levelBarFill.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        levelBarFill.cornerRadius = 4;
        levelBarBg.addControl(levelBarFill);

        // Level number
        const levelText = new GUI.TextBlock();
        levelText.text = level.toString();
        levelText.color = "#ffffff";
        levelText.fontSize = 12;
        levelText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        levelText.top = "-15px";
        levelBarBg.addControl(levelText);

        parent.addControl(row);
    }

    private addEffectivenessBar(parent: GUI.StackPanel, effectiveness: number): void {
        const row = new GUI.Rectangle();
        row.height = "40px";
        row.thickness = 0;
        row.background = this.PANEL_COLOR;
        row.paddingLeft = "10px";
        row.paddingRight = "15px";

        const label = new GUI.TextBlock();
        label.text = "Effectiveness";
        label.color = "#ffffff";
        label.fontSize = 14;
        label.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        row.addControl(label);

        const effectBar = new GUI.Rectangle();
        effectBar.width = `${effectiveness}%`;
        effectBar.height = "6px";
        effectBar.background = this.getEffectivenessColor(effectiveness);
        effectBar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        effectBar.top = "20px";
        effectBar.cornerRadius = 3;
        row.addControl(effectBar);

        parent.addControl(row);
    }

    private getLevelColor(level: number): string {
        if (level >= 75) return "#4CAF50";      // Green
        if (level >= 50) return "#FFC107";      // Yellow
        if (level >= 25) return "#FF9800";      // Orange
        return "#f44336";                       // Red
    }

    private getEffectivenessColor(effectiveness: number): string {
        if (effectiveness >= 80) return "#4CAF50";
        if (effectiveness >= 60) return "#8BC34A";
        if (effectiveness >= 40) return "#FFC107";
        if (effectiveness >= 20) return "#FF9800";
        return "#f44336";
    }

    private getUnitTypeIcon(unitType: UnitTypeEnum): string {
        const typeValue = unitType.activeVariant();
        
        const iconMap: { [key: string]: string } = {
            'Infantry': "/images/infantry.png",
            'Armored': "/images/armored.png",
            'Air': "/images/air.png",
            'Naval': "/images/naval.png",
            'Cyber': "/images/cyber.png",
            'None': "/images/none.png"
        };
    
        return iconMap[typeValue] || "/images/unknown.png";
    }
    
      private clearPanel(): void {
        const controls = this.infoPanel.getDescendants();
        controls.forEach(control => control.dispose());
      }
    
      public hide(): void {
        this.infoPanel.isVisible = false;
      }

      private clearBoostPanel(): void {
        const controls = this.boostPanel.getDescendants();
        controls.forEach(control => control.dispose());
      }
    
      public hideBoostPanel(): void {
        this.boostPanel.isVisible = false;
      }


      private clearUnitStatePanel(): void {
        const controls = this.unitStatesPanel.getDescendants();
        controls.forEach(control => control.dispose());
      }
    
      public hideUnitStatePanel(): void {
        this.unitStatesPanel.isVisible = false;
      }

      public setSelectedUnitInfo(unit: any){
        this.selectedUnitInfo = unit;
      }

      public getSelectedUnitInfo(){
        return this.selectedUnitInfo;
      }

      public showBoxInfo(
        text: string, 
        styles?: {
            rectColor?: string;     // Color of the rectangle
            rectAlpha?: number;     // Transparency of rectangle (0-1)
            textColor?: string;     // Color of the text
            textBgColor?: string;   // Background color of text
            fontSize?: number;      // Size of the text
            autoHide?: boolean;     // Optional: automatically hide after delay
            hideDelay?: number;     // Optional: time in milliseconds before hiding
        },
        mesh?: Mesh,
        
    ): void {
        this.initializeBoxInfo();
        
        // Apply text and styles
        this.text.text = text;
        
        // Apply custom styles or defaults
        this.rect.background = styles?.rectColor || this.defaultStyles.rectBackground;
        this.rect.alpha = styles?.rectAlpha || this.defaultStyles.rectAlpha;
        this.text.color = styles?.textColor || this.defaultStyles.textColor;
        //this.text.background = styles?.textBgColor || this.defaultStyles.textBackground;
        this.text.fontSize = styles?.fontSize || this.defaultStyles.fontSize;
        this.text.alpha = (1/this.text.parent.alpha);
        
        if (mesh) {
            this.rect.linkWithMesh(mesh);
        }
        
        const scene = this.gui.getScene();
        if (scene) {
            scene.beginDirectAnimation(
                this.rect,
                this.animations,
                0,
                10,
                false
            );
        }
    
    

        if (styles?.autoHide) {
            const delay = styles?.hideDelay || 3000; // Default 3 seconds
            this.hideTimeout = window.setTimeout(() => {
                this.hideBoxInfo(scene);
                this.hideTimeout = null;
            }, delay);
        }
    }
    
    public hideBoxInfo(scene: Scene): void {
        if (this.rect) {
            if (this.hideTimeout !== null) {
                clearTimeout(this.hideTimeout);
                this.hideTimeout = null;
            }
            const scene = this.gui.getScene();
            if (scene) {
                scene.beginDirectAnimation(
                    this.rect,
                    this.animations,
                    10,
                    0,
                    false
                );
            }
        }
    }

    private createSection(title: string, content: string): StackPanel {
        const section = new StackPanel("section");
        section.width = "100%";
        section.height = "300px";  // Fixed height
        section.spacing = 5;
        section.paddingBottom = "20px";
        
        // Title
        const sectionTitle = new TextBlock("sectionTitle");
        sectionTitle.text = title;
        sectionTitle.color = "white";
        sectionTitle.fontSize = 20;
        sectionTitle.height = "30px";
        sectionTitle.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        sectionTitle.paddingLeft = "20px";
        section.addControl(sectionTitle);
        
        if (title === "Base Insignias") {
            const introText = new TextBlock("introText");
            introText.text = "Your troops will be marked with insignias based on your home base:";
            introText.color = "#CCCCCC";
            introText.fontSize = 16;
            introText.height = "40px";
            introText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            introText.textWrapping = true;
            introText.paddingLeft = "30px";
            introText.paddingRight = "20px";
            section.addControl(introText);
            
            const baseColors = [
                { name: "RadiantShores", color: "#00B3FF" },
                { name: "Ironforge", color: "#CCCCCC" },
                { name: "Skullcrag", color: "#FF0000" },
                { name: "NovaWarhound", color: "#FFD700" },
                { name: "SavageCoast", color: "#00CC00" }
            ];
            
            baseColors.forEach((base, index) => {
                const baseText = new TextBlock(`base_${index}`);
                baseText.text = `• ${base.name}`;
                baseText.color = base.color;
                baseText.fontSize = 16;
                baseText.height = "25px";
                baseText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                baseText.paddingLeft = "40px";
                section.addControl(baseText);
            });
        } else {
            const sectionContent = new TextBlock("sectionContent");
            sectionContent.text = content;
            sectionContent.color = "#CCCCCC";
            sectionContent.fontSize = 16;
            sectionContent.height = "240px";  // Adjusted height
            sectionContent.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            sectionContent.textWrapping = true;
            sectionContent.paddingLeft = "30px";
            sectionContent.paddingRight = "20px";
            section.addControl(sectionContent);
        }
        
        return section;
    }
    
    private createImage(imageUrl: string, width: string = "500px", height: string = "280px"): Rectangle {
        const imageContainer = new Rectangle("imageContainer");
        imageContainer.width = width;
        imageContainer.height = height;
        imageContainer.thickness = 0;
        imageContainer.background = "transparent";
        imageContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        
        const image = new Image("tutorialImage", imageUrl);
        image.stretch = Image.STRETCH_UNIFORM;
        image.width = "100%";
        image.height = "100%";
        imageContainer.addControl(image);
        
        return imageContainer;
    }
    
    public showInfo(content: Array<{gType: string, data: any}>): void {
        // Main container
        this.tutorialContainer = new Rectangle("guideContainer");
        this.tutorialContainer.width = "800px";
        this.tutorialContainer.height = "600px";
        this.tutorialContainer.color = "white";
        this.tutorialContainer.thickness = 0;
        this.tutorialContainer.cornerRadius = 15;
        this.tutorialContainer.background = "#333333F2";
        this.tutorialContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.tutorialContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.gui.addControl(this.tutorialContainer);
        
        // Title bar
        const titleBar = new Rectangle("titleBar");
        titleBar.width = "100%";
        titleBar.height = "50px";
        titleBar.thickness = 0;
        titleBar.background = "#444444";
        titleBar.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        titleBar.zIndex = 1;  // Ensure it stays on top
        this.tutorialContainer.addControl(titleBar);
        
        const titleText = new TextBlock("titleText");
        titleText.text = "Guide";
        titleText.color = "white";
        titleText.fontSize = 20;
        titleText.paddingLeft = "20px";
        titleText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        titleBar.addControl(titleText);
        
        // Close button
        const closeBtn = Button.CreateSimpleButton("closeBtn", "X");
        closeBtn.width = "40px";
        closeBtn.height = "40px";
        closeBtn.color = "white";
        closeBtn.fontSize = 16;
        closeBtn.thickness = 0;
        closeBtn.background = "#666666";
        closeBtn.cornerRadius = 15;
        closeBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        closeBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        closeBtn.onPointerClickObservable.add(() => {
            this.gui.removeControl(this.tutorialContainer);
        });
        titleBar.addControl(closeBtn);
        
        // Scroll viewer
        this.scrollViewer = new ScrollViewer("scrollViewer");
        this.scrollViewer.width = "780px";
        this.scrollViewer.height = "540px";  // Container height - title bar height
        this.scrollViewer.thickness = 0;
        this.scrollViewer.background = "transparent";
        this.scrollViewer.top = "50px";
        this.tutorialContainer.addControl(this.scrollViewer);
        
        // Content panel
        this.contentPanel = new StackPanel("contentPanel");
        this.contentPanel.width = "100%";
        this.contentPanel.spacing = 10;
        this.scrollViewer.addControl(this.contentPanel);
        
        // Add content
        content.forEach(item => {
            if (item.gType === 'section') {
                const { title, content } = item.data;
                const section = this.createSection(title, content);
                this.contentPanel.addControl(section);
            } else if (item.gType === 'image') {
                const { url, width, height } = item.data;
                const image = this.createImage(url, width, height);
                this.contentPanel.addControl(image);
            }
        });
    }

    private createNexusOpponentsPanel(): void {
        // Create main panel
        this.nexusOpponentsPanel = new GUI.Rectangle("nexusOpponentsPanel");
        this.nexusOpponentsPanel.width = "300px";
        this.nexusOpponentsPanel.height = "600px";
        this.nexusOpponentsPanel.cornerRadius = 10;
        this.nexusOpponentsPanel.color = this.PANEL_COLOR;
        this.nexusOpponentsPanel.thickness = 0;
        this.nexusOpponentsPanel.background = this.PANEL_COLOR;
        this.nexusOpponentsPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.nexusOpponentsPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.nexusOpponentsPanel.top = "60px";
        this.nexusOpponentsPanel.isVisible = false;
        
        // Create header panel
        const headerPanel = new GUI.StackPanel("headerPanel");
        headerPanel.height = "40px";
        headerPanel.isVertical = false;
        headerPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        headerPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.nexusOpponentsPanel.addControl(headerPanel);
        
        // Title
        const titleText = new GUI.TextBlock("opponentsTitle");
        titleText.text = "⚔️ Enemies";
        titleText.fontSize = 18;
        titleText.color = "white";
        titleText.width = "250px";
        titleText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        headerPanel.addControl(titleText);
        
        // Close button
        const closeBtn = GUI.Button.CreateSimpleButton("closeOpponents", "✖");
        closeBtn.width = "40px";
        closeBtn.height = "20px";
        closeBtn.color = "white";
        closeBtn.cornerRadius = 5;
        closeBtn.background = "#0f3d0f";
        closeBtn.onPointerUpObservable.add(() => {
            this.toggleVisibility();
        });
        headerPanel.addControl(closeBtn);
        
        // Create scrollable content container
        const scrollViewer = new GUI.ScrollViewer("opponentsScrollViewer");
        scrollViewer.width = "100%";
        scrollViewer.height = "600px"; // Adjust to leave space for header
        scrollViewer.barBackground = "#1aff1a22";
        scrollViewer.barColor = "#1aff1a";
        scrollViewer.thickness = 0;
        scrollViewer.thumbLength = 0.5;
        scrollViewer.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        scrollViewer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        scrollViewer.top = "40px"; // Position below header
        this.nexusOpponentsPanel.addControl(scrollViewer);
        
        // Content panel inside scroll viewer
        const contentPanel = new GUI.StackPanel("opponentsContent");
        contentPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        contentPanel.width = "100%";
        scrollViewer.height = "560px";
        contentPanel.isVertical = true;
        contentPanel.spacing = 5;
        scrollViewer.addControl(contentPanel);
        
        // Divider
        const divider = new GUI.Rectangle("divider");
        divider.height = "2px";
        divider.background = "#1aff1a";
        divider.alpha = 0.5;
        contentPanel.addControl(divider);
        
        // Add to GUI
        this.gui.addControl(this.nexusOpponentsPanel);
    }
    
    
    private createOpponentsButton(): void {
        const opponentsBtn =  GUI.Button.CreateSimpleButton("opponentsBtn", "👥 Opponents");
        opponentsBtn.width = "150px";
        opponentsBtn.height = "40px";
        opponentsBtn.color = "white";
        opponentsBtn.cornerRadius = 10;
        opponentsBtn.background = "#0f3d0f";
        opponentsBtn.hoverCursor = "pointer";
        opponentsBtn.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        opponentsBtn.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        //opponentsBtn.right = "10px";
        opponentsBtn.top = "120px";
        opponentsBtn.onPointerUpObservable.add(() => {
            this.toggleVisibility();
        });
        this.gui.addControl(opponentsBtn);
    }
    
    public toggleVisibility(): void {
        this.isVisible = !this.isVisible;
        this.nexusOpponentsPanel.isVisible = this.isVisible;
    }
    
    public updateOpponents(players: Record<string, Player>): void {
        // First initialization - create all UI elements
        if (Object.keys(this.opponentTextBlocks).length === 0) {
            this.initializeOpponentsUI(players);
        } else {
            // Just update the data for all players
            Object.entries(players).forEach(([address, player]) => {
                if (this.opponentTextBlocks[address]) {
                    // Update existing player
                    this.updatePlayerData(address, player);
                } else {
                    // Handle new player - need to rebuild UI
                    this.initializeOpponentsUI(players);
                    return; // Exit loop as we've rebuilt everything
                }
            });
            
            // Check if any players were removed
            const currentAddresses = new Set(Object.keys(players));
            if (Object.keys(this.opponentTextBlocks).some(addr => !currentAddresses.has(addr))) {
                // Player was removed, need to rebuild UI
                this.initializeOpponentsUI(players);
            }
        }
        
        // Update stored data
        this.opponentsData = {...players};
    }
    
    private initializeOpponentsUI(players: Record<string, Player>): void {
        // Get scroll viewer and content panel
        const scrollViewer = this.nexusOpponentsPanel.getChildByName("opponentsScrollViewer") as GUI.ScrollViewer;
        const contentPanel = scrollViewer.children[0] as GUI.StackPanel;
        
        // Remove all opponent blocks (except divider)
        const children = contentPanel.children.slice();
        for (let i = 1; i < children.length; i++) {
            contentPanel.removeControl(children[i]);
        }
        
        this.opponentTextBlocks = {};
        
        // Add each opponent
        Object.entries(players).forEach(([address, player], index) => {
            if (!player) return;
            
            // Create opponent container with fixed height and proper padding
            const opponentPanel = new GUI.Rectangle(`opponent_${index}`);
            opponentPanel.height = "200px";
            opponentPanel.thickness = 0;
            opponentPanel.background = index % 2 === 0 ? "#0a290a" : this.PANEL_COLOR;
            opponentPanel.paddingTop = "5px";
            opponentPanel.paddingBottom = "5px";
            contentPanel.addControl(opponentPanel);
            
            // Player info grid layout - added one more row for flag section
            const infoGrid = new GUI.Grid("infoGrid_" + index);
            infoGrid.addRowDefinition(0.2); // Name
            infoGrid.addRowDefinition(0.2); // Score
            infoGrid.addRowDefinition(0.2); // K/D
            infoGrid.addRowDefinition(0.2); // Supply
            infoGrid.addRowDefinition(0.2); // Flag - new row
            infoGrid.addColumnDefinition(0.1); // Icon column
            infoGrid.addColumnDefinition(0.9); // Text column
            infoGrid.width = "100%";
            infoGrid.height = "100%";
            opponentPanel.addControl(infoGrid);
            // Name row
            const nameIcon = new GUI.TextBlock("nameIcon_" + index);
            nameIcon.text = "👤";
            nameIcon.fontSize = 16;
            nameIcon.color = "white";
            nameIcon.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            infoGrid.addControl(nameIcon, 0, 0);
            
            const nameText = new GUI.TextBlock("nameText_" + index);
            nameText.text = `${player.name} `;
            nameText.fontSize = 16;
            nameText.color = "white";
            nameText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            nameText.paddingLeft = "5px";
            infoGrid.addControl(nameText, 0, 1);
            
            // Score row
            const scoreIcon = new GUI.TextBlock("scoreIcon_" + index);
            scoreIcon.text = "🏆";
            scoreIcon.fontSize = 16;
            scoreIcon.color = "white";
            scoreIcon.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            infoGrid.addControl(scoreIcon, 1, 0);
            
            const scoreText = new GUI.TextBlock("scoreText_" + index);
            scoreText.text = `Score: ${Number(player.player_score.score)}`;
            scoreText.fontSize = 16;
            scoreText.color = "white";
            scoreText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            scoreText.paddingLeft = "5px";
            infoGrid.addControl(scoreText, 1, 1);
            
            // K/D row
            const killsDeathsPanel = new GUI.StackPanel("kdPanel_" + index);
            killsDeathsPanel.isVertical = false;
            killsDeathsPanel.width = "100%"
            killsDeathsPanel.height = "100%";
            infoGrid.addControl(killsDeathsPanel, 2, 1);
            
            // Kills
            const killsText = new GUI.TextBlock("killsText_" + index);
            killsText.text = `Kills: ${Number(player.player_score.kills)}`;
            killsText.fontSize = 16;
            killsText.color = "yellow";
            killsText.width = "80px";
            killsText.paddingLeft = "5px";
            killsDeathsPanel.addControl(killsText);
            
            // Deaths
            const deathsText = new GUI.TextBlock("deathsText_" + index);
            deathsText.text = `Deaths: ${Number(player.player_score.deaths)}`;
            deathsText.fontSize = 16;
            deathsText.color = "red";
            killsText.width = "80px";
            deathsText.paddingLeft = "10px";
            killsDeathsPanel.addControl(deathsText);

                        // Flag section (NEW)
            const flagIcon = new GUI.TextBlock("flagIcon_" + index);
            flagIcon.text = "🏁";
            flagIcon.fontSize = 16;
            flagIcon.color = "white";
            flagIcon.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            infoGrid.addControl(flagIcon, 3, 0);
            
            const flagText = new GUI.TextBlock("flagText_" + index);
            // Check if the player has captured a flag
            
            flagText.text = `${Number(player.flags_captured)}`
            flagText.fontSize = 16;
            flagText.color = "#1aff1a", // Green text if flag is captured
            flagText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            flagText.paddingLeft = "5px";
            infoGrid.addControl(flagText, 3, 1);
            
            // Supply row
            const supplyIcon = new GUI.TextBlock("supplyIcon_" + index);
            supplyIcon.text = "";
            supplyIcon.fontSize = 16;
            supplyIcon.color = "white";
            supplyIcon.width = "80px";
            supplyIcon.paddingLeft = "5px";
            supplyIcon.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            infoGrid.addControl(supplyIcon, 4, 0);
            
            const supplyText = new GUI.TextBlock("supplyText_" + index);
            supplyText.text = this.formatSupply(player.supply);
            supplyText.fontSize = 16;
            supplyText.color = "white";
            supplyText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            supplyText.paddingLeft = "5px";
            infoGrid.addControl(supplyText, 4, 1);
            
            // Store references to text blocks for updates
            this.opponentTextBlocks[address] = {
                nameText,
                scoreText,
                killsText,
                deathsText,
                supplyText
            };
        });
        
        // Let the scroll viewer handle height automatically
        // Just update the main panel height to match window size if needed
        const playerCount = Object.keys(players).length;
        const contentHeight = Math.min(500, playerCount * 100 + 40); // Header (40px) + player panels
        this.nexusOpponentsPanel.height = `${Math.min(500, 40 + (Object.keys(players).length * 820))}px`;
    }
    
    
    // More efficient method for updating just the data
    private updatePlayerData(address: string, player: Player): void {
        const blocks = this.opponentTextBlocks[address];
        if (blocks) {
            blocks.nameText.text = `${player.name}`;
            blocks.scoreText.text = `Score: ${Number(player.player_score.score)}`;
            blocks.killsText.text = `Kills: ${Number(player.player_score.kills)}`;
            blocks.deathsText.text = `Deaths: ${Number(player.player_score.deaths)}`;
            blocks.supplyText.text = this.formatSupply(player.supply);
        }
    }
    
    public updateSingleOpponent(address: string, player: Player): void {
        if (this.opponentTextBlocks[address]) {
            const blocks = this.opponentTextBlocks[address];
            blocks.nameText.text = `${player.name}`;
            blocks.scoreText.text = `Score: ${Number(player.player_score.score)}`;
            blocks.killsText.text = `Kills: ${Number(player.player_score.kills)}`;
            blocks.deathsText.text = `Deaths: ${Number(player.player_score.deaths)}`;
            blocks.supplyText.text = this.formatSupply(player.supply);
        } else {
            // If this opponent wasn't previously displayed, update the whole panel
            // This ensures new opponents are added dynamically
            this.updateOpponents({...this.opponentsData, [address]: player});
        }
    }
    
    private formatSupply(supply: UnitsSupply): string {
        const infantry = Number(supply.infantry);
        const armored = Number(supply.armored);
        const air = Number(supply.air);
        const naval = Number(supply.naval);
        const cyber = Number(supply.cyber);

        //👨🏽‍✈️${infantry} 🚜${armored} 🛩️${air} ⚓${naval} 💻${cyber}
        
        return `👨🏽‍✈️ ${infantry}`;
    }
}

