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


// start New battle method
Game.prototype.startNewBattle = function() {
    // find out who has more agility. the character with higher agility gets first turn.
    if (this.player.agility > this.currentEnemy.agility) {
        this.isPlayerturn = true;
    } else {
        this.isPlayerturn = false;
    }
    
    // display stats
    console.log('Your stats are as follows:');
    console.table(this.player.getStats());

    // display enemy
    console.log(this.currentEnemy.getDescription());

    this.battle();
};


// battle function
Game.prototype.battle = function() {
    if (this.isPlayerturn) {
        inquirer
            .prompt({
                type: 'list',
                message: 'What would you like to do?',
                name: 'action',
                choices: ['Attack', 'Use Potion']
            })
            .then(({ action }) => {
                if (action === 'Use Potion') {
                    // nested if statement to see if player has potion in inventory
                    if (!this.player.getInventory()) {
                        console.log("You don't have any potions!");
                        return this.checkEndofBattle();
                    }
                    inquirer
                        .prompt({
                            type: 'list',
                            message: 'Which potion would your like to use?',
                            name: 'action',
                            choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                        })
                        .then (({ action }) => {
                            const potionDetails = action.split(': ');

                            this.player.usePotion(potionDetails[0] - 1);
                            console.log(`You used a ${potionDetails[1]} potion.`);
                            
                            this.checkEndofBattle();
                        });
                } else {
                    const damage = this.player.getAttackValue();
                    this.currentEnemy.reduceHealth(damage);
                    
                    console.log(`You attacked ${this.currentEnemy.name}`);
                    console.log (this.currentEnemy.getHealth());
                    
                    this.checkEndofBattle();
                }   
            })
    } else {
        const damage = this.currentEnemy.getAttackValue();
        this.player.reduceHealth(damage);

        console.log(`You were attacked by the ${this.currentEnemy.name}`);
        console.log(this.player.getHealth());

        this.checkEndofBattle();
    }
};

Game.prototype.checkEndofBattle = function() {
    if (this.player.isAlive() && this.currentEnemy.isAlive()) {
        this.isPlayerturn = !this.isPlayerturn;
        this.battle();
    } else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
        console.log(`You've defeated the ${this.currentEnemy.name}`);

        this.player.addPotion(this.currentEnemy.potion);
        console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion`);

        this.roundNumber++;

        if (this.roundNumber < this.enemies.length) {
            this.currentEnemy = this.enemies[this.roundNumber];
            this.startNewBattle();
        } else {
            console.log('You win!');
        }
    } else {
        console.log("You have been defated!");
    }
};

module.exports = Game;