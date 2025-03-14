document.addEventListener("DOMContentLoaded", function () {
  let gameData = {
    stats: {
      clicks: {
        id: "clicks",
        value: 0,
      },
      moves: {
        id: "moves",
        value: 0,
      },
      score: {
        id: "score",
        value: 0,
      },
      level: {
        id: "level",
        value: 0,
      },
    },
    scoreQ: [],
    levelMap: [100, 200, 4000, 6000, 10000, 20000],
    active: "",
    matches: new Set(),
    clickQ: [],
    squares: [],
  };

  let utils = {
    draw: {
      pickRandomColor: function (obj, num) {
        //obj = colors object, num = number of colors to pick from
        var colors = Object.keys(obj);
        return obj[colors[(num * Math.random()) << 0]];
      },
      fillEmptySquares: function (num) {
        for (var i = 1; i <= num; i++) {
          var rowId = Math.floor(Math.random() * 7);
          var colId = Math.floor(Math.random() * 7);
          var squareToFill = document.getElementById(`sq${rowId}${colId}`);
          if (squareToFill.dataset.color) {
            i--;
          } else {
            const color = utils.draw.pickRandomColor(utils.colorClasses, 3);
            squareToFill.dataset.color = color;
            squareToFill.classList.add(color);
          }
        }
      },
    },
    init: {
      drawBoard: function () {
        var board = document.getElementById("boardcontainer");
        var width = 6;

        for (var r = 0; r <= width; r++) {
          var row = document.createElement("div");
          row.setAttribute("id", "row" + r);
          row.setAttribute("class", "row");
          board.appendChild(row);

          gameData.squares.push([]);

          var rowElem = document.getElementById(`row${r}`);

          for (var c = 0; c <= width; c++) {
            var sq = document.createElement("div");
            sq.setAttribute("id", `sq${r}${c}`);
            sq.classList.add("square");
            if (r === 0) {
              sq.classList.add("b-top");
            }
            if (r === 6) {
              sq.classList.add("b-bottom");
            }
            if (c === 0) {
              sq.classList.add("b-left");
            }
            if (c === 6) {
              sq.classList.add("b-right");
            }

            sq.dataset.x = r;
            sq.dataset.y = c;
            rowElem.appendChild(sq);
            gameData.squares[r].push(sq);
          }
        }
      },
      randomTitleColor: function () {
        const color = utils.draw.pickRandomColor(utils.colors, 6);
        let title = document.querySelector("h3.title");
        title.style.color = color;
      },
    },

    addMatch: function (val) {
      val.forEach((n) => {
        gameData.matches.add(n);
      });
    },

    updateLevel: function () {
      const currentScore = gameData.scoreQ[0];

      gameData.levelMap.forEach((curr, i, arr) => {
        if (currentScore > curr && currentScore < arr[i + 1]) {
          gameData.stats.level.value = i + 1;
          if (gameData.scoreQ[1] < curr) {
            // do levelup animation
            // levelUpAnimation()
          }
        }
      });
    },

    encodeMatch: function (x, y) {
      return `${x}${y}`;
    },

    decodeMatch: function (num) {
      return num.split("").map((n) => parseInt(n));
    },

    makeActive: function (id) {
      let current = document.getElementById(id);
      current.classList.add("active");
    },

    makeInactive: function (id) {
      let current = document.getElementById(id);
      current.classList.remove("active");
    },

    moveSquare: function (from, to) {
      let fromSquare = document.getElementById(from);
      let toSquare = document.getElementById(to);
      let fromColor = fromSquare.dataset.color;

      toSquare.classList.add(fromColor);
      toSquare.dataset.color = fromColor;
      fromSquare.classList.remove(fromColor);
      fromSquare.classList.remove("active");
      delete fromSquare.dataset.color;
      gameData.active = "";
      gameData.stats.moves.value += 1;
    },

    updateNumbers: function () {
      for (stat in gameData.stats) {
        gameData.stats[stat];
        let elem = document.getElementById(gameData.stats[stat].id);
        elem.innerHTML = gameData.stats[stat].value;
      }
    },

    // todo bgcolor
    hasBackground: function (element) {
      if (element.dataset.color) {
        return true;
      }
      return false;
    },

    getX: function (str) {
      let nums = str.split("");
      return parseInt(`${nums[2]}`);
    },

    getY: function (str) {
      let nums = str.split("");
      return parseInt(`${nums[3]}`);
    },

    isMoveValid: function (from, to) {
      let fx = utils.getX(from);
      let fy = utils.getY(from);

      let tx = utils.getX(to);
      let ty = utils.getY(to);
      // up === x-1
      // down === x+1
      // left === y-1
      // right y+1

      let toCheck = new Set();
      let alreadyChecked = new Set();
      toCheck.add(utils.encodeMatch(fx, fy));

      // fx, fy === current sq coords
      // tx, ty === to square coords
      while (toCheck.size > 0) {
        if (fx === tx && fy === ty) {
          return true;
        } else {
          alreadyChecked = alreadyChecked.add(utils.encodeMatch(fx, fy));
          // check up
          if (
            fx > 0 &&
            !alreadyChecked.has(utils.encodeMatch(fx - 1, fy)) &&
            !utils.hasBackground(gameData.squares[fx - 1][fy])
          ) {
            toCheck = toCheck.add(utils.encodeMatch(fx - 1, fy));
          }
          // check right
          if (
            fy < 6 &&
            !alreadyChecked.has(utils.encodeMatch(fx, fy + 1)) &&
            !utils.hasBackground(gameData.squares[fx][fy + 1])
          ) {
            toCheck.add(utils.encodeMatch(fx, fy + 1));
          }
          // check left
          if (
            fy > 0 &&
            !utils.hasBackground(gameData.squares[fx][fy - 1]) &&
            !alreadyChecked.has(utils.encodeMatch(fx, fy - 1))
          ) {
            toCheck.add(utils.encodeMatch(fx, fy - 1));
          }
          // check down
          if (
            fx < 6 &&
            !utils.hasBackground(gameData.squares[fx + 1][fy]) &&
            !alreadyChecked.has(utils.encodeMatch(fx + 1, fy))
          ) {
            toCheck.add(utils.encodeMatch(fx + 1, fy));
          }
        }

        toCheck.delete(utils.encodeMatch(fx, fy));

        for (let c of toCheck.values()) {
          let nextCoords = utils.decodeMatch(c);
          fx = nextCoords[0];
          fy = nextCoords[1];
          break;
        }
      }
    },

    onClick: function (e) {
      gameData.stats.clicks.value += 1;
      let targetID = e.target.id;

      //todo bgcolor
      let bgc = e.target.dataset.color;

      // keep queue short
      if (gameData.clickQ.length > 10) {
        gameData.clickQ.pop();
      }

      // prevent stacking of same squares
      if (gameData.clickQ[0] != targetID) {
        gameData.clickQ.unshift(targetID);
      }

      //todo bgcolor
      if (!gameData.active && bgc) {
        // set active id
        gameData.active = targetID;
        // make active visually
        utils.makeActive(gameData.active);
        // if the clicked element is the active element
      } else if (gameData.active === targetID) {
        // then deselect
        utils.makeInactive(gameData.active);
        gameData.active = null;
        //todo bgcolor
      } else if (gameData.active && !bgc) {
        // move square
        let from = gameData.clickQ[1];
        let to = gameData.clickQ[0];
        let toElem = document.getElementById(to);
        // only move if we click on an empty square
        if (!toElem.dataset.color && utils.isMoveValid(from, to)) {
          utils.moveSquare(from, to);
          game.update();
        }
      }
    },

    colorClasses: {
      red: "red",
      green: "green",
      blue: "blue",
      purple: "purple",
      cyan: "cyan",
      orange: "orange",
    },

    colors: {
      blue: "#2882ff",
      red: "#ff141d",
      green: "#00f40d",
      orange: "#ff9300",
      purple: "#ff00bd",
      cyan: "#14fcff",
    },
  };

  function Game() {
    //main game is here
  }

  Game.prototype.update = function () {
    this.checkNeighborsLoop();
    if (gameData.matches.size > 0) {
      this.removeMatches();
    } else {
      utils.draw.fillEmptySquares(gameData.stats.level.value + 3);
      this.checkNeighborsLoop();
      if (gameData.matches.size > 0) {
        this.removeMatches();
      }
    }

    utils.updateLevel();
    utils.updateNumbers();
  };

  Game.prototype.checkDR = function (x, y, matched) {
    var matched = matched || [utils.encodeMatch(x, y)];
    if (
      y < 6 &&
      x < 6 &&
      gameData.squares[x + 1][y + 1].dataset.color ===
        gameData.squares[x][y].dataset.color
    ) {
      matched.push(utils.encodeMatch(x + 1, y + 1));
      this.checkDR(x + 1, y + 1, matched);
    } else if (matched.length >= 4) {
      utils.addMatch(matched);
    }
  };

  Game.prototype.checkUR = function (x, y, matched) {
    var matched = matched || [utils.encodeMatch(x, y)];
    if (
      y < 6 &&
      x > 0 &&
      gameData.squares[x - 1][y + 1].dataset.color ===
        gameData.squares[x][y].dataset.color
    ) {
      matched.push(utils.encodeMatch(x - 1, y + 1));
      this.checkUR(x - 1, y + 1, matched);
    } else if (matched.length >= 4) {
      utils.addMatch(matched);
    }
  };

  Game.prototype.checkRight = function (x, y, matched) {
    var matched = matched || [utils.encodeMatch(x, y)];
    if (
      y < 6 &&
      gameData.squares[x][y + 1].dataset.color ===
        gameData.squares[x][y].dataset.color
    ) {
      matched.push(utils.encodeMatch(x, y + 1));
      this.checkRight(x, y + 1, matched);
    } else if (matched.length >= 4) {
      utils.addMatch(matched);
    }
  };

  Game.prototype.checkDown = function (x, y, matched) {
    var matched = matched || [utils.encodeMatch(x, y)];
    if (
      x < 6 &&
      gameData.squares[x + 1][y].dataset.color ===
        gameData.squares[x][y].dataset.color
    ) {
      matched.push(utils.encodeMatch(x + 1, y));
      this.checkDown(x + 1, y, matched);
    } else if (matched.length >= 4) {
      utils.addMatch(matched);
    }
  };

  Game.prototype.checkNeighbors = function (x, y) {
    this.checkDown(x, y);
    this.checkRight(x, y);
    this.checkDR(x, y);
    this.checkUR(x, y);
  };

  Game.prototype.checkNeighborsLoop = function () {
    for (let x = 0; x <= 6; x++) {
      for (let y = 0; y <= 6; y++) {
        // if no color, skip
        if (gameData.squares[x][y].dataset.color) {
          // initiate checking functions
          this.checkNeighbors(x, y);
        }
      }
    }
  };

  Game.prototype.calcScore = function (length) {
    let mult;

    switch (length) {
      case 4:
        mult = 10;
        break;
      case 5:
        mult = 12.5;
        break;
      case 6:
        mult = 20;
        break;
      case 7:
        mult = 30;
        break;
      default:
        mult = 40;
        break;
    }

    let filler = Array(length).fill(1 * mult, 0);

    let score = Math.round(
      filler.reduce((acc, curr) => {
        return (acc += curr);
      })
    );

    gameData.stats.score.value += score;

    if (gameData.scoreQ.length > 10) {
      gameData.scoreQ.pop();
    }
    gameData.scoreQ.unshift(gameData.stats.score.value);
  };

  Game.prototype.removeMatches = function () {
    this.calcScore(gameData.matches.size);
    for (let match of gameData.matches.values()) {
      let coords = utils.decodeMatch(match);
      let square = gameData.squares[coords[0]][coords[1]];
      let color = square.dataset.color;
      square.classList.remove(color);
      delete square.dataset.color;

      gameData.matches.delete(match);
    }
    utils.draw.fillEmptySquares(gameData.stats.level.value + 3);
  };

  Game.prototype.init = function () {
    utils.init.drawBoard();
    utils.init.randomTitleColor();

    var squareListeners = document.getElementsByClassName("square");

    // setup onclick handlers
    for (var i = 0; i < squareListeners.length; i++) {
      squareListeners[i].addEventListener("click", utils.onClick, false);
    }

    this.update();
  };

  //init the game here and stuff
  var game = new Game();
  game.init();
});
