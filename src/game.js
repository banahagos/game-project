
// Get canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Variables
let frames = 0;

// Game state 
const state = {
  current: 0,
  start: 0,
  game: 1,
  over: 2,
  startLevelTwo: 3,
};


canvas.onclick = function (e) {
  switch (state.current) {
    case state.start: state.current = state.game;
      break;
    case state.over: 
    score.currentScore = 0;
    mainCharacter.reset();
    obstacle.reset();
    state.current = state.start;
      break;
    case state.startLevelTwo: 
    score.currentScore = score.currentScore + 10
    state.current = state.game;
    mainCharacter.reset();
    obstacle.reset();
      break;

  }
};



// Load the background image
const backgroundImg = new Image();
backgroundImg.src = "./img/testbackground.png";

// Load the main character
const mainCharacterImg = new Image();
mainCharacterImg.src = "./img/ghost.png";

// Load start button
const startButtonImg = new Image();
startButtonImg.src = "./img/play.png";

// Load game over image
const gameOverImg = new Image();
gameOverImg.src = "./img/gameover.png";

// Load obstacles
const obstacleImg = new Image();
obstacleImg.src = "./img/satellite3.png";

// Load image for levelTwo screen
const levelUpImg = new Image();
levelUpImg.src = "./img/levelUp.png";

// Score

const score = {
  currentScore: 0,
  scoreToReachLevelTwo: 5,
  startScoreLevelTwo: 15,


  update(){
    // update the score board in DOM
    let scoreboard = document.getElementById('userScore');
    scoreboard.innerHTML = this.currentScore;

    //change to Level 2 start screen when players reached certain amount of scores
    if(this.currentScore === this.scoreToReachLevelTwo){
      state.current = state.startLevelTwo;
    }
  }
}

// Background
const background = {
  w: canvas.width,
  h: canvas.height,
  x: 0,
  x2: 800,
  y: 0,
  dx: 2,


  draw() {
    if (state.current === state.start) {
      ctx.drawImage(backgroundImg, 0, 0, this.w, this.h);
      ctx.drawImage(backgroundImg, this.x2, 0, this.w, this.h);
    }
  },

  update() {
    if (state.current === state.game) {

      ctx.drawImage(backgroundImg, this.x--, 0, this.w, this.h);
      ctx.drawImage(backgroundImg, this.x2--, 0, this.w, this.h);
      if (this.x <= -799) {
        this.x = 800;
      }
      if (this.x2 <= -799) {
        this.x2 = 800;
      }
    }
  }


};


// mainCharacter
const mainCharacter = {
  x: 50,
  y: 150,
  w: 50,
  h: 50,
  speed: 0,
  gravity: 0.0005,

  draw() {
    ctx.drawImage(mainCharacterImg, this.x, this.y, this.w, this.h)
  },

  update() {
    if (state.current === state.start) {
      this.y = 150;
    }

    if (state.current == state.game) {
      this.speed += this.gravity;
      this.y += this.speed;
      if (this.y + 50 >= canvas.height) {
        this.y === canvas.height;
        state.current = state.over
      }
    }
  },

  moveUp() {
    this.y -= 15;
  },

  moveDown() {
    this.y += 10;

  },

  reset(){
    this.speed = 0;
  },
};

// Obstacles
const obstacle = {
  position: [],
  w: 10,
  h: 300,
  gap: 100,
  maxYPos: -80,
  dx: 2,
  dxLevelTwo: 3,
  speed: 0,
  accelerator: 0.25,

  draw() {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let topYPos = p.y;
      let bottomYP = p.y + this.h + this.gap;

      // top
      ctx.drawImage(obstacleImg, p.x, topYPos, this.w, this.h)
      // bottom
      ctx.drawImage(obstacleImg, p.x, bottomYP, this.w, this.h)
    }
  },

  update() {
    if (state.current !== state.game) return;
    if (frames % 100 == 0) {
      // different positions for top obstacle
      this.position.push({
        x: canvas.width,
        y: this.maxYPos * (Math.random() + 1.5)
      });
    };

   
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      
      //move obstacles to the left
      p.x -= this.dx;
     
  
      
      
      
      // collision detection
      let bottomYP = p.y + this.h + this.gap;
          //main character
      let characterLeft = mainCharacter.x;
      let characterTop = mainCharacter.y;
      let characterRight = mainCharacter.x + mainCharacter.w;
      let characterBottom = mainCharacter.y + mainCharacter.h;

          //top obstacle
      let tObstacleLeft = p.x;
      let tObstacleTop = p.y;
      let tObstacleRight = p.x + this.w;
      let tObstacleBottom = p.y + this.h;

          //bottom obstacle
      let bObstacleLeft = p.x;
      let bObstacleTop = bottomYP;
      let bObstacleRight = p.x + this.w;
      let bObstacleBottom = bottomYP + this.h;

        // detect collision with top obstacle
        if(characterRight > tObstacleLeft && characterLeft < tObstacleRight && characterBottom > tObstacleTop && characterTop < tObstacleBottom){
          state.current = state.over;
        }

        // detect collision with bottom obsctale
        if(characterRight > bObstacleLeft && characterLeft < bObstacleRight && characterBottom > bObstacleTop && characterTop < bObstacleBottom){
          state.current = state.over;
        }

// delete obstacle from postion array when off the canvas
// increase the score
      if (p.x + this.w <= 0) {
        this.position.shift();
        score.currentScore += 1;
      };

    }
  },
  
  reset(){
    this.position = [];
  },

};

const startScreen = {
  w: 130,
  h: 130,
  x: 330,
  y: 150,

  draw() {
    if (state.current == state.start) {
      ctx.drawImage(startButtonImg, this.x, this.y, this.w, this.h)
    }
  }
};

const gameOverScreen = {
  w: 250,
  h: 150,
  x: 270,
  y: 150,

  draw() {
    if (state.current == state.over) {
      ctx.drawImage(gameOverImg, this.x, this.y, this.w, this.h)
    }
  }
};

const levelTwoStartScreen = {
  w: 250,
  h: 150,
  x: 270,
  y: 150,

  draw(){
    if(state.current === state.startLevelTwo){
      ctx.drawImage(levelUpImg, this.x, this.y, this.w, this.h)
    
    }
  }
}

// Draw
function draw() {
  background.draw();
  mainCharacter.draw();
  startScreen.draw();
  gameOverScreen.draw();
  obstacle.draw();
  levelTwoStartScreen.draw();
};


// Update
function update() {
  mainCharacter.update();
  background.update();
  obstacle.update();
  score.update();

};

// Loop
function loop() {
  update();
  draw();
  frames++;

  requestAnimationFrame(loop)
};


window.onload = function () {
  loop();
  document.onkeydown = function (e) {
    if (e.keyCode === 38) {
      if (state.current == state.game) {
        mainCharacter.moveUp();
      }
    }
    if (e.keyCode === 40) {
      if (state.current == state.game) {
        mainCharacter.moveDown();
      }
    }
  }
}
