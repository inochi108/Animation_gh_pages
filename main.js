var AM = new AssetManager();
var waitFireBall = false;
var waitRyuu = true;

function Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
    //------------------------------------
    this.fireBallFrameWidth = 200;
    this.fireBallFrameHeight = 100;
    this.waitFireBall = false;
    this.waitRyuu = true;
    //----------------------------
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;

    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    if (!this.isDone()) {
        xindex = frame % 4;
    }
//    console.log(frame + " " + xindex + " " + yindex);

    ctx.drawImage(this.spriteSheet,
            xindex * this.frameWidth, yindex * this.frameHeight, // source from sheet
            this.frameWidth, this.frameHeight,
            x, y,
            this.frameWidth,
            this.frameHeight);
}
Animation.prototype.drawFireball = function (tick, ctx, x, y) {
    this.elapsedTime += tick;

    if (this.isDone())
        this.elapsedTime = 0;

    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;

    xindex = frame % 4;
    yindex = Math.floor(frame / 4) + 1;

//    console.log("The y index is " + yindex);

    ctx.drawImage(this.spriteSheet,
            xindex * this.fireBallFrameWidth, yindex * this.fireBallFrameHeight, // source from sheet
            this.fireBallFrameWidth, this.fireBallFrameHeight,
            x, y,
            this.fireBallFrameWidth,
            this.fireBallFrameHeight);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Ryuu(game, spritesheet) {
    //Animation(spritesheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
    this.shooting = new Animation(spritesheet, 150, 100, .05, 4, true, false);

    this.shot = false;
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.timer = 0;
    this.shoot = false;
}
Ryuu.prototype.draw = function () {
    
    this.shooting.drawFrame(this.game.clockTick, this.ctx, this.x, this.y + 300);
}

Ryuu.prototype.update = function () {
    if (this.game.space) {
        this.shoot = true;
    }
    if (this.shoot) {
        if (this.shooting.isDone()) {
            this.game.addEntity(new Fireball(this.game, AM.getAsset("./img/Hadouken.png")));
            this.shooting.elapsedTime = 0;
        }
        this.shoot = false;
    }

}

function Fireball(game, spritesheet) {
    //Animation(spritesheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
    this.animation = new Animation(spritesheet, 200, 100, .03, 8, true, false);
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
}
Fireball.prototype.draw = function () {
    this.animation.drawFireball(this.game.clockTick, this.ctx, this.x + 70, this.y + 290);
}
Fireball.prototype.update = function () {
    this.x += 5;
}

AM.queueDownload("./img/Hadouken.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    var ryuu = new Ryuu(gameEngine, AM.getAsset("./img/Hadouken.png"));
    gameEngine.addEntity(ryuu);
    gameEngine.addEntity(new Fireball(gameEngine, AM.getAsset("./img/Hadouken.png")));

    console.log("All Done!");
});