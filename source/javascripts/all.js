(function() {

document.addEventListener('DOMContentLoaded', function(event) {
	function init() {
		console.log('init fired');

		//define board drawing functions
		function drawBoard() {

			var board = document.getElementById('boardcontainer');
			
			// sq.setAttribute('id','sq');
			// board.appendChild(sq);
			for(var i = 1; i <= 49; i++) {
				var sq = document.createElement('div');
				sq.setAttribute('id','sq'+i);
				sq.setAttribute('class','square');
				board.appendChild(sq);
			}
		}

		function setupObjects(){
			Data = {
				level : 1,
				score : {},
				stats : {}
			};
			Game = {};
			Game.draw = {
				pickRandomColor : function(obj, num) {
					//obj = colors object, num = how many colors to choose from
					//num used for levels later on, 3 for level 1, 4 for level 2, etc
					var colors = Object.keys(obj);
					return obj[colors[num * Math.random() << 0]];
				},
				fillSquares : function(num) {
					//num defines how many colored squares to get
					for(var i=1; i <= num; i++) {
						var randomId = Math.floor(Math.random() * 49 +1);
						var squareToFill = document.getElementById('sq'+randomId);
						var color = Game.draw.pickRandomColor(Game.colors, 3);
						squareToFill.style.backgroundColor = color;	
					}
					
				}

			};
			Game.colors = {
				'blue' : '#2882ff',
				'red' : '#ff141d',
				'green' : '#00f40d',
				'orange' : '#ff9300',
				'purple' : '#ff00bd',
				'cyan' : '#14fcff'
			};
			Game.fps = '40';

		}


		drawBoard();
		setupObjects();
	}

	//init stuff
	init();

	
	//control flow here
	Game.run = function() {
		//update and draw separately in here

		Game.draw.fillSquares(3);

		window.clearInterval(Game._intervalId);

	};


	


	//actual game loop here
	Game._intervalId = window.setInterval(Game.run, 1000 / Game.fps);

	
	



});

})();