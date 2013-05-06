// Utilities
String.prototype.leftpad = function(len, ch) {
	var str = this;
	if (arguments.length == 1) ch = " ";
	while (str.length < len) str = ch + str;
	return str;
}

String.prototype.rightpad = function(len, ch) {
	var str = this;
	if (arguments.length == 1) ch = " ";
	while (str.length < len) str = str + ch;
	return str;
}

// Constants
var GAMEMODE = {
	SPLASH : 0,
	DEMO   : 1,
	GAME   : 2,
};
var GAMEMODE_SPLASH
var KEYCODE_SHIFT = 16;
var KEYCODE_SPACE = 32;
var KEYCODE_CTRL  = 17;
var KEYCODE_UP    = 38;
var KEYCODE_DOWN  = 40;
var KEYCODE_LEFT  = 37;
var KEYCODE_RIGHT = 39;
var KEYCODE_W     = 87;
var KEYCODE_A     = 65;
var KEYCODE_S     = 83;
var KEYCODE_D     = 68;
var KEYCODE_G     = 71;
var KEYCODE_H     = 72;
var KEYCODE_J     = 74;
var KEYCODE_Y     = 89;

var LEFT    = 0x00001;
var UP      = 0x00010;
var RIGHT   = 0x00100;
var DOWN    = 0x01000;
var BUTTONA = 0x10000;
var UPRIGHT = (UP | RIGHT);
var UPLEFT  = (UP | LEFT);
var DOWNRIGHT  = (DOWN  | RIGHT);
var DOWNLEFT   = (DOWN  | LEFT);
var LEFTA      = (LEFT  | BUTTONA);
var RIGHTA     = (RIGHT | BUTTONA);
var UPA        = (UP    | BUTTONA);
var DOWNA      = (DOWN  | BUTTONA);
var UPRIGHTA   = (UP    | RIGHT | BUTTONA);
var UPLEFTA    = (UP    | LEFT  | BUTTONA);
var DOWNRIGHTA = (DOWN  | RIGHT | BUTTONA);
var DOWNLEFTA  = (DOWN  | LEFT  | BUTTONA);

var anim_walk = new animation(1,[35, 36, 37, 38, 39, 40], //ANIMATION FRAMES
			      [0, 0, 0, 0, 0, 0],  // MIN RANGE
			      [0, 0, 0, 0, 0, 0]); // MAX RANGE
var anim_idle = new animation(2,[35],[0],[0]);
var anim_headbutt = new animation(2,[1, 2, 1],[0, 0, 0],[0, 100, 0]);
var anim_kick_high = new animation(3,[4, 5, 6],[0, 0, 0],[0, 0, 100]);
var anim_fall = new animation(4,[7, 8, 9],[0, 0, 0],[0, 0, 0]);
var anim_rise = new animation(5,[10, 11, 12],[0, 0, 0],[0, 0, 0]);
var anim_cartwheel = new animation(6,[21, 22, 23, 24, 25, 26],[0, 0, 0, 0, 0, 0],
				   [0, 0, 0, 0, 0, 0]);
