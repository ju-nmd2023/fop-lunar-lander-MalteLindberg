let gameStart = false;
let gameOver = false;
let gameOverHasBeenDrawn = false;
let gradientBg;
let velocity = 0;
let gravitySpeed = 0.08;
let maxVelocity = 6;
let minVelocity = -8;
let rocketSpeed = 0.4;
let rotation = 0;
let rotationSpeed = 0.05;
let sHasBeenPressed = false;
let translateX = -320;
let translateY = 0;
let starX = [];
let starY = [];
let starSize = [];
let starBrightness = [];
let starsDrawn = false;
let menuHasBeenDrawn = false;
let gradientHomeBg;
let spaceColor;
let atmosphereColor;
let earthColor;
let mountainImg;
let landingPadImg;
let landingPadX = 0;
let landingPadY = 4500;
let landingPadHasBeenCreated = false;
let characterX = 720;
let characterY = translateY - 70;
let menuTranslateX = 0;
let menuTranslateY = 0;
let menuRotation = 0;
let menuMovingRight = true;
let menuMovingDown = true;
let menuMovingSpeed = 1.5;
let characterTranslateX = 360;
let characterTranslateY = 70;
let gameLost = false;
let gameWon = false;
let gameOverText = "";
let leftAtmosphereText = "";
let drawGuide = false;
function preload() {
  mountainImg = loadImage("assets/mountains.png");
  landingPadImg = loadImage("assets/landingPad.png");
}
function setup() {
  let canvas = createCanvas(720, 600);
  frameRate(30);
  noStroke();
  gradientBg = drawingContext.createLinearGradient(720, 0, 720, 5000);
  gradientHomeBg = drawingContext.createLinearGradient(width / 2, 0, width / 2, height * 1.3);
  spaceColor = color(13, 15, 40);
  atmosphereColor = color(26, 25, 60);
  earthColor = color(229, 39, 137);
}

