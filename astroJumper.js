let speed = 0;
let gravitySpeed = 0;
let rocketSpeed = 0.4;
let rotation = 0;
let rotationSpeed = 0.05;
let sHasBeenPressed = false;
let translateX = -360;
let translateY = -2800;
let spaceColor = color(13, 15, 40);
let atmosphereColor = color(26, 25, 60);
let earthColor = color(229, 39, 137);
let starX = [];
let starY = [];
let starSize = [];
let starBrightness = [];
let starsDrawn = false;
let gameStart = true;
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
  drawCharacter();
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
function drawCharacter() {
  if (speed <= 7) {
    //legs up (falling)
    scale(0.5);
    strokeJoin(ROUND);
    strokeWeight(5);
    beginShape(); //jetpack thrusts

    endShape();
    fill(255, 255, 255);
    stroke(44, 42, 45);
    beginShape(); //jetpack outline
    vertex(-50, 50);
    bezierVertex(-50, 50, -90, 40, -95, 80);
    bezierVertex(-95, 80, -97, 95, -97, 95);
    bezierVertex(-97, 95, -105, 148, -87, 148);
    bezierVertex(-87, 148, -53, 158, -50, 155);
    endShape();
    beginShape(); //jetpack corner detail
    vertex(-86, 60);
    bezierVertex(-83, 75, -50, 70, -50, 70);
    endShape();
    rotate(PI / 2);
    rect(93, 78, 25, 18, 15);
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
  if (speed > 0) {
    //legs down (flying)
  }
}
