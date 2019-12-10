import levelGenerator from "../src/level-generation";
import tilemapPng from '../assets/tileset/my-tiles.png'
import SteeringDriven from "../src/ai/behaviour/steering_driven";
import Wander from "../src/ai/steerings/wander";
import CharacterFactory from "../src/characters/character_factory";
import Vector2 from 'phaser/src/math/Vector2'


let RandomWalkScene = new Phaser.Class({

    Extends: Phaser.Scene,


    initialize: function RandomWalkScene() {
        Phaser.Scene.call(this, {key: 'RandomWalkScene'});
    },

    preload: function () {
        this.characterFactory = new CharacterFactory(this);
        this.load.image("my-tiles", tilemapPng);
    },
    
    create: function () {

        let w = 50, h = 50, N = 100, L = 7;
        const tileSize = 32;
        let generator = new levelGenerator(w, h, N, L);
        let level = generator.generateLevel();

        this.characterFactory.loadAnimations();

        this.gameObjects = [];
        this.map = this.make.tilemap({
            tileWidth: tileSize,
            tileHeight: tileSize,
            width: w,
            height: h
        });

        const tileset = this.map.addTilesetImage("my-tiles", null, tileSize, tileSize);
        this.groundLayer = this.map.createBlankDynamicLayer("Ground", tileset);
        this.stuffLayer = this.map.createBlankDynamicLayer("Stuff", tileset);


        let start, end;
        for(let x = 0; x < w; x++)
            for(let y = 0; y < h; y++){
                if(level[x][y] === 0){
                    this.groundLayer.putTileAt(0, x, y);
                }
                else if(level[x][y] > 0){
                    this.groundLayer.putTileAt(1, x, y);
                }
                if(level[x][y] === 2){
                    start = new Vector2(x, y);
                }
                if(level[x][y] === 3){
                    end = new Vector2(x, y);
                }
            }

        this.input.keyboard.once("keydown_D", event => {
            // Turn on physics debugging to show player's hitbox
            this.physics.world.createDebugGraphic();

            const graphics = this.add
                .graphics()
                .setAlpha(0.75)
                .setDepth(20);
        });



        this.player = this.characterFactory.buildCharacter('aurora', tileSize*start.x, tileSize*start.y, {player: true});
        this.physics.add.collider(this.player, this.groundLayer);
        this.physics.add.collider(this.player, this.stuffLayer);
        this.groundLayer.setCollision(0);
        // Phaser supports multiple cameras, but you can access the default camera like this:
        const camera = this.cameras.main;
        camera.setZoom(1.0)
        // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        camera.startFollow(this.player);
    },

    update: function () {
        if (this.gameObjects) {
            this.gameObjects.forEach( function(element) {
                element.update();
            });
        }
        if (this.hasPlayerReachedStairs) return;

        this.player.update();

        // Find the player's room using another helper method from the dungeon that converts from
        // dungeon XY (in grid units) to the corresponding room object
        const playerTileX = this.groundLayer.worldToTileX(this.player.x);
        const playerTileY = this.groundLayer.worldToTileY(this.player.y);
        // if (!isNaN(playerTileX))
        // {
        //     const playerRoom = this.dungeon.getRoomAt(playerTileX, playerTileY);
        //     this.tilemapVisibility.setActiveRoom(playerRoom);
        // }



    },
    tilesToPixels(tileX, tileY) {
        return [tileX*this.tileSize, tileY*this.tileSize];
    }
});

export default RandomWalkScene