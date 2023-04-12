var rainFall = []

function setup() {
  createCanvas(windowWidth, windowHeight);
  for(var i = 0; i < 100; i++) {
    rainFall[i] = new Drop();
  }
}

function draw() {
  background(255,255,255,255);
  for(var i = 0; i < 100; i++) {
    rainFall[i].create();
    rainFall[i].rain();
  } 
}

function Drop() {
  this.x = random(0, width);
  this.y = random(0, -height);
  
  this.create = function() {
    noStroke();
    fill(color(0, 0, 255, 120));
    ellipse(this.x, this.y, random(4, 6), random(3, 5)); 
    ellipse(this.x, this.y-1, random(2, 4), 6, 150);
    ellipse(this.x, this.y-random(2,4), random(2, 2), random(6, 12), 70);
  }
  this.rain = function() {
    this.speed = random(1, 5);
    this.gravity = 1.2;
    this.y = this.y + this.speed*this.gravity;  
    
    if (this.y > height) {
      this.y = random(0, -height);
      this.gravity = 0;
    }
  }
}