class Particle {
  constructor(x, y, c){
    this.x = x;
    this.y = y;
    this.c = c;
    this.vx = random(-1,1);
    this.vy = random(-1,1);
    if(alpha(this.c) != 0){
      this.alpha = 255;
    }
    else{
      this.alpha = 0;
    }
  }
  
  update(){
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 20;
  }
  
  show(){
    noStroke();
    this.c.setAlpha(this.alpha);
    fill(this.c);
    ellipse(this.x,this.y, 4, 4);
  }
  
  finished() {
    return this.alpha < 0;
  }
}

let c;
let po;
let particles = [];
let imags = [];
let cy = 0;

function preload(){
  //po = loadImage("portrait.png");
  imags[0] = loadImage("portrait.png");
  imags[1] = loadImage("rabbit.png");
  imags[2] = loadImage("flower.png");
}

function setup() {
  createCanvas(imags[cy].width, imags[cy].height);
  noStroke();
  imags[cy].loadPixels();
  for(let x = 0; x<width; x +=4){
    for(let y = 0; y<height; y +=4){
        //ellipse(x, y, 10, 10);
        //fill(color(po.get(x, y)));
        p = new Particle(x,y,color(imags[cy].get(x, y)));
        particles.push(p);
     }
  }
  if(cy == 2){
    cy = 0;
  }
  else{
    cy++;
  }
}

function draw() {
  for(let i = 0; i < particles.length; i++){
    particles[i].show();
  }
}

function mouseDragged(){
  for(let i = 0; i < particles.length; i++){
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) {
      // remove this particle
      particles.splice(i, 1);
    }
    if(particles.length == 0){
      setup();
    }
  }
  clear();
}