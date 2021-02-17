const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');

// game constructor
function Game() {
    this.roundNumber = 0;
    this.isPlayerturn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
};

// initialize game method
Game.prototype.initializeGame = function() {
    // add enemies to enemies array
    this.enemies.push(new Enemy('goblin', 'sword'));
    this.enemies.push(new Enemy('orc', 'club'));
    this.enemies.push(new Enemy('skeleton', 'axe'));

    // set currente enemy 
    this.currentEnemy = this.enemies[0];

    // ask user for thier name
    inquirer
        .prompt({
            type: 'text',
            name: 'name',
            message: 'What is your name?'
        })
        // destructure name from the prompt object
        .then(({ name }) => {
            this.player = new Player(name);
            // start the battle!
            this.startNewBattle();
        });

        
};  

module.exports = Game;