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
		sq.dataset.active = false;
		board.appendChild(sq);
	}
}

gameData = {
	level : 1,
	score : {},
	stats : {
		clicks: 0,
		moves: 0
	},
	squares : {

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
	update: {
		checkActiveSquares: function(activeObj) {
			//returns true if more than one square is higlighted
			//takes gameData.squares.active as preferred object.
			var size = 0, s;
			for(s in activeObj) {
				if(activeObj.hasOwnProperty(s)){
					size++;
				}
			}
			if(size > 1) {
				return true;
			}
			else {
				return false;
			}
		},
		highlightFunction: function(hasColor, isActive) {
			// console.log(this);
			function highlightSquare() {
				console.log(this);
				this.style.transform = 'scale(1.1)';
				this.dataset.active = true;
				// squareIsActive = true;	
				console.log('made active');
			}
			function unhighlightSquare() {
				this.style.transform = 'scale(1.0)';
				this.dataset.active = false;
				console.log('already active');
			}
			function makeAllSquaresInactive() {

			}
			if(hasColor && isActive === 'true') {
				unhighlightSquare.bind(this);
			}
			else if(gameUtils.update.checkActiveSquares(gameData.squares.active) === true) {
				var activeSquares = document.querySelector('[data-active="true"]');
				activeSquares.dataset.active = 'false';
				unhighlightSquare(this);
				console.log(activeSquares);
				console.log('another square is active');

			}
			else if(hasColor && isActive === 'false') {
				highlightSquare.bind(this);
				
			}
			else {
				console.log('not active');
			}
		}

	},
	init: {
		squareObjGenerator : function() {
			var defaults = {
				'color' : '#fff',
				'selected' : false
			};
			for(var j = 1; j <= 49; j++) {
				// gameData.squares['sq'+j] = new gameData.squares(defaults);
				var sqName = 'sq'+j;
				gameData.squares[sqName] = defaults;
			}
		},
	},
	
	squareListeners : function() {
		//listeners for squares
		//get this working with bind duh


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

	// this.init();

	window.addEventListener('DOMContentLoaded', this.init);

	

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

	
	this.update();


	requestAnimationFrame(this.draw.bind(this));
};

Game.prototype.update = function() {
	this.updateNumbers();

	this.statusUpdateLoop();



};

Game.prototype.onClick = function() {
	gameData.stats.clicks++;
	// var squareIsActive = squareIsActive || false;
	var isActive = this.dataset.active;
	console.log(gameData);


	//move square
	// if(!this.style.backgroundColor && !squareIsActive) {
	// 	squareIsActive = false;
	// }

	var wat = gameUtils.update.highlightFunction.bind(this, this.style.backgroundColor, isActive);
	wat();

};

Game.prototype.updateNumbers = function() {
	var stats = stats || document.getElementById('clicks');
	stats.innerHTML = gameData.stats.clicks;

};
Game.prototype.statusUpdateLoop = function() {
	var squareCollection = document.getElementsByClassName('square');
	gameData.squares.active = {};
	for(var i = 0; i < squareCollection.length; i++ ) {
		if(squareCollection[i].dataset.active === 'true') {
			var tmp = {};
			tmp[squareCollection[i].id] = true;
			gameData.squares.active += tmp;
		}

	}
};
Game.prototype.init = function() {
	console.log('init fired');

	
	drawBoard();

	// gameUtils.squareListeners();
	var squareListeners = document.getElementsByClassName('square');
	for(var i = 0; i < squareListeners.length; i++){
		squareListeners[i].addEventListener('click', this.onClick, false);
	}

	gameUtils.init.squareObjGenerator();
	console.log(gameData);

	gameUtils.draw.fillEmptySquares(3);
};

//init the game here and stuff
var game = new Game();


});
