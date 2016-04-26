/// <reference path="Phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PlatformerGameStates;
(function (PlatformerGameStates) {
    var GameRunningState = (function (_super) {
        __extends(GameRunningState, _super);
        function GameRunningState() {
            _super.call(this);
        }
        GameRunningState.prototype.init = function () {
            this.secondsLeft = this.game.time.events.loop(Phaser.Timer.SECOND * 50, this.gameOver, this);
        };
        GameRunningState.prototype.preload = function () {
            var AssetsFolder = "GameFiles/Assets/";
            this.game.load.image("sky", AssetsFolder + "sky.png");
            this.game.load.image("ground", AssetsFolder + "platform.png");
            this.game.load.image("crystal", AssetsFolder + "Crystal.png");
            this.game.load.image("ground", AssetsFolder + "Block_Ground.png");
            this.game.load.spritesheet("player", AssetsFolder + "dude.png", 32, 48);
            var MusicsFolder = "GameFiles/Music/";
            this.game.load.audio("crystalpickup", MusicsFolder + "crystal.ogg");
            this.game.load.audio("bgmusic", MusicsFolder + "bgmusic.ogg");
        };
        //init() {
        //    this.game.time.events.loop(Phaser.Timer.SECOND * 50, this.gameOver, this);
        //    this.game.time.events.autoDestroy = true;
        //}
        GameRunningState.prototype.create = function () {
            // Create cursor keys
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.game.world.setBounds(0, 0, 4000, this.game.world.height);
            // Activate arcade physics engine :>
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 1000;
            // Sky
            //this.sky = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "sky");
            //this.sky.pivot.x = this.sky.width / 2;
            //this.sky.pivot.y = this.sky.height / 2;
            //this.sky.scale.set(2);
            this.game.stage.backgroundColor = "#eee";
            // Platforms Group that contains ground and 2 ledges
            this.platforms = this.game.add.group();
            // Enable Physics for all the platforms in this group
            this.platforms.enableBody = true;
            // Create ground
            this.addLedge(0, this.game.world.height - 64, "ground", 10, 4);
            // Create ledges
            this.addLedge(400, this.game.world.height - 64 - (this.game.world.height * 0.2), "ground", 1, 1);
            this.addLedge(-150, 300, "ground", 0.9, 1);
            this.addLedge(1000, 350, "ground", 1.1, 1);
            this.addLedge(1200, 250, "ground", 0.5, 1);
            this.addLedge(1600, this.game.world.height - 64 - (this.game.world.height * 0.18), "ground", 0.8, 1);
            this.addLedge(1800, this.game.world.height - 64 - (this.game.world.height * 0.5), "ground", 0.5, 1);
            this.addLedge(2200, this.game.world.height - 64 - (this.game.world.height * 0.4), "ground", 0.8, 1);
            this.addLedge(2600, this.game.world.height - 64 - (this.game.world.height * 0.25), "ground", 0.7, 1);
            this.addLedge(1950, this.game.world.height - 64 - (this.game.world.height * 0.6), "ground", 0.6, 1);
            this.addLedge(3000, this.game.world.height - 64 - (this.game.world.height * 0.25), "ground", 0.7, 1);
            this.addLedge(3200, this.game.world.height - 64 - (this.game.world.height * 0.38), "ground", 0.8, 1);
            this.addLedge(3600, this.game.world.height - 64 - (this.game.world.height * 0.5), "ground", 0.8, 1);
            this.addLedge(3900, this.game.world.height - 64 - (this.game.world.height * 0.6), "ground", 0.8, 1);
            var instr = this.game.add.text(window.innerWidth + 20, 20, "Collect the Fallen Crystals...", { font: "Garamond", fontSize: "80px", fill: "#999999" });
            // Player
            this.player = this.game.add.sprite(32, this.game.world.height - 150, "player");
            // Enable physics for the player
            this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
            // Add some physics properties
            this.player.body.bounce.y = 0.2;
            this.player.body.gravity.y = 300;
            this.player.body.collideWorldBounds = true;
            // Add animations
            this.player.animations.add("left", [0, 1, 2, 3], 10, true);
            this.player.animations.add("right", [5, 6, 7, 8], 10, true);
            // Add Stars
            this.crystals = this.game.add.group();
            this.crystals.enableBody = true;
            for (var i = 0; i < 58; i++) {
                var star = this.crystals.create(i * 70, 0, "crystal");
                // Set some gravity
                star.body.gravity.y = 6;
                star.scale.set(1.1);
                // Collide with world bounds
                star.body.collideWorldBounds = true;
                // Different bounce values
                star.body.bounce.y = 0.7 * Math.random() * 0.2;
            }
            // Set score to zero
            this.score = 0;
            this.scoreText = this.game.add.text(20, 20, 'Star Score: 0', { font: "Garamond", fontSize: "32px", fill: "#333355" });
            this.scoreText.smoothed = false;
            this.scoreText.fixedToCamera = true;
            this.game.camera.follow(this.player);
            // Add Music
            this.pickupsound = this.game.add.audio("crystalpickup");
            this.bgmusic = this.game.add.audio("bgmusic");
            this.bgmusic.onDecoded.add(this.startMusic, this);
            // Add Timer then
            //this.secondsLeft = this.game.time.events.loop(Phaser.Timer.SECOND * 50, this.gameOver, this);
            //this.secondsLeft = new Phaser.Timer(this.game, true);
            this.seconds = this.game.add.text(20, 100, "Time Left: 0", { font: "Garamond", fontSize: "32px", fill: "#333355" });
            this.seconds.smoothed = false;
            this.seconds.fixedToCamera = true;
            this.faded = false;
            //this.secondsLeft.events.loop(Phaser.Timer.SECOND * 50, this.gameOver, this);
            this.secondsLeft = this.game.time.events.loop(Phaser.Timer.SECOND * 50, this.gameOver, this);
        };
        GameRunningState.prototype.addLedge = function (x, y, key, scaleX, scaleY) {
            var ledge = this.platforms.create(x, y, key);
            ledge.body.immovable = true;
            ledge.body.allowGravity = false;
            ledge.scale.setTo(scaleX, scaleY);
        };
        GameRunningState.prototype.startMusic = function () {
            this.bgmusic.play(undefined, 0, 0.9, true);
        };
        GameRunningState.prototype.update = function () {
            this.seconds.text = "Time: " + this.secondsLeft.timer.seconds.toFixed(0);
            this.game.physics.arcade.collide(this.player, this.platforms);
            this.game.physics.arcade.collide(this.crystals, this.platforms);
            this.game.physics.arcade.overlap(this.player, this.crystals, this.collectStar, null, this);
            // Reset Players velocity movement
            this.player.body.velocity.x = 0;
            //if (this.player.position.x >= 2000 && !this.faded) {
            //    this.faded = true;
            //    this.game.add.tween(this.instr).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 0, 0, true);
            //}
            // Left Right movement
            if (this.cursors.left.isDown) {
                // Move to the left
                this.player.body.velocity.x = -250;
                this.player.animations.play("left");
            }
            else if (this.cursors.right.isDown) {
                // Move right
                this.player.body.velocity.x = 250;
                this.player.animations.play("right");
            }
            else {
                this.player.animations.stop();
                this.player.frame = 4;
            }
            // Allow jump if touching ground
            if (this.cursors.up.isDown && this.player.body.touching.down) {
                this.player.body.velocity.y = -700;
            }
            if (this.score >= 58 * 10) {
                this.secondsLeft.timer.destroy();
                this.game.world.bounds.setTo(0, 0, window.innerWidth, window.innerHeight);
                this.game.state.start("GameWonState", true, true);
            }
        };
        GameRunningState.prototype.gameOver = function () {
            this.secondsLeft.timer.destroy();
            this.game.world.bounds.setTo(0, 0, window.innerWidth, window.innerHeight);
            this.game.state.start("GameLostState", true, true, this.score);
        };
        GameRunningState.prototype.collectStar = function (player, star) {
            star.kill();
            this.score += 10;
            this.scoreText.text = 'Star Score: ' + this.score;
            this.pickupsound.play(undefined, 0, 0.7);
        };
        return GameRunningState;
    }(Phaser.State));
    PlatformerGameStates.GameRunningState = GameRunningState;
    var GameWonState = (function (_super) {
        __extends(GameWonState, _super);
        function GameWonState() {
            _super.call(this);
        }
        GameWonState.prototype.preload = function () {
            this.game.load.image("restartButton", "GameFiles/Assets/diamond.png");
        };
        GameWonState.prototype.create = function () {
            this.game.stage.backgroundColor = "#ffdddd";
            this.wonText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 80, "Click To Restart", {
                fontSize: "50px",
                fill: "#333355"
            });
            this.wonText.anchor.set(0.5);
            this.wonText.smoothed = false;
            this.restart = this.game.add.button(this.game.world.centerX, this.game.world.centerY, "restartButton", this.restartGame, this);
            this.restart.anchor.set(0.5);
            this.restart.scale.set(1.4);
        };
        GameWonState.prototype.restartGame = function () {
            this.game.time.events.events = [];
            this.game.state.start("GameStartState", true, true);
        };
        return GameWonState;
    }(Phaser.State));
    PlatformerGameStates.GameWonState = GameWonState;
    var GameStartState = (function (_super) {
        __extends(GameStartState, _super);
        function GameStartState() {
            _super.call(this);
        }
        GameStartState.prototype.preload = function () {
            this.game.load.image("restartButton", "GameFiles/Assets/diamond.png");
        };
        GameStartState.prototype.create = function () {
            //this.game.world.bounds.setTo(0, 0, window.innerWidth, window.innerHeight);
            this.game.stage.backgroundColor = "#ffdddd";
            this.startText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 80, "Click To Start", {
                fontSize: "50px",
                fill: "#333355"
            });
            this.startText.anchor.set(0.5);
            this.startText.smoothed = false;
            this.start = this.game.add.button(this.game.world.centerX, this.game.world.centerY, "restartButton", this.startGame, this);
            this.start.anchor.set(0.5);
            this.start.scale.set(1.4);
        };
        GameStartState.prototype.startGame = function () {
            this.game.state.start("GameRunningState", true, true);
        };
        return GameStartState;
    }(Phaser.State));
    PlatformerGameStates.GameStartState = GameStartState;
    var GameLostState = (function (_super) {
        __extends(GameLostState, _super);
        function GameLostState(score) {
            _super.call(this);
        }
        GameLostState.prototype.init = function (score) {
            this.score = score;
        };
        GameLostState.prototype.preload = function () {
            this.game.load.image("restartButton", "GameFiles/Assets/diamond.png");
        };
        GameLostState.prototype.create = function () {
            this.game.stage.backgroundColor = "#ffdddd";
            this.endText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 80, "Score: " + this.score, {
                fontSize: "50px",
                fill: "#333355"
            });
            this.endText.anchor.set(0.5);
            this.endText.smoothed = false;
            this.restart = this.game.add.button(this.game.world.centerX, this.game.world.centerY, "restartButton", this.startGame, this);
            this.endText.anchor.set(0.5);
            this.endText.scale.set(1.4);
        };
        GameLostState.prototype.startGame = function () {
            this.game.time.events.events = [];
            this.game.state.start("GameStartState", true, true);
        };
        return GameLostState;
    }(Phaser.State));
    PlatformerGameStates.GameLostState = GameLostState;
})(PlatformerGameStates || (PlatformerGameStates = {}));
//# sourceMappingURL=PlatformerGameStates.js.map