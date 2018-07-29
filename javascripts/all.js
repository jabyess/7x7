document.addEventListener("DOMContentLoaded", function(event) {
  var tick = 0

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
        value: 0,
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
      fillSquares: function(num) {
        //num defines how many colored squares to get
        for (var i = 1; i <= num; i++) {
          var randomId = Math.floor(Math.random() * 49 + 1)
          var squareToFill = document.getElementById("sq" + randomId)
          squareToFill.style.backgroundColor = utils.draw.pickRandomColor(
            utils.colors,
            3
          )
        }
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

      utils.draw.fillEmptySquares(1)
    },

    updateNumbers: function() {
      for(stat in gameData.stats) {
        gameData.stats[stat]
        let elem = document.getElementById(gameData.stats[stat].id)
        let value = gameData.stats[stat].value
        elem.innerHTML = value
      }
    },

    onClick: function(e) {
      gameData.stats.clicks.value += 1
      let targetID = e.target.id

      // keep queue short
      if (gameData.clickQ.length > 5) {
        gameData.clickQ.pop()
      }

      gameData.clickQ.unshift(targetID)

      if (!gameData.active) {
        // set active id
        gameData.active = targetID
        // make active visually
        utils.makeActive(gameData.active)
        // if the clicked element is the active element
      } else if (gameData.active === targetID) {
        // then deselect
        utils.makeInactive(gameData.active)
        gameData.active = null
      } else {
        // move square
        let from = gameData.clickQ[1]
        let to = gameData.clickQ[0]
        let toElem = document.getElementById(to)

        // only move if we click on an empty square
        if (!toElem.style.backgroundColor) {
          utils.moveSquare(from, to)
        }
      }

      utils.updateNumbers()

      console.log(gameData.matches)
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
    console.log("game class constructed")

    window.addEventListener("DOMContentLoaded", this.init)

    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.oRequestAnimationFrame

    window.requestAnimationFrame(this.draw.bind(this))
  }

  Game.prototype.draw = function() {
    tick++

    if (tick > 100) {
      tick = 0
    }

    this.update()

    requestAnimationFrame(this.draw.bind(this))
  }

  Game.prototype.update = function() {
    this.checkNeighborsLoop()
  }

  Game.prototype.checkRight = function(x, y, matched) {
    if(y >= 6 || x >= 6) return
    else if (
      gameData.squares[x][y + 1].style.backgroundColor === 
      gameData.squares[x][y].style.backgroundColor
    ) {
      matched.push(gameData.squares[x][y + 1])
      this.checkRight(x, y + 1, matched)
    }
    else {
      if(matched.length >= 4) {
        gameData.matches[x] = matched
      }
      return
    }
  }

  Game.prototype.checkDown = function(x, y, matched) {
    if(y >= 6 || x >= 6) return
    else if(
      gameData.squares[x + 1][y].style.backgroundColor === 
      gameData.squares[x][y].style.backgroundColor
    ) {
      matched.push(gameData.squares[x + 1][y])
      this.checkDown(x + 1, y, matched)
    }
    else {
      if(matched.length >= 4) {
        gameData.matches[x] = matched
      }
      return
    }
  }

  Game.prototype.checkNeighbors = function(x, y) {
    let startMatch = [gameData.squares[x][y]]
    this.checkRight(x, y, startMatch)
    this.checkDown(x, y, startMatch)
    // check others after
  }

  Game.prototype.checkNeighborsLoop = function() {
    for (let x = 0; x < 7; x++) {
      for (let y = 0; y < 7; y++) {
        // if no color, skip
        if (gameData.squares[x][y].style.backgroundColor) {
          // initiate checking functions
          this.checkNeighbors(x, y)
          this.removeMatches()
        }
      }
    }
  }

  Game.prototype.removeMatches = function() {
    if(gameData.matches.length > 0) {
      gameData.matches.forEach(match => {
        match.forEach((sq, i, arr) => {
          sq.removeAttribute('style')
          gameData.stats.score.value += 1
          arr.splice(i, 1)
        })
      })
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
})
