createCanvas(360, 202);
translate(180, 15);
fill(100, 100, 100);
ellipse(0, 0, 45);
var speed = 3;
var translateX = 0;
var translateY = 0;
function draw() {
  clear();
  fill(150, 200, 100);
  rect(0, 0, width, height);
  translate(translateX, translateY);
  fill(100, 100, 100);
  rect(0, 0, 50, 150);
  if (keyIsPressed) {
    if (keyCode === 83) {
      translateY = translateY + speed;
    }
    if (keyCode === 87) {
      translateY = translateY - speed;
    }
  }
}
