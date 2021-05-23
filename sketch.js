var dog,sadDog,happyDog;
var feedB, addB;
var database;
var foodStock=0;
var gameState = 1;
var hour;
var bg1, bg2, bg3;
var gameState;
var currentTime;
var lastFed;


function preload(){
  sadDog=loadImage("dogImg.png");
  happyDog=loadImage("dogImg1.png");
  empty = loadImage("Milk.png");
  bg1 = loadImage("Bed Room.png");
  bg2 = loadImage("Garden.png");
  bg3 = loadImage("Wash Room.png");

  getTime();
}

function setup() {
  createCanvas(1000,400);
 
  database = firebase.database();
  
  food=new Food();
  food.getFoodStock();
  food.updateFoodStock(foodStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feedB = createButton('Feed Dog');
  feedB.position(900,95);
  feedB.mousePressed(feedDog);

  addB = createButton('Add food');
  addB.position(970,95);
  addB.mousePressed(addFood);

}

function draw() {
  background(46,139,87);
  fill("red");
  textSize(15);
  food.getFoodStock();
  food.display();
  if(gameState===0){
    feedB.hide();
    addB.hide();
    dog.remove();
  }else if(gameState===1){
    feedB.show();
    addB.show();
    dog.addImage(sadDog);
  }
  if(hour>=12){
    text("Last Fed: "+ hour%12 + " PM",350,50);
  }
  else if (hour===0){
    text("Last Fed: 12 AM",350,50);
  }
  else if(hour<=12){
    text("Last Fed: "+ hour + "AM",350,50);
  }
  currentTime = hour;
  if(currentTime < lastFed + 1){
    gameState =2;
    food.garden();
  }else if(currentTime > lastFed + 1 && currentTime < lastFed + 2){
    gameState = 3;
    food.bedroom();
  }else if(currentTime > lastFed + 2 && currentTime < lastFed + 4){
    gameState = 4;
    food.washroom();
  }else{
    gameState = 1;
    food.display();
  }
  food.getLastFed(lastFed);
  readState();
  updateGameState(gameState);
  drawSprites();
}

function feedDog(){
  if(foodStock>0){
    dog.addImage(happyDog);
    foodStock -= 1
    food.updateFoodStock(foodStock);
    gameState = 0
    food.updateLastFed(hour);
  }
}
function addFood(){
  foodStock = foodStock + 1;
  food.updateFoodStock(foodStock);
  dog.addImage(sadDog);
  //console.log("hello");
}

async function getTime(){
  var response = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata"); 
  var responseJSON = await response.json();
  console.log(responseJSON);

  var dayTime = responseJSON.datetime;
  hour = dayTime.slice(11,13);
  console.log(hour);
}

function readState(){
  var gameStateRef = database.ref('gameState');
  gameStateRef.on("value", (data)=>{
  gameState = data.val();
})
}
function updateGameState(x){
  database.ref('/').update({
      'gameState' : x
  })
}