var anim_jump = new animation(7,[13, 14, 14, 14, 13],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0]);
var anim_jumpkick = new animation(8,[13, 14, 15, 15, 13],[0, 0, 0, 0, 0],[0, 0, 100, 100, 0]);
var anim_punch = new animation(9,[19, 20],[0, 0],[0, 100]);
var anim_kick = new animation(10,[28, 29, 30, 31],[0, 0, 0, 0],[0, 0, 0, 0]);
var anim_low_kick = new animation(11,[0],[0],[0]);
var anim_sweep = new animation(12,[16, 17, 18],[0, 0, 0],[0, 0, 0]);
var anim_block = new animation(13,[0],[0],[0]);
var anim_splitkick = new animation(14,[32, 33, 34, 33, 32],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0]);
var anim_sit_punch = new animation(15,[0],[0],[0]);
var anim_demo = new animation(16,
		[0, 0, 0, 0, 21, 22, 23, 24, 25, 26, 35, 35, 1, 2, 1, 35, 4, 5, 6, 35, 35, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
var anim_sweep_back = anim_sweep;
var anim_punch_back = anim_punch;
var anim_kick_high_back = anim_kick_high;
var anim_knocked_out = new animation(17,[9],[0],[0]);
var anim_startidle = new animation(18,[0],[0],[0]);

function animation(mid, frameData, minData, maxData)
{
	this.frames = frameData;
	this.min_ranges = minData;
	this.max_ranges = maxData;
	this.id = mid;
}

function player(id, xpos, img)	// img , xpos, playerkeys 
{
	this.x = xpos;
	this.y = 100;
	this.id = id;
	this.currentframe = 0;
	this.counter = 0;
	this.anim = anim_demo;
	this.health = 6;
	this.spriteSheet = img;
	this.direction = 1;
	this.score = 0;
	this.speed = 1;
	this.frameX = 0;
	this.frameY = 0;
	this.spriteWidth = 0;
	this.spriteHeight = 0;
	this.nextAnim = anim_demo;
	this.step = function() {
		this.counter++;
		if (this.anim == anim_walk) {
			this.x += this.speed * this.direction;
		}

		if (this.counter >= (this.anim.frames.length)) {
			this.setAnim(this.nextAnim);
		}
		this.frameX = this.spriteWidth * parseInt(this.anim.frames[this.counter] % 7);
		this.frameY = this.spriteHeight * parseInt(this.anim.frames[this.counter] / 7);
		this.currentframe = this.counter;
	}
	this.setAnim = function(nanim) {
		this.counter = 0;
		if (this.health == 0) {
			this.anim = anim_knocked_out;
			this.nextAnim = anim_knocked_out;
		} else if (this.anim == anim_startidle && nanim == anim_idle) {
			this.anim = anim_startidle;
		} else {
			this.anim = nanim;
			this.nextAnim = anim_idle;
		}
	}
	this.initPlayer = function() {
		this.spriteWidth = parseInt(images[this.spriteSheet].width / 7);
		this.spriteHeight = parseInt(images[this.spriteSheet].height / 6);
	}
	this.updatePlayer = function() {
		this.x = xpos;
		this.y = 100;
	}
}

// Drawing stuff
var canvas = document.createElement('canvas');
var c = canvas.getContext('2d');
var images = { };

images[0] = new Image();
images[0].src = "gfx/ikplayer_blue.png";
images[1] = new Image();
images[1].src = "gfx/ikplayer_red.png";
images[2] = new Image();
images[2].src = "gfx/ikplayer_white.png";

iBack = new Image();
iBack.src = "gfx/ikback.png";
iSplash = new Image();
iSplash.src = "gfx/iksplash.png";

// Global stuff (should go in a gamestate class)
var joystick = [0, 0, 0, 0, 0, 0];
var index = 0,
	numFrames = 30,
	gameState = GAMEMODE.SPLASH,
	spriteFrame = 0,
	frameCounter = 0,
	frameTime = 0,
	splashDelay = 5;
var players = [ // id, x pos, imageref
	new player(0, 0, 0),
	new player(1, 60, 1),
	new player(2, 120, 2),
	new player(3, 180, 1),
	new player(4, 240, 0)
];

function reconfigure()
{
	var scale = 1;

	if (window.innerWidth / 320 < window.innerHeight / 200) {
		scale = window.innerWidth / 320;
	} else {
		scale = window.innerHeight / 200;
	}

	canvas.width = 320 * scale;
	canvas.height = 200 * scale;
	canvas.style.position = "fixed";
	canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
	canvas.style.top = (window.innerHeight - canvas.height) / 2 + "px";

	for (i = 0; i < players.length; i++) {
		players[i].updatePlayer();
	}
	c = canvas.getContext('2d');

	if (typeof c.imageSmoothingEnabled !== 'undefined')
		c.imageSmoothingEnabled = false;
	else if (typeof c.webkitImageSmoothingEnabled !== 'undefined')
		c.webkitImageSmoothingEnabled = false;
	c.scale(scale, scale);
}

window.onresize = reconfigure;
window.onload = function() {
	document.body.appendChild(canvas);
	reconfigure();

	//we're ready for the loop
	for (i = 0; i < players.length; i++) {
		players[i].initPlayer();
	}

	//add touch listener
	var touchable = 'createTouch' in document;
	if (touchable) {
		canvas.addEventListener('touchstart', onTouchStart, false);
		canvas.addEventListener('touchmove', onTouchMove, false);
		canvas.addEventListener('touchend', onTouchEnd, false);
	}

	//add keyboard listener
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keypress', onKeyPress, false);
	document.addEventListener('keyup', onKeyUp, false);

	setInterval(loop, 1000 / 10);
}

function onKeyDown(event)
{
	//do stuff
	event.preventDefault();
	switch (event.keyCode) {
	case KEYCODE_LEFT:
		joystick[0] |= LEFT;
		break;
	case KEYCODE_UP:
		joystick[0] |= UP;
		break;
	case KEYCODE_RIGHT:
		joystick[0] |= RIGHT;
		break;
	case KEYCODE_DOWN:
		joystick[0] |= DOWN;
		break;
	case KEYCODE_SHIFT:
		joystick[0] |= BUTTONA;
		break;
	case KEYCODE_A:
		joystick[1] |= LEFT;
		break;
	case KEYCODE_W:
		joystick[1] |= UP;
		break;
	case KEYCODE_D:
		joystick[1] |= RIGHT;
		break;
	case KEYCODE_S:
		joystick[1] |= DOWN;
		break;
	case KEYCODE_CTRL:
		joystick[1] |= BUTTONA;
		break;
	case KEYCODE_G:
		joystick[2] |= LEFT;
		break;
	case KEYCODE_Y:
		joystick[2] |= UP;
		break;
	case KEYCODE_J:
		joystick[2] |= RIGHT;
		break;
	case KEYCODE_H:
		joystick[2] |= DOWN;
		break;
	case KEYCODE_SPACE:
		joystick[2] |= BUTTONA;
		break;
	}
}

function onKeyPress(event)
{
	// Prevent the browser from doing its default thing (scroll, zoom)
	event.preventDefault();
}

function onKeyUp(event)
{
	event.preventDefault();
	switch (event.keyCode) {
	case KEYCODE_LEFT:
		joystick[0] &= ~LEFT;
		break;
	case KEYCODE_UP:
		joystick[0] &= ~UP;
		break;
	case KEYCODE_RIGHT:
		joystick[0] &= ~RIGHT;
		break;
	case KEYCODE_DOWN:
		joystick[0] &= ~DOWN;
		break;
	case KEYCODE_SHIFT:
		joystick[0] &= ~BUTTONA;
		break;
	case KEYCODE_A:
		joystick[1] &= ~LEFT;
		break;
	case KEYCODE_W:
		joystick[1] &= ~UP;
		break;
	case KEYCODE_D:
		joystick[1] &= ~RIGHT;
		break;
	case KEYCODE_S:
		joystick[1] &= ~DOWN;
		break;
	case KEYCODE_CTRL:
		joystick[1] &= ~BUTTONA;
		break;
	case KEYCODE_G:
		joystick[2] &= ~LEFT;
		break;
	case KEYCODE_Y:
		joystick[2] &= ~UP;
		break;
	case KEYCODE_J:
		joystick[2] &= ~RIGHT;
		break;
	case KEYCODE_H:
		joystick[2] &= ~DOWN;
		break;
	case KEYCODE_SPACE:
		joystick[2] &= ~BUTTONA;
		break;
	}
	//do stuff

}

function onTouchStart(event)
{
	//do stuff
}

function onTouchMove(event)
{
	// Prevent the browser from doing its default thing (scroll, zoom)
	event.preventDefault();
}

function onTouchEnd(event)
{
	//do stuff
}

function input(iplayer)
{
	switch (joystick[iplayer]) {
	case 0:
		return anim_idle;
	case LEFT:
		players[iplayer].direction = -1;
		return anim_walk;
	case RIGHT:
		players[iplayer].direction = 1;
		return anim_walk;
	case UP:
		return anim_jump;
	case DOWN:
		return anim_sweep;
	case UPRIGHT:
		return anim_punch;
	case UPLEFT:
		return anim_punch_back;	//backward
	case DOWNRIGHT:
		return anim_low_kick;
	case DOWNLEFT:
		return anim_sit_punch;
	case BUTTONA:
		return anim_idle;
	case LEFTA:
		return anim_cartwheel;
	case RIGHTA:
		return anim_kick;
	case UPA:
		return anim_jumpkick;
	case DOWNA:
		return anim_sweep_back;	//backward
	case UPRIGHTA:
		return anim_headbutt;
	case UPLEFTA:
		return anim_splitkick;
	case DOWNRIGHTA:
		return anim_kick_high;
	case DOWNLEFTA:
		return anim_kick_high_back;	//backward
	default:
		return anim_idle;
	}
}

function drawHealth(ctx, health, x, y, color)
{
	for (i = 0; i < 6; i++) {
		ctx.fillStyle = (i >= (6 - health)) ? color : "#777";
		off = x + 8 * i;
		ctx.fillRect(off + 0, y + 1, 7, 4);
		ctx.fillRect(off + 1, y + 0, 5, 1);
		ctx.fillRect(off + 1, y + 5, 5, 1);
	}
}

function drawStatus(c)
{
	c.clearRect(0, 0, canvas.width, 20);
	c.font = "" + 6 + "pt C64 Pro Mono";
	// "LV"
	c.fillStyle = "#f0f";
	c.fillText("LV", 224, 8 * 1);
	// Mode
	c.fillStyle = "#f0f";
	c.fillText("DEMO", 256, 8 * 1);
	// Timer
	c.fillStyle = "#aaf";
	c.fillText("21".leftpad(2), 304, 8 * 1);
	// White Score
	drawHealth(c, players[2].health, 0, 2, "#fff");
	c.fillStyle = "#fff";
	c.fillText(players[2].score.toString().leftpad(6), 0, 8 * 2);
	// Red Score
	drawHealth(c, players[1].health, 80, 2, "#faa");
	c.fillStyle = "#faa";
	c.fillText(players[1].score.toString().leftpad(6), 80, 8 * 2);
	// Blue Score
	drawHealth(c, players[0].health, 160, 2, "#aaf");
	c.fillStyle = "#aaf";
	c.fillText(players[0].score.toString().leftpad(6), 160, 8 * 2);
	// Level
	c.fillStyle = "#f0f";
	c.fillText("1".leftpad(2, "0"), 224, 8 * 2);
	// Color
	c.fillStyle = "#fff";
	c.fillText("WHITE".leftpad(5), 256, 8 * 2);
}

function loop()
{
	frameTime++;
	frameCounter++;
	if (frameTime > splashDelay && gameState == GAMEMODE.SPLASH)
		gameState = GAMEMODE.DEMO;

	switch (gameState) {
	case GAMEMODE.SPLASH:
		//DRAW SPLASH
		c.drawImage(iSplash, 0, 0, iSplash.width, iSplash.height, 0, 0, iSplash.width,
			    iSplash.height);
		break;
	case GAMEMODE.DEMO:
		//LOGIC

		//DRAW
		//c.clearRect(0, 0, canvas.width, canvas.height);
		c.drawImage(iBack, 0, 0, iBack.width, iBack.height, 0, 0, iBack.width, iBack.height);

		for (i = 0; i < players.length; i++) {
			players[i].step();

			c.drawImage(images[players[i].spriteSheet], players[i].frameX,
				    players[i].frameY, players[i].spriteWidth,
				    players[i].spriteHeight, players[i].x, players[i].y,
				    players[i].spriteWidth, players[i].spriteHeight);
			players[i].nextAnim = anim_demo;
		}
		if (joystick[0] != 0) {
			gameState = GAMEMODE.GAME;
			for (i = 0; i < players.length; i++) {
				players[i].anim = anim_startidle;
				players[i].nextAnim = anim_startidle;
				players[i].counter = 0;
				players[i].step();
				players[i].counter = 0;
			}
			c.clearRect(0, 0, canvas.width, canvas.height);
		}

		drawStatus(c);

		break;

	case GAMEMODE.GAME:
		c.drawImage(iBack, 0, 0, iBack.width, iBack.height, 0, 0, iBack.width, iBack.height);
		// Logic it

		// Draw
		for (i = 0; i < players.length; i++) {
			if ((players[i].anim == anim_idle || players[i].anim == anim_startidle)
			    && players[i].counter < 100)
				players[i].nextAnim = input(i);
			players[i].step();

			c.drawImage(images[players[i].spriteSheet], players[i].frameX,
				    players[i].frameY, players[i].spriteWidth,
				    players[i].spriteHeight, players[i].x, players[i].y,
				    players[i].spriteWidth, players[i].spriteHeight);
		}
		for (i = 0; i < players.length; i++) {
			range =
			    (players[i].anim.max_ranges[players[i].counter] / 100) *
			    players[i].spriteWidth;
			if (range > 0) {
				for (j = 0; j < players.length; j++) {
					dist = Math.abs(players[i].x - players[j].x);
					if (dist > 0 && dist <= range && i != j
					    && players[j].anim != anim_fall
					    && players[j].anim != anim_knocked_out) {
						players[j].nextAnim = anim_fall;
						players[j].health = Math.max(players[j].health - 1, 0);
						players[j].counter = 100;
						players[i].score += 200;
					}
				}
			}
		}
		drawStatus(c);
		break;

	default:
		break;
	}
}
