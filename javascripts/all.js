document.addEventListener("DOMContentLoaded", function(event) {
	let gameData = {
		level: 1,
		stats: {
			clicks: {
				id: "clicks",
				value: 0
			},
			moves: {
				id: "moves",
				value: 0
			},
			score: {
				id: "score",
				value: 0
			},
			level: {
				id: "level",
				value: 1
			}
		},
		active: "",
		matches: [],
		clickQ: [],
		squares: []
	}

	let utils = {
		draw: {
			pickRandomColor: function(obj, num) {
				//obj = colors object, num = number of colors to pick from
				var colors = Object.keys(obj)
				return obj[colors[(num * Math.random()) << 0]]
			},
			fillEmptySquares: function(num) {
				for (var i = 1; i <= num; i++) {
					var rowId = Math.floor(Math.random() * 7)
					var colId = Math.floor(Math.random() * 7)
					var squareToFill = document.getElementById(`sq${rowId}${colId}`)
					if (squareToFill.style.backgroundColor) {
						console.log("picked a full square!")
						i--
					} else {
						squareToFill.style.backgroundColor = utils.draw.pickRandomColor(
							utils.colors,
							3
						)
					}
				}
			}
		},
		init: {
			drawBoard: function() {
				var board = document.getElementById("boardcontainer")
				var width = 6

				for (var r = 0; r <= width; r++) {
					var row = document.createElement("div")
					row.setAttribute("id", "row" + r)
					row.setAttribute("class", "row")
					board.appendChild(row)

					gameData.squares.push([])

					var rowElem = document.getElementById(`row${r}`)

					for (var c = 0; c <= width; c++) {
						var sq = document.createElement("div")
						sq.setAttribute("id", `sq${r}${c}`)
						sq.setAttribute("class", "square")
						sq.dataset.x = r
						sq.dataset.y = c
						rowElem.appendChild(sq)
						gameData.squares[r].push(sq)
					}
				}
				console.log(gameData.squares)
			}
		},

		makeActive: function(id) {
			let current = document.getElementById(id)
			current.classList.add("active")
		},

		makeInactive: function(id) {
			let current = document.getElementById(id)
			current.classList.remove("active")
		},

		moveSquare: function(from, to) {
			let fromSquare = document.getElementById(from)
			let toSquare = document.getElementById(to)

			toSquare.style.backgroundColor = fromSquare.style.backgroundColor
			fromSquare.removeAttribute("style")
			fromSquare.classList.remove("active")
			gameData.active = ""
			gameData.stats.moves.value += 1

			utils.draw.fillEmptySquares(gameData.stats.level.value + 1)
		},

		updateNumbers: function() {
			for (stat in gameData.stats) {
				gameData.stats[stat]
				let elem = document.getElementById(gameData.stats[stat].id)
				elem.innerHTML = gameData.stats[stat].value
			}
		},

		onClick: function(e) {
			gameData.stats.clicks.value += 1
			let targetID = e.target.id
			let bgc = e.target.style.backgroundColor

			// keep queue short
			if (gameData.clickQ.length > 10) {
				gameData.clickQ.pop()
			}

			gameData.clickQ.unshift(targetID)

			if (!gameData.active && bgc) {
				// set active id
				gameData.active = targetID
				// make active visually
				utils.makeActive(gameData.active)
				// if the clicked element is the active element
			} else if (gameData.active === targetID) {
				// then deselect
				utils.makeInactive(gameData.active)
				gameData.active = null
			} else if(gameData.active && !bgc) {
				// move square
				let from = gameData.clickQ[1]
				let to = gameData.clickQ[0]
				let toElem = document.getElementById(to)

				// only move if we click on an empty square
				if (!toElem.style.backgroundColor) {
					utils.moveSquare(from, to)
					console.log(gameData.matches)
				}
			}

			utils.updateNumbers()

		},

		colors: {
			blue: "#2882ff",
			red: "#ff141d",
			green: "#00f40d",
			orange: "#ff9300",
			purple: "#ff00bd",
			cyan: "#14fcff"
		}
	}

	function Game() {
		//main game is here
		// window.addEventListener("DOMContentLoaded", this.init)

		window.requestAnimationFrame =
			window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.oRequestAnimationFrame

		window.requestAnimationFrame(this.draw.bind(this))
	}

	Game.prototype.draw = function() {
		this.update()

		requestAnimationFrame(this.draw.bind(this))
	}

	Game.prototype.update = function() {
		this.checkNeighborsLoop()
	}

	Game.prototype.checkDR = function(x, y, matched) {
		if (
			y < 6 &&
			x < 6 &&
			gameData.squares[x + 1][y + 1].style.backgroundColor ===
				gameData.squares[x][y].style.backgroundColor
		) {
			matched.push(gameData.squares[x + 1][y + 1])
			this.checkDR(x + 1, y + 1, matched)
		} else {
			if (matched.length >= 4) {
				gameData.matches[x] = matched
			}
		}
	}

	Game.prototype.checkUR = function(x, y, matched) {
		if (
			y < 6 &&
			x > 0 &&
			gameData.squares[x - 1][y + 1].style.backgroundColor ===
				gameData.squares[x][y].style.backgroundColor
		) {
			matched.push(gameData.squares[x - 1][y + 1])
			this.checkUR(x - 1, y + 1, matched)
		} else {
			if (matched.length >= 4) {
				gameData.matches[x] = matched
			}
		}
	}

	Game.prototype.checkRight = function(x, y, matched) {
		if (
			y < 6 &&
			gameData.squares[x][y + 1].style.backgroundColor ===
				gameData.squares[x][y].style.backgroundColor
		) {
			matched.push(gameData.squares[x][y + 1])
			this.checkRight(x, y + 1, matched)
		} else {
			if (matched.length >= 4) {
				gameData.matches[x] = matched
			}
		}
	}

	Game.prototype.checkDown = function(x, y, matched) {
		if (
			x < 6 &&
			gameData.squares[x + 1][y].style.backgroundColor ===
				gameData.squares[x][y].style.backgroundColor
		) {
			//
			matched.push(gameData.squares[x + 1][y])
			this.checkDown(x + 1, y, matched)
		} else {
			if (matched.length >= 4) {
				gameData.matches[x] = matched
			}
		}
	}

	Game.prototype.checkNeighbors = function(x, y) {
		let matched = [gameData.squares[x][y]]
		// check down if x < 6

		this.checkDown(x, y, matched)
		this.checkRight(x, y, matched)
		this.checkDR(x, y, matched)
		this.checkUR(x, y, matched)
	}

	Game.prototype.checkNeighborsLoop = function() {
		for (let x = 0; x <= 6; x++) {
			for (let y = 0; y <= 6; y++) {
				// if no color, skip
				if (gameData.squares[x][y].style.backgroundColor) {
					// initiate checking functions
					this.checkNeighbors(x, y)
					this.removeMatches()
				}
			}
		}
	}

	Game.prototype.calcScore = function(length) {
		let mult

		switch (length) {
			case 4:
				mult = 10
				break
			case 5:
				mult = 12.5
				break
			case 6:
				mult = 17.5
				break
			case 7:
				mult = 25
				break
			default:
				mult = 40
				break
		}

		let filler = Array(length).fill(1 * mult, 0)

		let score = filler.reduce((acc, curr) => {
			return acc += curr
		})

		gameData.stats.score.value += score
	}

	Game.prototype.removeMatches = function() {
		let self = this
		if (gameData.matches.length > 0) {
			gameData.matches.forEach((match, m, gdArr) => {
				self.calcScore(match.length)

				match.forEach(sq => {
					sq.removeAttribute("style")
				})
				// gdArr.splice(m, 1)
			})
			gameData.matches.length = 0;
		}
	}

	Game.prototype.init = function() {
		console.log("init fired")

		utils.init.drawBoard()

		var squareListeners = document.getElementsByClassName("square")
		// setup onclick handlers
		for (var i = 0; i < squareListeners.length; i++) {
			squareListeners[i].addEventListener("click", utils.onClick, false)
		}

		utils.draw.fillEmptySquares(3)
	}

	//init the game here and stuff
	var game = new Game()
	game.init()
})
