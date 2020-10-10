// The engine class will only be instantiated once. It contains all the logic
// of the game relating to the interactions between the player and the
// enemy and also relating to how our enemies are created and evolve over time
class Engine {
  // The constructor has one parameter. It will refer to the DOM node that we will be adding everything to.
  // You need to provide the DOM node when you create an instance of the class
  constructor(theRoot) {
    // We need the DOM element every time we create a new enemy so we
    // store a reference to it in a property of the instance.
    this.root = theRoot;
    // We create our hamburger.
    // Please refer to Player.js for more information about what happens when you create a player
    this.player = new Player(this.root);
    // Initially, we have no enemies in the game. The enemies property refers to an array
    // that contains instances of the Enemy class
    this.enemies = [];
    // We add the background image to the game
    addBackground(this.root);
    // Add the score
    this.score = new Text(this.root, GAME_WIDTH-420, GAME_HEIGHT + 8);
    this.startingScore = 0;
    this.score.update(`SCORE: ${this.startingScore}`);
    // Add game instructions and status
    this.gameStatus = new Text(this.root, 150, GAME_HEIGHT/2)
  
    this.bonusAlert = new Text(this.root, 180, 340);
    this.bonuses = [];
  }

  // The gameLoop will run every few milliseconds. It does several things
  //  - Updates the enemy positions
  //  - Detects a collision between the player and any enemy
  //  - Removes enemies that are too low from the enemies array
  gameLoop = () => {
    // This code is to see how much time, in milliseconds, has elapsed since the last
    // time this method was called.
    // (new Date).getTime() evaluates to the number of milliseconds since January 1st, 1970 at midnight.
    if (this.lastFrame === undefined) {
      this.lastFrame = new Date().getTime();
    }

    let timeDiff = new Date().getTime() - this.lastFrame;

    this.lastFrame = new Date().getTime();
    // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
    // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
    
    this.enemies.forEach((enemy) => {
      enemy.update(timeDiff);
    });
    
    // bonus
    this.bonuses.forEach((bonus) => {
      bonus.update(timeDiff);
    });
    // We remove all the destroyed enemies from the array referred to by \`this.enemies\`.
    // We use filter to accomplish this.
    // Remember: this.enemies only contains instances of the Enemy class.
    this.enemies = this.enemies.filter((enemy) => {
      if (enemy.destroyed) {
        this.score.update(`SCORE: ${this.startingScore += 1}`);
      }
      return !enemy.destroyed;     
    });

    //bonus
    this.bonuses = this.bonuses.filter((bonus) => {
      if (bonus.wasEaten && bonus.destroyed) {
        this.score.update(`SCORE: ${this.startingScore += 100}`);
      }
      return !bonus.destroyed;     
    });
    // We need to perform the addition of enemies until we have enough enemies.    
    while (this.enemies.length < MAX_ENEMIES) {
      // We find the next available spot and, using this spot, we create an enemy.
      // We add this enemy to the enemies array
      const spot = nextEnemySpot(this.enemies);    
      this.enemies.push(new Enemy(this.root, spot));
      // Add 100 pts to the score for every generated cats
      // this.score.update(this.startingScore += 10);
    }


    // bonus
    while (this.bonuses.length < MAX_BONUS) {
      // We find the next available spot and, using this spot, we create an enemy.
      // We add this enemy to the enemies array
      const spotB = nextBonusSpot(this.bonuses);
      this.bonuses.push(new Bonus(this.root, spotB));
    }


    if (this.didPlayerEatBonus()) {
      this.bonusAlert.update("+100");
      //this.player.domElement.src = 'images/whitefish.png';
      const showBonus = setTimeout((() => {
        this.bonusAlert.update("");
       // this.player.domElement.src = 'images/yellowfish.png';
      }), 700);     
      
    }

    // We check if the player is dead. If he is, we alert the user
    // and return from the method (Why is the return statement important?)
    if (this.isPlayerDead()) {
      this.gameStatus.update("Game Over");
      //this.player.domElement.src = 'images/whitefish.png';
      return;
    }


    // If the player is not dead, then we put a setTimeout to run the gameLoop in 20 milliseconds
    setTimeout(this.gameLoop, 20);
  };

  // This method is not implemented correctly, which is why
  // the burger never dies. In your exercises you will fix this method.
  isPlayerDead = () => {
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].x == this.player.x && (this.enemies[i].y > GAME_HEIGHT - PLAYER_HEIGHT - ENEMY_HEIGHT && this.enemies[i].y < GAME_HEIGHT - ENEMY_HEIGHT)) {
       // this.player.domElement.src = 'images/whitefish.png';
        document.removeEventListener('keydown', keydownHandler);
        return true;
      } 
    }
  };


 // did player get bonus
 didPlayerEatBonus = () => {
  for (let i = 0; i < this.bonuses.length; i++) {
    if ((this.bonuses[i].x < this.player.x + PLAYER_WIDTH && this.bonuses[i].x + BONUS_WIDTH > this.player.x) &&
       (this.bonuses[i].y > GAME_HEIGHT - PLAYER_HEIGHT - BONUS_HEIGHT &&
         this.bonuses[i].y < GAME_HEIGHT - PLAYER_HEIGHT)) {
       this.bonuses[i].wasEaten = true; 
   return true;
    } 
  }
};


}


