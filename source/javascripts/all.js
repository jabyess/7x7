/* jshint -W058 */
document.addEventListener('DOMContentLoaded', function(event) {

var tick = 0;


function drawBoard() {
	var board = document.getElementById('boardcontainer');

	//make 49 squares. board is 7x7, duh.
	for(var i = 1; i <= 49; i++) {
		var sq = document.createElement('div');
		sq.setAttribute('id','sq'+i);
		sq.setAttribute('class','square');
		board.appendChild(sq);
	}
}

gameData = {
	level : 1,
	score : {},
	stats : {
		clicks: 0,
		moves: 0
	}
};

gameUtils = {	
	draw : {
		pickRandomColor : function(obj, num) {
			//obj = colors object, num = number of colors to pick from
			var colors = Object.keys(obj);
			return obj[colors[num * Math.random() << 0]];
		},
		fillSquares : function(num) {
			//num defines how many colored squares to get
			for(var i=1; i <= num; i++) {
				var randomId = Math.floor(Math.random() * 49 +1);
				var squareToFill = document.getElementById('sq'+randomId);
				squareToFill.style.backgroundColor = gameUtils.draw.pickRandomColor(gameUtils.colors, 3);
			}
		},
		fillEmptySquares: function(num) {
			for(var i = 1; i<= num; i++) {
				var randomId = Math.floor(Math.random() * 49 + 1);
				var squareToFill = document.getElementById('sq'+randomId);
				if(squareToFill.style.backgroundColor) {
					console.log('picked a full square!');
					i--;
				}
				else {
					squareToFill.style.backgroundColor = gameUtils.draw.pickRandomColor(gameUtils.colors, 3);
				}
			}
		}
	},
	colors : {
		'blue' : '#2882ff',
		'red' : '#ff141d',
		'green' : '#00f40d',
		'orange' : '#ff9300',
		'purple' : '#ff00bd',
		'cyan' : '#14fcff'
	}
};

function Game() {
	//main game is here
	console.log('game class constructed');

	this.init();

	//listeners for squares
	var squareListeners = document.getElementsByClassName('square');
	for(var i = 0; i < squareListeners.length; i++){
		squareListeners[i].addEventListener('click', this.onclick, false);
	}

	window.requestAnimationFrame =
	    window.requestAnimationFrame ||
	    window.mozRequestAnimationFrame ||
	    window.webkitRequestAnimationFrame ||
	    window.oRequestAnimationFrame;

	window.requestAnimationFrame(this.draw.bind(this));
}

Game.prototype.draw = function() {
	tick++;
	// console.log(tick);
	if(tick > 100) {
		tick = 0;
	}

	this.drawNumbers();
	this.update();


	requestAnimationFrame(this.draw.bind(this));
};

Game.prototype.update = function() {


};

Game.prototype.onclick = function() {
	gameData.stats.clicks++;
	var squareIsActive = squareIsActive || false;

	function highlightSquare(hasColor, isActive) {
		if(hasColor && !isActive) {
			this.style.transform = 'scale(1.1)';
			squareIsActive = true;	
			console.log('made active');
		}	
		console.log('else');
	}
	//move square
	// if(!this.style.backgroundColor && !squareIsActive) {
	// 	squareIsActive = false;
	// }

	var wat = highlightSquare.bind(this, this.style.backgroundColor, squareIsActive);
	wat();

};

Game.prototype.drawNumbers = function() {
	var stats = stats || document.getElementById('clicks');
	stats.innerHTML = gameData.stats.clicks;

};
Game.prototype.init = function() {
	console.log('init fired');

	drawBoard();
	gameUtils.draw.fillEmptySquares(3);
};

//init the game here and stuff
var game = new Game();


});
