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
		matches: new Set(),
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

		addMatch: function(val) {
			val.forEach(n => {
				gameData.matches.add(n)
			})
		},

		encodeMatch: function(x, y) {
			return `${x}${y}`
		},

		decodeMatch: function(num) {
			return num.split("").map(n => parseInt(n))
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

		getBackgroundStyle: function(element) {
			console.log('checking background', element)
			if (element.style.backgroundColor) {
				return element.style.backgroundColor
			}
			return null
		},

		getX: function(str) {
			let nums = str.split("")
			return `${nums[2]}`
		},

		getY: function(str) {
			let nums = str.split("")
			return `${nums[3]}`
		},

		isMoveValid: function(from, to) {
			// starting with fx, fy which will be the from square
			// tx, ty are to square coords


			let fx = utils.getY(from)
			let fy = utils.getX(from)

			let tx = utils.getY(to)
			let ty = utils.getX(to)

			console.log(fy, fx, ty, tx)

			// up === y-1
			// down === y+1
			// left === x-1
			// right x+1

			let toCheck = new Set(utils.encodeMatch(fx, fy))
			let alreadyChecked = new Set()

			// first check if from and to are the same,
			// if so, path is valid, return true
			// else

			// fx, fy === current sq coords

			// tx, ty === to square coords
			while (toCheck.size > 0) {
				if (fx === tx && fy === ty) {
					console.log("move valid")
					return true
				} else {
					alreadyChecked.add(utils.encodeMatch(fx, fy))
					// check up
					if (
						fx > 0 &&
						utils.getBackgroundStyle(gameData.squares[fx - 1][fy]) &&
						!alreadyChecked.has(utils.encodeMatch(fx - 1, fy))
					) {
						console.log("up is valid")
						toCheck.add(utils.encodeMatch(fx, fy - 1))
					}
					// check right
					// if (
					// 	fx < 6 &&
					// 	utils.getBackgroundStyle(gameData.squares[fx + 1][fy]) &&
					// 	!alreadyChecked.has(utils.encodeMatch(fx + 1, fy))
					// ) {
					// 	console.log('right is valid')
					// 	toCheck.add(utils.encodeMatch(fx + 1, fy))
					// }
					// // check left
					// if (
					// 	fx > 0 &&
					// 	utils.getBackgroundStyle(gameData.squares[fx - 1][fy]) &&
					// 	!alreadyChecked.has(utils.encodeMatch(fx - 1, fy))
					// ) {
					// 	console.log('left is valid')
					// 	toCheck.add(utils.encodeMatch(fx - 1, fy))
					// }
					// // check down
					// if (
					// 	fy < 6 &&
					// 	utils.getBackgroundStyle(gameData.squares[fx][fy + 1]) &&
					// 	!alreadyChecked.has(utils.encodeMatch(fx, fy + 1))
					// ) {
					// 	toCheck.add(utils.encodeMatch(fx, fy+1))
					// }
				}

				console.log(toCheck, alreadyChecked)

				return false
			}

			// check all 4 directions U D L R handling edge cases
			// if any direction is white/valid, add to toCheck queue
			// add current sq to alreadyChecked queue
			// pop one from toCheck, recurse another function
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
			} else if (gameData.active && !bgc) {
				// move square
				let from = gameData.clickQ[1]
				let to = gameData.clickQ[0]
				let toElem = document.getElementById(to)
				// check to see if path is valid?
				console.log(gameData.clickQ)
				// only move if we click on an empty square
				if (!toElem.style.backgroundColor && utils.isMoveValid(from, to)) {
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
		var matched = matched || [utils.encodeMatch(x, y)]
		if (
			y < 6 &&
			x < 6 &&
			gameData.squares[x + 1][y + 1].style.backgroundColor ===
				gameData.squares[x][y].style.backgroundColor
		) {
			matched.push(utils.encodeMatch(x + 1, y + 1))
			this.checkDR(x + 1, y + 1, matched)
		} else if (matched.length >= 4) {
			console.log("adding match DR", matched)
			utils.addMatch(matched)
		}
	}

	Game.prototype.checkUR = function(x, y, matched) {
		var matched = matched || [utils.encodeMatch(x, y)]
		if (
			y < 6 &&
			x > 0 &&
			gameData.squares[x - 1][y + 1].style.backgroundColor ===
				gameData.squares[x][y].style.backgroundColor
		) {
			matched.push(utils.encodeMatch(x - 1, y + 1))
			this.checkUR(x - 1, y + 1, matched)
		} else if (matched.length >= 4) {
			console.log("adding match UR", matched)
			utils.addMatch(matched)
		}
	}

	Game.prototype.checkRight = function(x, y, matched) {
		var matched = matched || [utils.encodeMatch(x, y)]
		if (
			y < 6 &&
			gameData.squares[x][y + 1].style.backgroundColor ===
				gameData.squares[x][y].style.backgroundColor
		) {
			matched.push(utils.encodeMatch(x, y + 1))
			this.checkRight(x, y + 1, matched)
		} else if (matched.length >= 4) {
			console.log("adding match R", matched)
			utils.addMatch(matched)
		}
	}

	Game.prototype.checkDown = function(x, y, matched) {
		var matched = matched || [utils.encodeMatch(x, y)]
		if (
			x < 6 &&
			gameData.squares[x + 1][y].style.backgroundColor ===
				gameData.squares[x][y].style.backgroundColor
		) {
			//
			matched.push(utils.encodeMatch(x + 1, y))
			this.checkDown(x + 1, y, matched)
		} else if (matched.length >= 4) {
			console.log("adding match D", matched)
			utils.addMatch(matched)
		}
	}

	Game.prototype.checkNeighbors = function(x, y) {
		// let matched = [utils.encodeMatch(x, y)]
		// check down if x < 6

		this.checkDown(x, y)
		this.checkRight(x, y)
		this.checkDR(x, y)
		this.checkUR(x, y)
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
			return (acc += curr)
		})

		gameData.stats.score.value += score
	}

	Game.prototype.removeMatches = function() {
		if (gameData.matches.size > 0) {
			this.calcScore(gameData.matches.size)
			for (let match of gameData.matches.values()) {
				let coords = utils.decodeMatch(match)
				gameData.squares[coords[0]][coords[1]].removeAttribute("style")
				gameData.matches.delete(match)
			}
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
