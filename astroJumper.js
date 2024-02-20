let speed = 0;
let gravitySpeed = 0.1;
let rocketSpeed = 0.4;
let rotation = 0;
let rotationSpeed = 0.05;
let sHasBeenPressed = false;
let translateX = -360;
let translateY = 0;
let spaceColor = color(13, 15, 40);
let atmosphereColor = color(26, 25, 60);
let earthColor = color(229, 39, 137);
let starX = [];
let starY = [];
let starSize = [];
let starBrightness = [];
let starsDrawn = false;
let gameStart = false;
let menuHasBeenDrawn = false;
let gradientBg = drawingContext.createLinearGradient(720, 0, 720, 3600);
let gradientHomeBg = drawingContext.createLinearGradient(width / 2, 0, width / 2, height);
let font;
function preload() {
  font = loadFont("ClashDisplay-Medium.otf");
}
function setup() {
  createCanvas(720, 600);
  noStroke();
}

function draw() {
  clear();
  if (gameStart) {
    drawGame();
  } else {
    drawMainMenu();
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
  translate(translateX, translateY);
  drawingContext.fillStyle = gradientBg;
  rect(0, 0, 1440, 3600); // background

  //stars
  drawStars(1000);
  pop(); //everything that moves pop

  push(); //everything that doesn't move push(character)
  //character
  sHasBeenPressed = false;
  translate(360, 70);
  rotate(rotation);
  if (keyIsDown(83)) {
    // S key for moving up
    sHasBeenPressed = true;
    if (speed <= 6) {
      //to make the speed a maximum of 6
      speed += rocketSpeed;
    }
    if (speed >= 0) {
      //to make it not move backwards before speeding up on the X axis
      translateX -= Math.sin(rotation) * speed; //movement on the X axis
    }
    translateY += Math.cos(rotation) * speed; //movement on the Y axis
  } else {
    if (speed > -4) {
      //gravity
      speed -= gravitySpeed;
    }
    translateY += speed;
    if (speed > 0) {
      //to keep it moving to the sides after 'S' button has been released
      translateX -= Math.sin(rotation) * speed;
    }
  }
  if (keyIsDown(65)) {
    // A key for rotating right
    if (rotation > -1.5) {
      //to stop it from moving upside down to the right
      rotation -= rotationSpeed;
    }
  }
  if (keyIsDown(68)) {
    // D key for rotating left
    if (rotation < 1.5) {
      //to stop it from moving upside down to the left
      rotation += rotationSpeed;
    }
  }
  print(speed); //speed for testing
  //the rocket
  fill(100, 100, 100);
  rect(0, 0, 50, 150);
  pop(); //everything that doesn't move pop
}
function drawMainMenu() {
  if (!menuHasBeenDrawn) {
    let btn = createButton("click me");
    menuHasBeenDrawn = true;
  }
  gradientHomeBg.addColorStop(0, spaceColor);
  gradientHomeBg.addColorStop(0.6, spaceColor);
  gradientHomeBg.addColorStop(1, earthColor);
  translate(0, 0);
  drawingContext.fillStyle = gradientHomeBg;
  rect(0, 0, width, height); // background
  translate(width / 2, height / 2);
  textSize(50);
  fill("white");
  textFont(font);
  text("Astro", -125, -140);
  text("Jumper", -66, -104);
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
