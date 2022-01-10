//Jihee Kim, Daniel Noh
//15-104 MWF 9:30
//jiheek1@andrew.cmu.edu, dnoh@andrew.cmu.edu
//Final Project
//Section D

var snowmanX = 200;
var easing = 0.1;
var limit; //constrain the snowman and the carrot
var targetX; //target location of snowman and carrot (mouseX)
var dx;
var carrotFrame = 0; //initialize the carrot image
var heartFrame = 0; //initialize the heart image
var carrots = []; //an array of carrot images
var hearts = []; // an array of heart images
var balls = []; //an array of ellipses falling from the top of canvas
var clouds = []; //an array of clouds


var speedCounter = 0;
var carrotCounter = 0;
var scoreCounter = 0;
var carrotStoptime = 0;
var score = 0;

var yVelocity = 1;
var nBalls = 36; //numbrt of snowballs

function preload() {
    //these URLs preload the loading carrot
    var filenamesC = [];
    filenamesC[0] = "https://i.imgur.com/qepItjw.png";
    filenamesC[1] = "https://i.imgur.com/WrRwOgn.png";
    filenamesC[2] = "https://i.imgur.com/IaGv051.png";
    filenamesC[3] = "https://i.imgur.com/788iMwW.png";
    filenamesC[4] = "https://i.imgur.com/L46EZ7S.png";

    //loads the images into the carrots[] array
    for (var i = 0; i < filenamesC.length; i++) {
        carrots[i]= loadImage(filenamesC[i]); //load each frame...
    }

    //loads the images into the hearts[] array
    var filenamesH = [];
    filenamesH[0] = "https://i.imgur.com/awWteaR.png"
    filenamesH[1] = "https://i.imgur.com/vw1d2oU.png"
    filenamesH[2] = "https://i.imgur.com/aBUC5GV.png"
    filenamesH[3] = "https://i.imgur.com/zBHIG8D.png"

    for (var j = 0; j < filenamesH.length; j++) {
        hearts[j]= loadImage(filenamesH[j]); //load each frame...
    }
}

function setup() {
    createCanvas(450,640);
    //create new balls according to locationBalls function
    for (i = 0; i < nBalls; i++) {
        var newBalls = new locationBalls();
        balls.push(newBalls);
    }
}

function draw() {
    //background gradient
    var a = color(160, 232, 229);
    var b = color(238, 252, 251);
    backGradient(0, width, a, b);


    updateCloud();
    removeCloud();
    addCloud();

    updateBalls();
    levelUp();

    //draw carrot nose
    drawCarrot();

    //draw snowman
    drawSnowman();

    //draw score
    drawScore();

    //menu bar on the left side of canvas
    fill(255);
    stroke(130, 232, 229);
    strokeWeight(4);
    rect(20, 75, 70, 350, 35, 35, 35, 35);

    //draw ice
    drawIce();

    //draw carrot icon
    imageMode(CENTER);
    image(carrots[carrotFrame], 55, 350, 80, 80);
    //every fifteen points, a quarter of the carrot icon is filled
    if (score >= 15 && score < 30) {
        carrotFrame = 1;
    }
    if (score >= 30 && score < 45) {
        carrotFrame = 2;
    }
    if (score >= 45 && score < 60) {
        carrotFrame = 3;
    }
    if (score >= 60) {
        carrotFrame = 4;
    }

    //draw heart icons
    image(hearts[heartFrame], 55, 170, 120, 240);

    //draw score
    drawScore();

    //intro popup
    if (speedCounter < 280) {
        fill(255);
        stroke(130, 232, 229);
        strokeWeight(4);
        rect(20, 75, width-40, 350, 35, 35, 35, 35);
        strokeWeight(2);
        fill(130, 232, 229);
        textSize(40);
        text("HOW TO PLAY", width/2, 170);
        noStroke();
        textSize(20);
        text("move the snowman with your mouse", width/2, 250);
        text("and help it dodge the snowballs!", width/2, 280);
        text("you have three lives", width/2, 330);
        text("GOOD LUCK!", width/2, 380);
    }

    //if hit by snowball, lose a heart
    for (i = 0; i < balls.length; i++) {
        if (speedCounter > 300) {
            if ((balls[i].x > (snowmanX - 10)) && (balls[i].x < (snowmanX + 10))
            && (balls[i].y > (height - 150)) && (balls[i].y < (height - 130))) {
                heartFrame += 1;
                balls[i].y = 0;
            }
        }
    }
    //end game
    if (heartFrame >= 3) {
        gameOver();
    }
}

function keyPressed() { //reset game when pressing R
    if (keyCode == 82 && heartFrame == 3) {
        heartFrame = 0;
        carrotFrame = 0;
        snowmanX = 200;
        easing = 0.1;
        speedCounter = 0;
        carrotCounter = 0;
        scoreCounter = 0;
        carrotStoptime = 0;
        score = 0;
        yVelocity = 1;
    }
}