function draw() {
  if (gameStart) {
    clear();
    drawGame();
    collisionDetection();
    drawStatistics();
    landingWarning();
  } else if (gameOver) {
    drawGameOver();
  } else {
    clear();
    drawMainMenu();
    guideWindow();
  }
}
function drawGame() {
  push(); //everything that moves push(environment)
  //gradient background inspired by https://www.youtube.com/watch?v=-MUOweQ6wac&ab_channel=KazukiUmeda on 2024-02-01.
  gradientBg.addColorStop(0, spaceColor);
  gradientBg.addColorStop(0.05, spaceColor);
  gradientBg.addColorStop(0.2, atmosphereColor);
  gradientBg.addColorStop(0.3, atmosphereColor);
  gradientBg.addColorStop(1, earthColor);
  translate(translateX, translateY); //movement of the environment
  drawingContext.fillStyle = gradientBg;
  rect(0, 0, 1440, 5000); // background
  drawStars(1000); //stars
  image(mountainImg, 0, 3516); //mountains
  createLandingPad(); //landing pad
  pop(); //everything that moves pop

  push(); //everything that doesn't move push(character)
  //character
  sHasBeenPressed = false;
  translate(characterTranslateX, characterTranslateY);
  rotate(rotation);
  if (keyIsDown(40)) {
    // DOWN ARROW key for moving up
    sHasBeenPressed = true;
    if (velocity <= maxVelocity) {
      //to make the velocity stop going up
      velocity += rocketSpeed;
    }
    if (velocity >= 0) {
      //to make it not move backwards before speeding up on the X axis
      translateX -= Math.sin(rotation) * velocity; //movement on the X axis
      characterX -= Math.sin(rotation) * velocity; //to make the collision detection work
    }
    translateY += Math.cos(rotation) * velocity; //movement on the Y axis
    characterY += Math.cos(rotation) * velocity; //to make the collision detection work
  } else {
    if (velocity > minVelocity) {
      velocity -= gravitySpeed; //gravity
    }
    translateY += velocity;
    characterY += velocity; //to make the collision detection work
    if (velocity > 0) {
      //to keep it moving to the sides after 'S' button has been released
      translateX -= Math.sin(rotation) * velocity;
      characterX -= Math.sin(rotation) * velocity; //to make the collision detection work
    }
  }
  if (keyIsDown(37)) {
    if (rotation > -1.5) {
      rotation -= rotationSpeed; //to stop it from moving upside down to the right
    }
  }
  if (keyIsDown(39)) {
    if (rotation < 1.5) {
      rotation += rotationSpeed; //to stop it from moving upside down to the left
    }
  }
  drawCharacter();
  pop(); //everything that doesn't move pop
}
function drawMainMenu() {
  if (!menuHasBeenDrawn) {
    menuHasBeenDrawn = true;
  }
  push();
  gradientHomeBg.addColorStop(0, spaceColor);
  gradientHomeBg.addColorStop(0.6, spaceColor);
  gradientHomeBg.addColorStop(1, earthColor);
  drawingContext.fillStyle = gradientHomeBg;
  rect(0, 0, width, height); // background
  drawStars(1000);
  translate(width / 2, height / 2);
  textSize(80);
  textFont("Hoover");
  fill("white");
  text("Astro", -145, -100);
  text("Jumper", -84, -44);
  translate(-width / 2, -height / 2);
  if (frameCount % 60 < 40 && drawGuide === false) {
    textAlign(CENTER);
    fill("white");
    textSize(20);
    text("Press 'I' for instructions", 720 / 2, 420);
    text("Press 'SPACE' to start", 720 / 2, 460);
  }
  if (keyIsDown(32) && drawGuide === false) {
    gameStart = true;
    menuHasBeenDrawn = false;
    gameOver = false;
  }
  if (keyIsDown(73)) {
    drawGuide = true;
  }
  pop();
  push();
  if (menuTranslateX > 680) {
    if (menuMovingRight === true) {
      menuMovingRight = false;
    }
  }
  if (menuTranslateX < 20) {
    if (menuMovingRight === false) {
      menuMovingRight = true;
    }
  }
  if (menuTranslateY > 580) {
    if (menuMovingDown === true) {
      menuMovingDown = false;
    }
  }
  if (menuTranslateY < 20) {
    if (menuMovingDown === false) {
      menuMovingDown = true;
    }
  }
  if (menuMovingRight === true) {
    menuTranslateX += menuMovingSpeed;
  }
  if (menuMovingRight === false) {
    menuTranslateX -= menuMovingSpeed;
  }
  if (menuMovingDown === true) {
    menuTranslateY += menuMovingSpeed;
  }
  if (menuMovingDown === false) {
    menuTranslateY -= menuMovingSpeed;
  }
  menuRotation += 0.01;
  translate(menuTranslateX, menuTranslateY);
  rotate(menuRotation);
  drawCharacter();
  pop();
}
function guideWindow() {
  if (drawGuide) {
    push();
    fill("rgba(5, 5, 5, 0.4)");
    rectMode(CENTER);
    rect(360, 300, 720, 600);
    fill("rgba(5, 5, 5, 0.8)");
    rect(360, 300, 360, 300, 20);
    textSize(40);
    fill("white");
    textFont("Hoover");
    textAlign(CENTER);
    text("INSTRUCTIONS", 720 / 2, 220);
    textSize(15);
    text("Use the 'UP ARROW' to fly", 720 / 2, 260);
    text("Use the 'LEFT ARROW' and 'RIGHT ARROW' to rotate", 720 / 2, 290);
    text("Find and land on the landing pad to win", 720 / 2, 320);
    text("If you land too hard or leave the atmosphere, you lose", 720 / 2, 350);
    textSize(20);
    if (frameCount % 60 < 40) {
      text("Press 'ESC' to go back", 720 / 2, 420);
    }
    pop();
  }
  if (keyIsDown(27)) {
    drawGuide = false;
  }
}
function drawStars(amount) {
  if (starsDrawn === false) {
    for (let i = 0; i < amount; i++) {
      starX[i] = random(0, 1440);
      starY[i] = random(0, 1900);
      starSize[i] = random(1, 4);
      let position = 1 - starY[i] / 1900;
      let brightness = random(70, 100) * position;
      starBrightness[i] = brightness;
    }
    starsDrawn = true;
  }
  for (let i = 0; i < amount; i++) {
    fill(255, 255, 255, starBrightness[i]);
    ellipse(starX[i], starY[i], starSize[i], starSize[i]);
  }
}
function drawCharacter() {
  if (velocity <= 7) {
    scale(0.45);
    strokeJoin(ROUND);
    //legs up (falling)
    if (sHasBeenPressed && frameCount % 10 < 8) {
      fill(254, 97, 52);
      stroke(44, 42, 45);
      strokeWeight(3);
      beginShape(); //jetpack thrusts orange
      vertex(-88, 140);
      bezierVertex(-88, 140, -100, 160, -100, 170);
      bezierVertex(-100, 170, -92, 160, -90, 165);
      bezierVertex(-90, 165, -110, 190, -100, 200);
      bezierVertex(-100, 200, -95, 185, -90, 185);
      bezierVertex(-85, 185, -95, 215, -95, 215);
      vertex(-90, 215);
      vertex(-90, 240);
      bezierVertex(-90, 240, -75, 230, -75, 220);
      vertex(-71, 224);
      vertex(-60, 200);
      vertex(-60, 150);
      endShape();
      fill(255, 169, 50);
      beginShape(); //jetpack thrusts yellow
      vertex(-77, 150);
      vertex(-83, 165);
      bezierVertex(-83, 165, -79, 160, -77, 163);
      bezierVertex(-75, 165, -82, 178, -80, 180);
      bezierVertex(-80, 182, -75, 172, -75, 172);
      bezierVertex(-75, 172, -86, 200, -85, 205);
      bezierVertex(-83, 205, -70, 182, -70, 180);
      vertex(-60, 150);
      endShape();
    }
    strokeWeight(5);
    fill(255, 255, 255);
    stroke(44, 42, 45);
    beginShape(); //jetpack outline
    vertex(-40, 50);
    bezierVertex(-40, 50, -80, 40, -85, 80);
    bezierVertex(-85, 80, -87, 95, -87, 95);
    bezierVertex(-87, 95, -95, 148, -77, 148);
    bezierVertex(-77, 148, -43, 158, -40, 155);
    endShape();
    beginShape(); //jetpack corner detail
    vertex(-76, 60);
    bezierVertex(-73, 75, -40, 70, -40, 70);
    endShape();
    rotate(PI / 2);
    rect(93, 68, 25, 18, 15);
    rotate(-PI / 2);
    noStroke();
    beginShape(); //body white color fill
    vertex(-60, 56);
    vertex(-50, 150);
    vertex(-25, 185);
    vertex(0, 145);
    vertex(0, 170);
    vertex(40, 170);
    vertex(33, 100);
    vertex(26, 50);
    endShape();
    stroke(44, 42, 45);
    beginShape(); //his right leg outline 1 (foot and upper left part)
    vertex(37, 175);
    bezierVertex(60, 208, 15, 210, 15, 210);
    bezierVertex(-5, 210, -10, 185, -10, 185);
    bezierVertex(-10, 165, 0, 145, 0, 145);
    endShape();
    beginShape(); //his left leg outline 2 (upper right part)
    vertex(37, 100);
    bezierVertex(38, 110, 44, 150, 37, 170);
    bezierVertex(31, 188, 15, 185, 15, 185);
    endShape();
    beginShape(); //his left leg outline 2 (upper left part)
    vertex(-25, 185);
    bezierVertex(5, 220, -45, 218, -45, 218);
    bezierVertex(-68, 215, -70, 188, -70, 188);
    bezierVertex(-75, 178, -60, 140, -60, 130);
    endShape();
    noFill();
    beginShape(); //his left leg knee outline
    vertex(-5, 160);
    bezierVertex(-5, 160, 25, 175, 40, 160);
    endShape();
    beginShape(); //his right leg knee outline
    vertex(-60, 148);
    bezierVertex(-25, 170, -9, 160, -9, 160);
    endShape();
    beginShape(); //his right leg and crotch outline 1 (upper right part)
    vertex(19, 132);
    bezierVertex(15, 138, 0, 145, 0, 145);
    bezierVertex(-3, 152, -10, 165, -25, 185);
    bezierVertex(-30, 195, -45, 195, -45, 195);
    endShape();
    fill(255, 255, 255);
    beginShape(); //his left arm
    vertex(5, 36);
    bezierVertex(35, 40, 65, 90, 65, 90);
    bezierVertex(78, 105, 65, 120, 65, 120);
    bezierVertex(50, 130, 35, 105, 35, 105);
    endShape();
    noFill();
    beginShape(); //his left arm thumb
    vertex(55, 87);
    bezierVertex(72, 125, 40, 90, 40, 90);
    endShape();
    fill(255, 255, 255);
    beginShape(); //his left arm band and armpit
    vertex(0, 40);
    bezierVertex(0, 40, 20, 75, 18, 80);
    bezierVertex(18, 80, 28, 64, 47, 67);
    endShape();
    rotate(-0.2);
    rect(-48, 75, 63, 40, 17); //stomach air unit
    rotate(0.2);
    beginShape(); //air unit left detail
    vertex(-10, 80);
    bezierVertex(-10, 80, -18, 80, -15, 99);
    bezierVertex(-10, 118, -5, 118, -5, 118);
    endShape();
    beginShape(); //air unit right detail
    vertex(15, 76);
    vertex(20, 90);
    vertex(15, 96);
    vertex(20, 110);
    endShape();
    rotate(-0.2);
    fill(35, 168, 240);
    ellipse(-18, 95, 17, 15); //stomach air unit blue light
    fill(255, 255, 255);
    rotate(0.2);
    beginShape(); //stomach tube
    vertex(-40, 95);
    bezierVertex(-40, 95, -26, 90, -23, 97);
    bezierVertex(-23, 97, -20, 105, -39, 105);
    endShape();
    beginShape(); //his right arm
    vertex(-60, 56);
    bezierVertex(-80, 60, -80, 130, -57, 150);
    bezierVertex(-37, 160, -37, 120, -35, 135);
    bezierVertex(-48, 140, -12, 125, -40, 105);
    bezierVertex(-40, 105, -41, 78, -38, 75);
    endShape();
    noFill();
    beginShape(); //his right arm band
    vertex(-40, 92);
    bezierVertex(-52, 82, -57, 85, -73, 89);
    endShape();
    rotate(-0.1);
    //Head
    stroke(44, 42, 45);
    strokeWeight(5);
    fill(255, 255, 255);
    ellipse(-35, -8, 155, 130); //helmet outline
    //helmet window
    rectMode(CENTER);
    noFill();
    stroke(44, 42, 45); //window outline stroke
    strokeWeight(5);
    rect(-20, -10, 115, 75, 50); //window ouline rectangle
    noStroke();
    fill(44, 42, 45);
    rect(-10, -8, 100, 68, 50); //window black part
    fill(255, 255, 255);
    ellipse(-50, -28, 20, 25); //window small circle reflection
    strokeWeight(1.75);
    stroke(255, 255, 255);
    push(); // star reflection push
    translate(-56, -10);
    rotate(-PI);
    line(-30, 10, -50, 10);
    line(-80, -10, -65, -10);
    line(-25, -16, -27, -16);
    line(-65, 20, -67, 20);
    line(-40, -26, -57, -26);
    line(-51, 0, -52, 0);
    pop();
    rotate(0.05);
  }
  if (velocity > 0) {
    //legs down (flying)
  }
}
function createLandingPad() {
  if (!landingPadHasBeenCreated) {
    landingPadX = random(30, 1210);
  }
  image(landingPadImg, landingPadX, landingPadY, 200, 200);
  landingPadHasBeenCreated = true;
}
function collisionDetection() {
  if (Math.abs(translateY) > 4400 && Math.abs(translateY) < 4670) {
    if (1420 - characterX > landingPadX && 1420 - characterX < landingPadX + 200) {
      if (velocity > -4 && velocity < 1) {
        //landing pad collision
        gameOverText = "You have landed safely";
        gameWon = true;
        gameOver = true;
        gameStart = false;
      } else {
        gameOverText = "You need to land softly";
        gameLost = true;
        gameOver = true;
        gameStart = false;
      }
    }
  }
  if (translateY < -4950 || translateY > 50 || translateX < -1160 || translateX > 450) {
    gameOverText = "You have left the atmosphere";
    leftAtmosphereText = "You need to land on the landing pad";
    gameLost = true;
    gameOver = true;
    gameStart = false;
  }
}
function drawGameOver() {
  //transparent overlay
  if (!gameOverHasBeenDrawn && gameWon) {
    push();
    fill("rgba(43, 41, 44, 0.5)");
    rectMode(CENTER);
    rect(360, 300, 720, 600);
    rect(360, 300, 360, 300, 20);
    textSize(50);
    fill("white");
    textFont("Hoover");
    textAlign(CENTER);
    text("YOU WON!", 720 / 2, 220);
    textSize(18);
    text(gameOverText, 720 / 2, 260);
    textSize(20);
    text("Press 'ESC' to go home", 720 / 2, 420);
    text("Press 'R' to restart", 720 / 2, 380);
    pop();
    gameOverHasBeenDrawn = true;
  }
  if (!gameOverHasBeenDrawn && gameLost) {
    push();
    fill("rgba(43, 41, 44, 0.5)");
    rectMode(CENTER);
    rect(360, 300, 720, 600);
    rect(360, 300, 360, 300, 20);
    textSize(50);
    fill("white");
    textFont("Hoover");
    textAlign(CENTER);
    text("YOU LOST!", 720 / 2, 220);
    textSize(18);
    text(gameOverText, 720 / 2, 260);
    if (leftAtmosphereText != "") {
      text(leftAtmosphereText, 720 / 2, 290);
    }
    textSize(20);
    text("Press 'ESC' to go home", 720 / 2, 420);
    text("Press 'R' to restart", 720 / 2, 380);
    pop();
    gameOverHasBeenDrawn = true;
    leftAtmosphereText = "";
  }
  if (keyIsDown(82)) {
    // R key for restarting
    gameOver = false;
    gameOverHasBeenDrawn = false;
    gameStart = true;
    translateX = -320;
    translateY = 0;
    characterX = 720;
    characterY = translateY - 70;
    landingPadHasBeenCreated = false;
    velocity = 0;
    starsDrawn = false;
    gameLost = false;
    gameWon = false;
  }
  if (keyIsDown(27)) {
    // ESC key for going home
    gameOver = false;
    gameOverHasBeenDrawn = false;
    gameStart = false;
    menuHasBeenDrawn = false;
    translateX = -320;
    translateY = 0;
    characterX = 720;
    characterY = translateY - 70;
    landingPadHasBeenCreated = false;
    velocity = 0;
    starsDrawn = false;
    gameLost = false;
    gameWon = false;
    clear();
  }
}
function drawStatistics() {
  fill("white");
  textSize(20);
  textFont("Hoover");

  let roundedVelocity = Math.round(velocity * 10) / 100;
  text("velocity: " + roundedVelocity, 25, 25);
}
function landingWarning() {
  print(translateY);
  if (translateY < -3800) {
    push();
    fill("rgb(27, 27, 27)");
    rect(10, 515, 346, 71);
    push();
    noFill();
    stroke("white");
    strokeWeight(4);
    rect(10, 515, 346, 71);
    pop();
    textSize(18);
    fill("white");
    text("Find the PLATFORM in the WATER,", 55, 545);
    text("and land SOFTLY to WIN.", 55, 565);
    pop();
  }
}
