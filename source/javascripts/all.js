(function() {

/* jshint -W058 */
document.addEventListener('DOMContentLoaded', function(event) {

	function init() {
		console.log('init fired');

		//define board drawing functions
		function drawBoard() {

			var board = document.getElementById('boardcontainer');
			
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
			Game = {
				fps : '40',
				events : {
					click : function() {
						console.log(this);
					}
				},
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
							squareToFill.style.backgroundColor = Game.draw.pickRandomColor(Game.colors, 3);
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
			timestamp = function() {
				return window.performance && window.performance.now ? window.performance.now() : (new Date()).getTime();
			};
		}
		function setupListeners() {
			var s = document.getElementsByClassName('square');
			for(var i = 0; i < s.length; i++){
				s[i].addEventListener('click', Game.events.click, false);
			}
		}


		drawBoard();
		setupObjects();
		setupListeners();
	}

	//init stuff
	init();

	
	//control flow here
	Game.run = (function() {
		var loops = 0, skipTicks = 1000 / Game.fps,
		maxFrameSkip = 10,
		nextGameTick = timestamp();

		return function() {
			loops = 0;

			while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip ) {
				//Game.update();
				nextGameTick += skipTicks;
				loops++;		
			}

			Game.draw.fillSquares(3);
		

		
	};
	window.clearInterval(Game._intervalId);

	})();

	


	//actual game loop here
	Game._intervalId = window.setInterval(Game.run, 1000 / Game.fps);

	
	



});

})();