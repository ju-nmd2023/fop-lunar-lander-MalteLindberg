function setup() {
  createCanvas(720, 600);
  noStroke();
}
let speed = 0;
let gravitySpeed = 0.1;
let rocketSpeed = 5;
let rotation = 0;
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

function draw() {
  clear();
  push(); //everything that moves push(environment)
  //gradient background
  let gradientBg = drawingContext.createLinearGradient(720, 0, 720, 3600);
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
      speed += 0.4;
    }
    translateX -= Math.sin(rotation) * speed;
    translateY += Math.cos(rotation) * speed;
  } else {
    if (speed < 0) {
    }
    translateY += speed; //gravity
    if (speed > 0) {
      translateX -= Math.sin(rotation) * speed;
    }
  }
  if (keyIsDown(65)) {
    // A key for rotating right
    if (rotation > -1.5) {
      rotation -= 0.05;
    }
  }
  if (keyIsDown(68)) {
    // D key for rotating left
    if (rotation < 1.5) {
      rotation += 0.05;
    }
  }
  print(speed);
  //the rocket
  fill(100, 100, 100);
  rect(0, 0, 50, 150);
  pop(); //everything that doesn't move pop

  if (speed > -4 && sHasBeenPressed === false) {
    speed -= gravitySpeed;
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
