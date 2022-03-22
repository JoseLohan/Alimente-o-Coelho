const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var canw;
var canh;
var ground;
var rope, rope2, rope3;
var fruit;
var link1, link2, link3;
var fruit_Img;
var bunny, bunny_Img;
var background_Img;
var button1, button2, button3;
var blink;
var eat;
var sad;
var rope_sound, balloon_sound, sad_sound, background_sound, eat_sound
var btnMute;
var bntBalloon;
var isCrying = false;

function preload() {
  fruit_Img = loadImage("./images/melon.png");
  bunny_Img = loadAnimation ("./images/Rabbit-01.png");
  background_Img = loadImage ("./images/background.png");
  blink = loadAnimation ("./images/blink_1.png","./images/blink_2.png","./images/blink_3.png");
  eat = loadAnimation ("./images/eat_0.png","./images/eat_1.png","./images/eat_2.png","./images/eat_3.png","./images/eat_4.png");
  sad = loadAnimation ("./images/sad_1.png","./images/sad_2.png","./images/sad_3.png");
  rope_sound = loadSound ("./sounds/rope_cut.mp3");
  balloon_sound = loadSound ("./sounds/air.wav");
  sad_sound = loadSound ("./sounds/sad.wav");
  background_sound = loadSound ("./sounds/sound1.mp3");
  eat_sound = loadSound ("./sounds/eating_sound.mp3");
  blink.playing = true
  eat.playing = true
  sad.playing = true
  eat.looping = false
  sad.looping = false
  sad_sound.looping = false

}
function setup(){
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    canw = displayWidth;
    canh = displayHeight;
    createCanvas (displayWidth,displayHeight);
  }
  else{
    canw = windowWidth;
    canh = windowHeight;
    createCanvas (windowWidth,windowHeight);
  }
  engine = Engine.create();
  world = engine.world;

  background_sound.setVolume(0.2);
  background_sound.play();

  button1 = createImg("./images/cut_btn.png");
  button1.size(50,50);
  button1.position(20,30);
  button1.mouseClicked(drop);

  button2 = createImg("./images/cut_btn.png");
  button2.size(50,50);
  button2.position(280,35);
  button2.mouseClicked(drop2);

  button3 = createImg("./images/cut_btn.png");
  button3.size(50,50);
  button3.position(300,200);
  button3.mouseClicked(drop3);

  btnMute = createImg("./images/mute.png");
  btnMute.size(50,50);
  btnMute.position(450,20);
  btnMute.mouseClicked(mute);

  bntBalloon = createImg("./images/balloon.png");
  bntBalloon.size(150,100);
  bntBalloon.position(10,250);
  bntBalloon.mouseClicked(airBlow);

  ground = new Ground(200,canh,600,20);
  rope = new Rope(6,{x:40,y:30});
  rope2 = new Rope(7,{x:canw-20,y:40});
  rope3 = new Rope(6,{x:canw-10,y:225});
  fruit = Bodies.circle(300,300,15);
  bunny = createSprite(250,canh-80,100,100)

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bunny.addAnimation("blink",blink);
  bunny.addAnimation("eat",eat);
  bunny.addAnimation("sad",sad);
  bunny.changeAnimation ("blink");
  bunny.scale = 0.2

  Matter.Composite.add(rope.body,fruit);

  link1 = new Link(rope,fruit);
  link2 = new Link(rope2,fruit);
  link3 = new Link(rope3,fruit);

 
  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  textSize(50)
}

function draw() 
{
  background(51);
  image(background_Img,width/2,height/2,width,height);
  Engine.update(engine);

  if (fruit != null) {
    image(fruit_Img,fruit.position.x,fruit.position.y,60,60);
  }

  if (collide(fruit, bunny)) {
    bunny.changeAnimation("eat")
    eat_sound.play();
    background_sound.stop();
  }

  if(fruit != null && fruit.position.y > 650){
    bunny.changeAnimation("sad")
    if(!isCrying){
      sad_sound.play();
      background_sound.stop();
      isCrying = true
    }
  }


  ground.display();
  rope.show();
  rope2.show();
  rope3.show();
  drawSprites()
}

function drop() {
  rope.break();
  link1.detach();
  link1 = null;
  rope_sound.play();
}

function drop2() {
  rope2.break();
  link2.detach();
  link2 = null;
  rope_sound.play();
}

function drop3() {
  rope3.break();
  link3.detach();
  link3 = null;
  rope_sound.play();
}

function collide(body, sprite){
  if(body != null){
    var D = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
    if (D <= 80) {
      World.remove(world, fruit);
      fruit = null
      return true
    } else {
      return false
    }
  }
}

function mute() {
  if (background_sound.isPlaying()) {
    background_sound.stop();
  }
  else{
    background_sound.play();
  }
}
function airBlow() {
  Matter.Body.applyForce(fruit, {x:0, y:0},{x:0.01, y:0});
  balloon_sound.play();
}
