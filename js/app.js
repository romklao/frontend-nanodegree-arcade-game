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

var PlayGame = function() {
    this.gainLife = 'images/Heart.png';
    this.gainGem = 'images/diamond.svg';
    this.loseLife = 'images/cancel.svg';
}

PlayGame.prototype.lose = function() {
    alert('GAME OVER');
    this.resetGame();
};

PlayGame.prototype.resetGame = function() {
    player.reset();

    collectedHearts = [];
    collectedGems = [];

    hearts.forEach(function(heart) {
        heart.reset();
    });

    gems.forEach(function(gem) {
        gem.reset();
    });
}

var playGame = new PlayGame();


// Create SelectPlayer to allow a player to choose a character
var SelectPlayer = function() {
    this.col = 0;
    this.x = this.col;
    this.y = 395;
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
            play = true;
            playGame.resetGame();
    }
};

// Selector render function
SelectPlayer.prototype.render = function() {
    ctx.save();
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.restore();
}

var Item = function(x, y) {
    this.x = x;
    this.y = y;
    this.originalPosition = [x,y];
    this.width = 80;
    this.height = 110;
};

Item.prototype.reset = function() {
    this.x = this.originalPosition[0];
    this.y = this.originalPosition[1];
};

Item.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
}

var Heart = function(x, y, originalPosition, width, height) {
    Item.call(this, x, y, originalPosition, width, height);
    this.sprite = 'images/Heart.png';
}

Heart.prototype = Object.create(Item.prototype);

var hearts = [];

var heart1 = new Heart(110, 280);
var heart2 = new Heart(415, 195);

hearts.push(heart1, heart2);

var collectedHearts = [];

var Gem = function(x, y, originalPosition, width, height) {
    Item.call(this, x, y, originalPosition, width, height);
    this.sprite = 'images/Gem Blue.png';
};

Gem.prototype = Object.create(Item.prototype);

var gems = [];

var gem1 = new Gem(315, 350);
var gem2 = new Gem(212, 100);
var gem3 = new Gem(10, 185);

gems.push(gem1, gem2, gem3);

var collectedGems = [];

// Enemies our player must avoid
let Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = 100;
    this.height = 160;
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
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

var enemies = [];
var enemyPosition = [70, 150, 230, 320];

enemyPosition.forEach((position) => {
    var enemy = new Enemy(0, position, Math.floor(Math.random() * 400));
    enemies.push(enemy);
});

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = 203;
    this.y = 420;
    this.width = 100;
    this.height = 150;
    this.speed = 50;
    this.lives = 5;
    this.scores = 0;
    this.sprite = characters[selectedChar];
}

Player.prototype.reset = function() {
    this.x = 203;
    this.y = 420;
    this.lives = 5;
    this.scores = 0;
    this.sprite = characters[selectedChar];

    document.getElementById('lives').innerHTML = this.lives.toString();
    document.getElementById('scores').innerHTML = this.scores.toString();
}

Player.prototype.update = function() {
    if (this.y > 400) {
        this.y = 420;
    }
    if (this.x > 403) {
        this.x = 403;
    }
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.y < 0) {
        this.x = 203;
        this.y = 420;

        this.scores += 5000;
        document.getElementById('scores').innerHTML = this.scores.toString();
    }
    for(var i = 0; i < enemies.length; i++) {
        if (this.x < enemies[i].x + 50 &&
            this.x > enemies[i].x &&
            this.y < enemies[i].y + 40 &&
            this.y > enemies[i].y) {

            this.x = 203;
            this.y = 420;
        }
    }
    for(i = 0; i < hearts.length; i++) {
        if (this.x < hearts[i].x &&
            this.x + this.width > hearts[i].x &&
            this.y < hearts[i].y &&
            this.y + this.height > hearts[i].y) {

            collectedHearts.push([hearts[i].x, hearts[i].y]);
            this.lives += 1;
            document.getElementById('lives').innerHTML = this.lives.toString();

            hearts[i].x = 1000;
            hearts[i].y = 1000;
        }
    }
    for (i = 0; i < gems.length; i++) {
        if (this.x < gems[i].x &&
            this.x + this.width > gems[i].x &&
            this.y < gems[i].y &&
            this.y + this.height > gems[i].y) {

            collectedGems.push(gems[i].x, gems[i].y);
            this.scores += 1000;
            document.getElementById('scores').innerHTML = this.scores.toString();

            gems[i].x = 1000;
            gems[i].y = 1000;
        }
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(characters[selectedChar]), this.x, this.y, this.width, this.height);
};

Player.prototype.handleInput = function(keypress) {
    switch (keypress) {
        case 'left':
            this.x -= this.speed + 50;
            break;
        case 'up':
            this.y -= this.speed + 32;
            break;
        case 'right':
            this.x += this.speed + 50;
            break;
        case 'down':
            this.y += this.speed + 32;
            break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player();
var selectPlayer = new SelectPlayer();

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






