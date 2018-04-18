'use strict';

/* This file includes objects such as player, enemies, selectPlayer etc.
   to update their appearance in the view. It will be used in engine.js file
*/

// Global variables

//Array of URLs for player and NPC sprites
var characters = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];
// Set play to false to use it later
var play = false;

// Declare selectedChar variable to use when a user chooses a charactor
var selectedChar;

// Create SelectPlayer class to allow a player to choose a character
var SelectPlayer = function() {
    this.col = 0;
    this.x = this.col + 100;
    this.y = 395;
    this.sprite = 'images/Selector.png';
}

// Get input from players when they move selector
SelectPlayer.prototype.handleInput = function(keypress) {
    switch (keypress) {
        // Press left key
        case 'left':
            this.col > 0 ? (this.col--, this.x = this.col * 101 + 100) : this.col;
            break;
        // Press right key
        case 'right':
            this.col < 4 ? (this.col++, this.x = this.col * 101 + 100) : this.col;
            break;
        // Press enter to select a charactor
        case 'enter':
            // This will be used for Charactor's index later
            selectedChar = this.col;
            play = true;
            // Play sound effect when a user selects a charactor
            playGame.select.play();
            // After a charactor is chosen, redirect to play game
            playGame.resetGame();
    }
};

// Selector render function
SelectPlayer.prototype.render = function() {
    ctx.save();
    // Show a charactor on the screen
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.restore();
}

/****************** Super Class ******************/
/* Create Item class. This will be useful when include gems, rocks, hearts, etc.
   This will provide an item's original position, width and height.
*/
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

/****************** Sub-Class ******************/

//Using inheritance to create Heart sub-class inherit from Item class
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

// Using inheritance to create Gem sub-class inherit from Item class
var Gem = function(x, y, originalPosition, width, height) {
    Item.call(this, x, y, originalPosition, width, height);
    this.sprite = 'images/Gem Blue.png';
};

Gem.prototype = Object.create(Item.prototype);

var gems = [];

var gem1 = new Gem(414, 350);
var gem2 = new Gem(212, 100);
var gem3 = new Gem(10, 185);
var gem4 = new Gem(617, 270);

gems.push(gem1, gem2, gem3, gem4);

var collectedGems = [];

// Using inheritance to create Rock sub-class inherit from Item class
var Rock = function(x, y, originalPosition, width, height) {
    Item.call(this, x, y, originalPosition, width, height);
    this.sprite = 'images/Rock.png';
    this.width = 90;
    this.height = 130;
}

Rock.prototype = Object.create(Item.prototype);

var rocks = [];

var rock1 = new Rock(210, 255);
var rock2 = new Rock(510, 175);
var rock3 = new Rock(411, 9);
var rock4 = new Rock(108, 9);
var rock5 = new Rock(310, 340);
var rock6 = new Rock(617, 340);
var rock7 = new Rock(9, 90);
var rock8 = new Rock(411, 90);
var rock9 = new Rock(210, 175);

rocks.push(rock1, rock2, rock3, rock4, rock5, rock6, rock7, rock8, rock9);

// Create Enemy class our player must avoid
var Enemy = function(x, y, originalPosition) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    Item.call(this, x, y, originalPosition);
    this.speed = 100 + Math.floor(Math.random() * 480);
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

    if (this.x > 707) {
        this.x = -70;//Bugs teleport to starting point
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

/************** PlayGame class ***************/
/************** Start, Reset, Win, Lose *************/
var PlayGame = function() {
    this.gainLifeSound = new Audio('audio/jingle-achievement.wav');
    this.getGemSound = new Audio('audio/collect-point.wav');
    this.loseLifeSound = new Audio('audio/death.wav');
    this.select = new Audio('audio/pickup.wav');
}

PlayGame.prototype.lose = function() {
    alert(`GAME OVER! Your score is ${player.score}.`);
    this.resetGame();
};

PlayGame.prototype.win = function() {
    alert(`You are the winner! Your score is ${player.score}.`);
    this.resetGame();
};

// Reset the game when game over
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

    rocks.forEach(function(rock) {
        rock.reset();
    })
};

var playGame = new PlayGame();

// Player class requires an update(), render() and
// a handleInput() method. This will track score, lives, dead
var Player = function() {
    Item.call(this, 304, 420);
    this.playerPosition = [];
    this.width = 100;
    this.height = 150;
    this.speed = 50;
    this.lives = 3;
    this.score = 0;
    this.sprite = characters[selectedChar];
    this.dead = false;
    this.getGem = false;
    this.gainLife = false;
}

Player.prototype.reset = function() {
    this.x = 304;
    this.y = 420;
    this.lives = 3;
    this.score = 0;
    this.sprite = characters[selectedChar];

    document.getElementById('lives').innerHTML = this.lives.toString();
    document.getElementById('score').innerHTML = this.score.toString();
}

// When a player collides with enemy
Player.prototype.collide = function() {
    if (this.lives === 1) {
        this.lives -= 1;
        this.score -= 2000;
        document.getElementById('lives').innerHTML = this.lives.toString();
        document.getElementById('score').innerHTML = this.score.toString();

        setTimeout(function() {
            playGame.lose();
        }, 800);

    } else if (this.lives > 1) {
        this.lives -= 1;
        this.score -= 2000;
        document.getElementById('lives').innerHTML = this.lives.toString();
        document.getElementById('score').innerHTML = this.score.toString();

        if (this.score < 0) {
            // Set timeout for alert to popup after updating lives
            setTimeout(function() {
                playGame.lose();
            }, 800);
        }
    }
};

