var i = 0;
let x;
let x2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  x = random(65, 80);
  x2 = random(20, 60);
  fill(255, 180, 82);
}

function draw() {
  background(255,255,255,255);
  
  if(i%100 == 0){
    x = random(65, 80);
    x2 = random(20, 60);
  }
  
  if(i%20){
    fill(255, random(120, 180), 82);
  }
  
  push();
  translate(windowWidth/2, windowHeight/2);
  rotate(radians(frameCount / 10));
  stroke(color(255, 180, 82));
  ellipse(0, 0, 80, 80);
  line(0, -x, 0, -x2);
  line(0, x2, 0, x);
  line(-x, 0, -x2, 0);
  line(x2, 0, x, 0);
  
  line(-x, 0, -40, 0);
  line(40, 0, x, 0);
  line(-45, 45, -30, 30);
  line(45, 45, 30, 30);
  line(-45, -45, -30, -30);
  line(45, -45, 30, -30);
  pop();
  noFill();
  i++
}