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
    this.x = this.col + 100;
    this.y = 395;
    this.sprite = 'images/Selector.png';
}

// Get input from a player when they move selector
SelectPlayer.prototype.handleInput = function(keypress) {
    switch (keypress) {
        case 'left':
            this.col > 0 ? (this.col--, this.x = this.col * 101 + 100) : this.col;
            break;
        case 'right':
            this.col < 4 ? (this.col++, this.x = this.col * 101 + 100) : this.col;
            break;
        case 'enter':
            selectedChar = this.col;
            play = true;
            playGame.select.play();
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

var gem1 = new Gem(414, 350);
var gem2 = new Gem(212, 100);
var gem3 = new Gem(10, 185);
var gem4 = new Gem(617, 270);

gems.push(gem1, gem2, gem3, gem4);

var collectedGems = [];

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


rocks.push(rock1, rock2, rock3, rock4, rock5, rock6, rock7);

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
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

    if (this.x > 707) {
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
};

var playGame = new PlayGame();

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = 304;
    this.y = 420;
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
            setTimeout(function() {
                playGame.lose();
            }, 800);
        }
    }
};

Player.prototype.faceRock = function() {
    for(var i = 0; i < rocks.length; i++) {
        if (this.x < rocks[i].x + 50 &&
            this.x + 40 > rocks[i].x &&
            this.y < rocks[i].y + 50 &&
            this.y + 40 > rocks[i].y) {

            this.x = this.playerPosition[this.playerPosition.length-1][0];
            this.y = this.playerPosition[this.playerPosition.length-1][1];
        }
    }
};

Player.prototype.reachWater = function() {
    if (this.y < 0) {
        playGame.getGemSound.play();

        this.score += 5000;
        document.getElementById('score').innerHTML = this.score.toString();

        this.getGem = true;
        setTimeout(function() {
            player.getGem = false;
        }, 500);

        this.x = 304;
        this.y = 420;
    }
}

Player.prototype.checkDead = function() {
    if (!this.dead) {
        for(var i = 0; i < enemies.length; i++) {
            if (this.x < enemies[i].x + 50 &&
                this.x + 40> enemies[i].x &&
                this.y < enemies[i].y + 50 &&
                this.y + 40> enemies[i].y) {

                playGame.loseLifeSound.play();

                this.dead = true;
                setTimeout(function() {
                    player.x = 203;
                    player.y = 420;
                    player.dead = false;
                }, 800);

                this.collide();
            }
        }
    }
};

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
            setTimeout(function() {
                player.gainLife = false;
            }, 500);

            hearts[i].x = 1000;
            hearts[i].y = 1000;
        }
    }
};

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
            setTimeout(function() {
                player.getGem = false;
            }, 500);

            gems[i].x = 1000;
            gems[i].y = 1000;
        }
    }
};

Player.prototype.winTheGame = function() {
    if (this.score >= 100000) {
        document.getElementById('score').innerHTML = this.score.toString();
        setTimeout(function() {
            playGame.win();
        }, 10);
    }
};

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
    player.reachWater();
    player.checkDead();
    player.getHeart();
    player.collectGem();
    player.winTheGame();
    player.faceRock();
};

Player.prototype.render = function() {
    if (this.dead) {
        ctx.drawImage(Resources.get('images/cancel.svg'), this.x + 10, this.y + 45, 80, 80);
    } else if (this.getGem) {
        ctx.drawImage(Resources.get('images/diamond.svg'), this.x + 20, this.y - 15, 60, 60);
        ctx.drawImage(Resources.get(characters[selectedChar]), this.x, this.y, this.width, this.height);
    } else if (this.gainLife) {
        ctx.drawImage(Resources.get('images/Heart.png'), this.x + 20, this.y - 15, 60, 60);
        ctx.drawImage(Resources.get(characters[selectedChar]), this.x, this.y, this.width, this.height);
    } else {
        ctx.drawImage(Resources.get(characters[selectedChar]), this.x, this.y, this.width, this.height);
    }
};

Player.prototype.handleInput = function(keypress) {
    if (this.dead) {
        return;
    }
    switch (keypress) {
        case 'left':
            this.playerPosition.push([this.x, this.y]);
            console.log(this.playerPosition);
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

document.onkeydown = KD;
function KD(e) {
    event.returnValue = false;
}