// When hit a rock, a player cannot move pass rocks
Player.prototype.faceRock = function() {
    for(var i = 0; i < rocks.length; i++) {
        if (this.x < rocks[i].x + 50 &&
            this.x + 50 > rocks[i].x &&
            this.y < rocks[i].y + 50 &&
            this.y + 50 > rocks[i].y) {

            this.x = this.playerPosition[this.playerPosition.length-1][0];
            this.y = this.playerPosition[this.playerPosition.length-1][1];
        }
    }
};

// When a player reach water
Player.prototype.reachWater = function() {
    if (this.y < 0) {
        playGame.getGemSound.play();

        this.score += 5000;
        document.getElementById('score').innerHTML = this.score.toString();

        this.getGem = true;
        // Set timeout for a diamond to stay longer
        setTimeout(function() {
            player.getGem = false;
        }, 500);

        this.x = 304;
        this.y = 420;
    }
}

// When a player collides with an enemy
Player.prototype.checkDead = function() {
    if (!this.dead) {
        for(var i = 0; i < enemies.length; i++) {
            if (this.x < enemies[i].x + 60 &&
                this.x + 50> enemies[i].x &&
                this.y < enemies[i].y + 60 &&
                this.y + 50> enemies[i].y) {

                playGame.loseLifeSound.play();

                this.dead = true;
                // Set timeout for a cross to stay longer
                setTimeout(function() {
                    player.x = 304;
                    player.y = 420;
                    player.dead = false;
                }, 800);

                this.collide();
            }
        }
    }
};

// Collect hearts to gain lives
Player.prototype.getHeart = function() {
    for(var i = 0; i < hearts.length; i++) {
        if (this.x < hearts[i].x &&
            this.x + this.width > hearts[i].x &&
            this.y < hearts[i].y &&
            this.y + this.height > hearts[i].y) {

            playGame.gainLifeSound.play();

            collectedHearts.push([hearts[i].x, hearts[i].y]);

            this.lives += 1;
            document.getElementById('lives').innerHTML = this.lives.toString();

            this.gainLife = true;
            // Set timeout for a heart to stay longer
            setTimeout(function() {
                player.gainLife = false;
            }, 500);

            hearts[i].x = 1000;
            hearts[i].y = 1000;
        }
    }
};

// Collect gems to increase points
Player.prototype.collectGem = function() {
    for (var i = 0; i < gems.length; i++) {
        if (this.x < gems[i].x &&
            this.x + this.width > gems[i].x &&
            this.y < gems[i].y &&
            this.y + this.height > gems[i].y) {

            playGame.getGemSound.play();

            collectedGems.push(gems[i].x, gems[i].y);
            this.score += 1000;
            document.getElementById('score').innerHTML = this.score.toString();

            this.getGem = true;
            // Set timeout for a diamond to stay longer
            setTimeout(function() {
                player.getGem = false;
            }, 500);

            gems[i].x = 1000;
            gems[i].y = 1000;
        }
    }
};

// When a player reaches 30,000 points
Player.prototype.winTheGame = function() {
    if (this.score >= 20000) {
        document.getElementById('score').innerHTML = this.score.toString();

        setTimeout(function() {
            playGame.win();
        }, 10);
    }
};

// Update all events occur
Player.prototype.update = function() {
    if (this.y > 400) {
        this.y = 420;
    }
    if (this.x > 604) {
        this.x = 604;
    }
    if (this.x < 0) {
        this.x = 0;
    }
    // Hit a rock
    player.faceRock();
    // Reach the water
    player.reachWater();
    // Collide with a enemy
    player.checkDead();
    // Get heart
    player.getHeart();
    // Collect gem
    player.collectGem();
    // Win the game
    player.winTheGame();
};

// Render in each condition
Player.prototype.render = function() {
    if (this.dead) {
        // When dead, show the cross image
        ctx.drawImage(Resources.get('images/cancel.svg'), this.x + 10, this.y + 45, 80, 80);
    } else if (this.getGem) {
        // When collect a gem, show a diamond on the top of a charactor
        ctx.drawImage(Resources.get('images/diamond.svg'), this.x + 20, this.y - 15, 60, 60);
        ctx.drawImage(Resources.get(characters[selectedChar]), this.x, this.y, this.width, this.height);
    } else if (this.gainLife) {
        // When collect a heart, show a heart on the top of a charactor
        ctx.drawImage(Resources.get('images/Heart.png'), this.x + 20, this.y - 15, 60, 60);
        ctx.drawImage(Resources.get(characters[selectedChar]), this.x, this.y, this.width, this.height);
    } else {
        ctx.drawImage(Resources.get(characters[selectedChar]), this.x, this.y, this.width, this.height);
    }
};

// Press keys to move a charactor around the screen
Player.prototype.handleInput = function(keypress) {
    if (this.dead) {
        return;
    }
    switch (keypress) {
        case 'left':
            this.playerPosition.push([this.x, this.y]);// Keep x, y positions in the array
            this.x -= 101;
            break;
        case 'up':
            this.playerPosition.push([this.x, this.y]);
            this.y -= 83;
            break;
        case 'right':
            this.playerPosition.push([this.x, this.y]);
            this.x += 101;
            break;
        case 'down':
            this.playerPosition.push([this.x, this.y]);
            this.y += 83;
            break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called enemies
// Place the player object in a variable called player
// Place selected charactor in a variable called selectPlayer

var player = new Player();
var selectPlayer = new SelectPlayer();

var enemies = [];
var enemyPosition = [60, 120, 160, 230, 320];

enemyPosition.forEach((position) => {
    var enemy = new Enemy(0, position);
    enemies.push(enemy);
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

// Stop scrolling when press keys
document.onkeydown = KD;
function KD(e) {
    event.returnValue = false;
}