function gameOver() {
    yVelocity = 0;
    snowmanX = width/2;
    easing = 0;
    //game over popup
    fill(255);
    stroke(130, 232, 229);
    strokeWeight(4);
    rect(20, 75, width-40, 350, 35, 35, 35, 35);

    //game over text
    fill(130, 232, 229);
    textSize(50);
    strokeWeight(2);
    text("GAME OVER", width/2, 170);
    textSize(30);
    noStroke();
    strokeWeight(1);
    fill(130, 232, 229);
    text("your score: " + score, width/2, 220);
    textSize(25);
    text("PRESS R TO RESTART", width/2, 350);
    image(carrots[carrotFrame], width/2, 270, 80, 80);
    noLoop;
}

function levelUp() {
    speedCounter += 1;
    if (speedCounter > 600) {
        yVelocity = 2;
    }
    //level 1 speed
    if (speedCounter > 1200) {
        yVelocity = 4;
    }
    //level 2 speed
    if (speedCounter > 1800) {
        yVelocity = 6;
    }
    //level 3 speed
    if (speedCounter > 2400) {
        yVelocity = 8;
    }
    //level 4 speed
    if (speedCounter > 3000) {
        yVelocity = 10;
    }
    //god level speed -- impossible mode.
    if (speedCounter > 3600) {
        yVelocity = 12;
    }
}

function backGradient(y, x, a, b) { //background gradient color
    for (var i = y; i <= height; i++) {
          var mid = map(i, y, y+x, 0, 1);
          var c = lerpColor(a, b, mid);
          stroke(c);
          strokeWeight(2);
          line(y, i, y+x, i);
	}
}

function drawScore() {
    //score keeping system
    scoreCounter += 1;
    if (scoreCounter % 120 == 0 && heartFrame != 3 && speedCounter > 300) {
        score += 1
    }
    fill(130, 232, 229);
    noStroke();
    textAlign(CENTER);
    textSize(25);
    text(score, 55, 290);
}

function drawSnowman() {
    limit = constrain(mouseX, 125, 450); //limits within the canvas
    targetX = limit; //easing the snowman to mouse
    dx = targetX - snowmanX;
    snowmanX += dx * easing;

    fill(255);
    strokeWeight(3);
    stroke(230);
    //body
    ellipse(snowmanX, height-80, 40, 40);
    //head
    ellipse(snowmanX, height-110, 30, 30);
}

function drawCarrot() {
    //limits within the canvas
    limit = constrain(mouseX, 125, 450);
    //easing the carrot to mouse
    targetX = limit;
    dx = targetX - snowmanX;
    snowmanX += dx * easing;

    fill(255, 181, 51);
    strokeWeight(2);
    stroke(255, 110, 51);
    triangle(snowmanX-5, height-125, snowmanX+5, height-125,
             snowmanX, height-145);
}

function drawIce() {
    fill(215, 255, 255);
    strokeWeight(5);
    stroke(175, 250, 250);
    rect(-5, height-55, width+10, 60);
    //the lines on the ice
    for(var i = 0; i < 16; i++) {
        strokeWeight(4);
        line(0 + (i*30), height-55, 20 + (i*30), height-45);
        line(15 + (i*30), height-55, 50 + (i*30), height-35);
    }
}

//updates the clouds so they move and show
function updateCloud() {
    for (var i = 0; i < clouds.length; i++){
        clouds[i].move();
        clouds[i].display();
    }
}

//gets rid of clouds that pass the screen
function removeCloud() {
    var cloudsKeep = [];
    for (var i = 0; i < clouds.length; i++){
        if (clouds[i].x + clouds[i].breadth > 0){
            cloudsKeep.push(clouds[i]);
        }
    }
    clouds = cloudsKeep;
}

//adds clouds at a random interval, replacing the ones that are removed
function addCloud() {
    var newCloudPercent = 0.1;
    if (random(0,1) < newCloudPercent){
        var cloudX = width;
        var cloudY = random(height/1.2);
        clouds.push(makeClouds(width));
    }
}

//adds velocity to the clouds, making them move
function cloudMove() {
    this.x += this.speed;
}

//this is the things that make the cloud
function displayCloud() {
    var cloudHeight = 5;
    var cHeight = this.nCloud*cloudHeight;

    noStroke();
    fill(255, this.opaque);
    push();
    translate(this.x, height/1.15);
    ellipse(0, -cHeight, this.breadth, cHeight/1.5);
    pop();
    push();
    translate(this.x, height/1.15+40);
    ellipse(30, -cHeight, this.breadth, cHeight);
    pop();
}

//these are the parameters for the clouds
function makeClouds(cloudX, cloudY) {
    var cloud = {x: cloudX,
				y: cloudY,
				breadth: random(50, 100),
				speed: -random(1, 3),
				nCloud: round(random(10,23)),
				opaque: random(80, 90),
				move: cloudMove,
				display: displayCloud}
    return cloud;
}

//updates the balls so they move and show
function updateBalls() {
    for (var i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].move();
    }
}

//sets up the movement and display of balls
function locationBalls() {
    this.x = random(125, width);
    this.y = random(0, height);

    this.draw = function() {
        fill(0);
        if (this.y < height + 5) {
            stroke(222, 236, 249);
            strokeWeight(2);
            fill(255);
            ellipse(this.x, this.y, 20, 20);
        } else {
            this.x = random(125, width);
            this.y = -5;
        }
    }

    this.move = function() {
        this.y += yVelocity;
    }
}
