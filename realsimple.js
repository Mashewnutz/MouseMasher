
window.onload = init;

var speed = 0.1;
var ctx;
var prevTime;
var currTime;
var deltaTime;

var ratWidth = 50;
var ratHeight = 50;
var cheese;
var floor;
var mouse;
var washingMachine;
var spatula;
var spatulaDown;
var blood;
var mouseTrap;
var name = "";
var attempts = 0;
var mouseX = 0;
var mouseY = 0;
var music;
var bloodX = -100;
var bloodY = -100;
var spatulaX = 0;
var spatulaY = 0;
var spatulaWidth = 50;
var spatulaHeight = 50;
var deaths = 0;
var rotate = 0.0;
var mode = -1;
var mouseDown = false;
var INITIAL_RAT_Y = 220;
var END_RAT_Y = 650;
var bloodBath = [];
var mouseTraps = [];
var canvas;
var numImages = 0;
var gameOverTime = 0;
var volume = 0.2;
var mouseObj;
var reloadTime = 0.0;

var elephant;
var slap;
var crack;
var squash1;
var squash2;

function getMousePos(c, evt) {
    var rect = c.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

function get(id)
{
    return document.getElementById(id);
}

function onMouseMove(ev)
{
    mouseX = getMousePos(canvas, ev).x;
    mouseY = getMousePos(canvas, ev).y;


    spatulaX = mouseX + 110;
    spatulaY = mouseY - 30;
}



function onMouseDown(ev)
{
    mouseX = getMousePos(canvas, ev).x;
    mouseY = getMousePos(canvas, ev).y;

    var w = spatulaWidth;
    var h = spatulaHeight;

    if(mode == 0)
    {
        mode = 1;
    }
    else if( (mode == 1) )
    {
        spatulaX = mouseX + 110;
        spatulaY = mouseY - 50;

        var ratCenterX = mouseObj.x + ratWidth*0.5;
        var ratCenterY = mouseObj.y + ratHeight*0.5;

        var horizontal = Math.abs(ratCenterX-spatulaX) < spatulaWidth;
        var vertical = Math.abs(ratCenterY-spatulaY) < spatulaHeight;

        mouseDown = true;
        reloadTime = 150;

        if( horizontal && vertical)
        {               
            hitMouse(false);     
        }
        else
        {
            slap.currentTime = 0;
            slap.volume = volume;
            slap.play();
        }


    }
    else if(mode == 2 )
    {        
        $.get("scores.php?name="+name + "&score=" + deaths,function(data,status){
            
            get("highscores").innerHTML = data;
        });

        resetMouse();
        deaths = 0;
        bloodBath = [];
        mouseTraps = [];
        mode = 0;
        speed = 0.1;
        gameOverTime = 0.0;
    }    
}

function onMouseUp()
{
    mouseDown = false;
}

function hitMouse(trap)
{
    bloodX = mouseObj.x;
    bloodY = mouseObj.y;

    var splat = new Object();
    splat.x = bloodX;
    splat.y = bloodY;
    
    mouseObj.hits--;

    if(trap)
    {
        crack.currentTime = 0;
        crack.volume = volume;
        crack.play();
    }
    else
    {
        slap.currentTime = 0;
        slap.volume = volume;
        slap.play();

        if((mouseObj.img == rat) && (mouseTraps.length < 2) && mouseObj.hits <= 0)
        {
            var mouseTrap = new Object();
            mouseTrap.x = mouseObj.x;
            mouseTrap.y = mouseObj.y;
            mouseTraps.push(mouseTrap);
        }
    }

    if(Math.random() < 0.5)
    {
        squash1.currentTime = 0;
        squash1.volume = volume;
        squash1.play();
    }
    else
    {
        squash2.currentTime = 0;
        squash2.volume = volume;
        squash2.play();   
    }

    
    bloodBath.push(splat);
    if(mouseObj.hits <= 0)
    {            
        resetMouse();
    }
    else
    {
        mouseObj.speed *= 0.5;
    }
}

function init()
{

    canvas = get('c');

    ctx = c.getContext( '2d' );
    c.addEventListener('mousedown', onMouseDown, false);
    c.addEventListener('mousemove', onMouseMove, false);
    c.addEventListener('mouseup', onMouseUp, false);    

    setInterval( loop, 1 );

    prevTime = new Date().getTime();
    currTime = new Date().getTime();

    cheese = new Image();
    cheese.onload = loaded;    
    cheese.src = "cheese1.png"

    floor = new Image();
    floor.onload = loaded;
    floor.src = "floor1.jpg"

    mouse = new Image();
    mouse.onload = loaded;    
    mouse.src = "mouse1.png"

    rat = new Image();
    rat.onload = loaded;    
    rat.src = "rat.png"

    washingMachine = new Image();
    washingMachine.onload = loaded;    
    washingMachine.src = "washing_machine.png"

    spatula = new Image();
    spatula.onload = loaded;    
    spatula.src = "spatula.gif"

    spatulaDown = new Image();
    spatulaDown.onload = loaded;    
    spatulaDown.src = "spatula_down.png"

    blood = new Image();
    blood.onload = loaded;    
    blood.src = "blood1.png"

    mouseTrap = new Image();
    mouseTrap.onload = loaded;    
    mouseTrap.src = "mouse-trap.png"

    elephant = new Audio("elephant.wav");
    slap = new Audio("slap.ogg");
    crack = new Audio("crack.wav"); 
    squash1 = new Audio("rat_die.ogg");
    squash2 = new Audio("rat_upset.ogg");
    



    $.get("scores.php",function(data,status){
        get("highscores").innerHTML = data;
    });

    mouseObj = new Object();
    mouseObj.img = mouse;
    mouseObj.x = 300;
    mouseObj.y = INITIAL_RAT_Y;
    mouseObj.hits = 1;
    mouseObj.speed = speed;
}

function loaded()
{
    numImages++;

    if(numImages == 9)
        mode = 0;
}


function title()
{
    ctx.drawImage(floor, 0,0);
    ctx.drawImage(washingMachine, 199, 29);
    ctx.fillText('Save the cheese!', 150, 390); 
    ctx.fillText('click to begin', 180, 500);
    ctx.drawImage(cheese, 180,660, 200, 150); 

    if(name == "")
    {
        
        var enteredName = prompt("Whats your name?","Tom");
        
        if(enteredName == null || enteredName == "null")
            enteredName = prompt("Please enter your name.","Tom");

        if(enteredName == "Tom")
            enteredName = prompt("LIES! Whats YOUR name???","Tom");
        
        if(enteredName == "Tom")
            alert("Fine.");

        if(enteredName != null && enteredName != "null")
            name = enteredName;
    }
}

function checkTraps()
{
    for(i = 0; i < mouseTraps.length; ++i)
    {

        var horizontal = Math.abs(mouseTraps[i].x - mouseObj.x) < spatulaWidth;
        var vertical = Math.abs(mouseTraps[i].y - mouseObj.y) < spatulaHeight;
        if(horizontal && vertical)
        {
            hitMouse(true);
            mouseTraps.splice(i,1);
        }
    }
}

function drawTraps()
{
    for(i = 0; i < mouseTraps.length; ++i)
    {
        ctx.drawImage(mouseTrap, mouseTraps[i].x, mouseTraps[i].y, 50, 50);
    }
}

function game()
{
    gameOverTime += deltaTime;

    checkTraps();

    ctx.drawImage(floor, 0,0);

    var lerp = (mouseObj.y - INITIAL_RAT_Y ) / (END_RAT_Y - INITIAL_RAT_Y)
    var finalRotate = -rotate + lerp * rotate*2;
    
    for(i = 0; i < bloodBath.length; ++i)
    {
        ctx.drawImage(blood, bloodBath[i].x, bloodBath[i].y, 50, 50);
    }

    drawTraps();

    ctx.save();    
    ctx.translate(mouseObj.x,mouseObj.y);
    ctx.rotate(finalRotate);     
    ctx.drawImage(mouseObj.img, 0,0, ratWidth, ratHeight);
    ctx.restore();

    ctx.drawImage(washingMachine, 199, 29);

    ctx.fillText(name + ' killed', 0, 100);
    ctx.fillText(deaths + ' mice', 0, 150);

    mouseObj.y += Math.cos(-finalRotate) * mouseObj.speed * deltaTime;
    mouseObj.x += Math.sin(-finalRotate) * mouseObj.speed * deltaTime;
    
    ctx.drawImage(cheese, 180,660, 200, 150);       
    ctx.save();
    if(reloadTime > 0.0 || mouseDown) 
    {
        ctx.drawImage(spatulaDown, mouseX-10,mouseY-80, spatula.width*0.5, spatula.height*0.5);
    }
    else
    {
        ctx.translate(mouseX-60, mouseY-70);        
        ctx.rotate(-0.4);
        ctx.drawImage(spatulaDown, 0, 0,spatula.width*0.5, spatula.height*0.5);
    }
    ctx.restore();
    
    if(mouseObj.y > END_RAT_Y)
    {        
        mode = 2;
        elephant.currentTime = 0;
        elephant.volume = volume;
        elephant.play();
    }

}

function gameOver()
{
    speed = 0.1;

    ctx.drawImage(floor, 0,0);
    ctx.drawImage(washingMachine, 199, 29);

    
    for(i = 0; i < bloodBath.length; ++i)
    {
        ctx.drawImage(blood, bloodBath[i].x, bloodBath[i].y, 50, 50);
    }


    drawTraps();

    ctx.save();    
    ctx.translate(mouseObj.x,mouseObj.y);
    ctx.drawImage(mouseObj.img, 0,0, ratWidth, ratHeight);
    ctx.restore();

    ctx.drawImage(cheese, 180,660, 200, 150); 

    ctx.fillText(name + ' killed', 0, 100);
    ctx.fillText(deaths + ' mice', 0, 150);
    ctx.fillText('Game Over!', 200, 450);
    ctx.fillText('The cheese is gone.', 130, 530);
    ctx.fillText('You killed ' + deaths + ' mice', 160, 630);

    

}

function loop()
{
    currTime = new Date().getTime();
    deltaTime = currTime - prevTime;

    reloadTime -= deltaTime;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle= '#f00';    
    ctx.clearRect(0,0,600,800);
    ctx.font = '40px Calibri';
    ctx.translate(0,-50);
    if(mode == 0)
    {
        title();
    }
    else if(mode == 1)
    {
        game();
    }
    else if(mode == 2)
    {
        gameOver();
    }
    
    prevTime = currTime;
}

function resetMouse()
{    
    var rand = Math.random();

    mouseObj.x = Math.floor(Math.random() * 130) + 210;
    mouseObj.y = INITIAL_RAT_Y;
    if(Math.random() < 0.12)
    {
        mouseObj.img = rat;
        mouseObj.hits = 2;        
    }
    else
    {
        mouseObj.img = mouse;
        mouseObj.hits = 1;
    }
    rotate = rand * 0.8 - 0.4;
    speed += -0.01 + Math.random() * 0.025;
    mouseObj.speed = speed;
    deaths++
}

