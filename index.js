// undirbúum canvasinn fyrir teiknifallið okkar
const c = document.getElementById("snake");
const ctx = c.getContext("2d");

// gerum jörðina/borðið
const ground = new Image();
ground.src = "img/ground.png";

// gerum matinn/eplið
const food = new Image();
food.src = "img/food.png";

// gerum hljóðin tilbúin
const left = new Audio();
const right = new Audio();
const up = new Audio();
const down = new Audio();
const eat = new Audio();
const dead = new Audio();
left.src = "audio/left.mp3";
right.src = "audio/right.mp3";
up.src = "audio/up.mp3";
down.src = "audio/down.mp3";
eat.src = "audio/eat.mp3";
dead.src = "audio/dead.mp3";

// gerum einingu
var box = 32;
// gerum breytu fyrir stigaskor
var score = 0;
// gerum fylki til að geyma snákinn okkar
var snake = [];
// gerum breytu til að geyma stefnu snáksins
var d = "";

snake[0] = {
	x: 9*box,
	y: 10*box
};

var apple = {
	x: Math.floor(Math.random()*17+1)*box,
	y: Math.floor(Math.random()*15+3)*box,
};

// fall sem leyfir okkur að breyta um átt
function changeDirection(event){
	if (event.keyCode == 37 && d != "RIGHT") {
		d = "LEFT";
		left.play();
	} else if (event.keyCode == 38 && d != "DOWN") {
		d = "UP";
		up.play();
	} else if (event.keyCode == 39 && d != "LEFT") {
		d = "RIGHT";
		right.play();
	} else if (event.keyCode == 40 && d != "UP") {
		d = "DOWN";
		down.play();
	}
}

// fall til að byrja leik aftur
function restart(event){
	if (event.keyCode == 32){
		clearInterval(game);
		game = setInterval(draw, 150);
		d = "";
		score = 0;
		snake = [];
		snake[0] = {
			x: 9*box,
			y: 10*box
		};
		apple = {
			x: Math.floor(Math.random()*17+1)*box,
			y: Math.floor(Math.random()*15+3)*box,
		};
	}
}

// árekstrarathugunarfall
function collision(head, array){
	if (head.x < box || head.x > 17*box || head.y < 3*box || head.y > 17*box){
		return true;
	} 
	for (var i=1; i<array.length; i++){
		if (head.x == array[i].x && head.y == array[i].y){
			return true;
		}
	}
	return false;
}

// teiknifall
function draw(){
	ctx.drawImage(ground,0,0);
	ctx.drawImage(food, apple.x, apple.y);
	for (var i=0; i<snake.length; i++) {
		if (i == 0) {
			ctx.fillStyle = "green";
		} else {
			ctx.fillStyle = "white";
		}
		ctx.fillRect(snake[i].x, snake[i].y, box, box);
		ctx.strokeStyle = "red";
		ctx.strokeRect(snake[i].x, snake[i].y, box, box);
	}

	// finnum stöðu höfuðs snáksins
	snakeX = snake[0].x;
	snakeY = snake[0].y;

	if (d == "LEFT") snakeX -= box;
	if (d == "RIGHT") snakeX += box;
	if (d == "UP") snakeY -= box;
	if (d == "DOWN") snakeY += box;

	// gerum nýjan haus á snák
	var newHead = {
		x: snakeX,
		y: snakeY
	};

	// köllum á collision og réttum því nýja hausinn, ef það finnur út að við höfum
	// rekist á vegg eða okkur sjálf þá erum við dauð og leikurinn stoppar
	if (collision(newHead, snake)) {
		clearInterval(game);
		dead.play();
		ctx.fillStyle = "white";
		ctx.font = "32px Arial";
		ctx.fillText("Game over! Press spacebar to restart", 1*box,5*box);
	}

	// bætum hausnum við snákinn
	snake.unshift(newHead);	

	// ef nýja höfuðið er þar sem eplið er þá étur snákurinn okkar eplið og
	// stigaskorið hækkar, við þurfum líka að láta nýtt epli birtast, við tökum
	// heldur ekki burt skottið því snákurinn stækkar þegar hann borðar eplið
	if (newHead.x == apple.x && newHead.y == apple.y) {
		score++;
		eat.play();
		apple = {
			x: Math.floor(Math.random()*17+1)*box,
			y: Math.floor(Math.random()*15+3)*box,
		}	
	} else {
		// annars, þá gerist ekkert nema við tökum burt skottið
		snake.pop();
	}

	ctx.fillStyle = "white";
	ctx.font = "32px Arial";
	ctx.fillText(score, 2*box,1.6*box);

}

document.addEventListener("keypress", restart);
document.addEventListener("keydown", changeDirection);

// setjum af stað lykkju þar sem kallað verður á teiknifallið á 150 millisekúndna fresti
var game = setInterval(draw, 150);

