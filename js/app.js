'use strict';

var characters = [ //Array of URLs for player and NPC sprites
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];
var play = false;
var selectedChar;

// Create SelectPlayer to allow a player to choose a character
var SelectPlayer = function() {
    this.col = 0;
    this.x = this.col;
    this.y = 370;
    this.sprite = 'images/Selector.png';
}

// Get input from a player when they move selector
SelectPlayer.prototype.handleInput = function(keypress) {
    switch (keypress) {
        case 'left':
            this.col > 0 ? (this.col--, this.x = this.col * 101) : this.col;
            break;
        case 'right':
            this.col < 4 ? (this.col++, this.x = this.col * 101) : this.col;
            break;
        case 'enter':
            selectedChar = this.col;
            console.log(characters[selectedChar]);
            play = true;
    }
};

// Selector render function
SelectPlayer.prototype.render = function() {
    ctx.save();
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.restore();
}

// Enemies our player must avoid
let Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    if (this.x > 505) {
        this.x = -100;
        this.speed = 100 + Math.floor(Math.random() * 480)
    }
    if (player.x < this.x + 40 &&
        player.x + 40 > this.x &&
        player.y < this.y + 40 &&
        player.y + 40 > this.y) {

        player.x = 200;
        player.y = 400;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
}

Player.prototype.update = function() {
    if (this.y > 400) {
        this.y = 400;
    }
    if (this.x > 400) {
        this.x = 400;
    }
    if (this.x < 0) {
        this.x = 0;
    }
    if(this.y < 0) {
        this.x = 200;
        this.y = 400;
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(characters[selectedChar]), this.x, this.y);
};

Player.prototype.handleInput = function(keypress) {
    switch (keypress) {
        case 'left':
            this.x -= this.speed + 50;
            break;
        case 'up':
            this.y -= this.speed + 30;
            break;
        case 'right':
            this.x += this.speed + 50;
            break;
        case 'down':
            this.y += this.speed + 30;
            break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player(200, 400, 50);
var selectPlayer = new SelectPlayer();
var allEnemies = [];
var enemyPosition = [55, 110, 170, 230];

enemyPosition.forEach((position) => {
    var enemy = new Enemy(0, position, Math.floor(Math.random() * 400));
    allEnemies.push(enemy);
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter',
    };

    if (play === false) {
        selectPlayer.handleInput(allowedKeys[e.keyCode]);
    } else {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});






