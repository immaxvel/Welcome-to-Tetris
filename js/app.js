document.addEventListener("DOMContentLoaded", () => {
  const GRID_WIDTH = 10;
  const GRID_HEIGHT = 20;
  const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;

  const grid = createGrid();
  let squares = Array.from(grid.querySelectorAll("div"));
  const startBtn = document.querySelector(".button");
  const leftBtn = document.querySelector(".control1");
  const rightBtn = document.querySelector(".control2");
  const downBtn = document.querySelector(".control3");
  const upBtn = document.querySelector(".control4");
  const muteBtn = document.querySelector(".control5");
  const scoreDisplay = document.querySelector(".score-display");
  const linesDisplay = document.querySelector(".lines-score");
  const gameOverText = document.querySelector(".game-over");
  const music = document.querySelector(".zvuk");
  const sad = document.querySelector(".sad");
  const peeek = document.querySelector(".peeek");
  const tyc = document.querySelector(".tyc");
  const atom = document.querySelector(".atom");
  let modalC = document.querySelector(".modal-uprav");
  let modalR = document.querySelector(".modal-records");
  let modalA = document.querySelector(".modal-about");
  let openformC = document.querySelector("#uprav");
  let openformR = document.querySelector("#record");
  let openformA = document.querySelector("#about");
  let closeUprav = document.querySelector(".closeU");
  let closeRecords = document.querySelector(".closeR");
  let closeAbout = document.querySelector(".closeA");
  let restartGame = document.querySelector(".restartGame");

  let currentIndex = 0;
  let currentRotation = 0;
  const width = 10;
  let score = 0;
  let lines = 0;
  let timerId;
  let nextRandom = 0;
  const colors = [
    "url(images/blue_block.png)",
    "url(images/pink_block.png)",
    "url(images/purple_block.png)",
    "url(images/peach_block.png)",
    "url(images/yellow_block.png)",
  ];

  function createGrid() {
    // главная область
    let grid = document.querySelector(".grid");
    for (let i = 0; i < GRID_SIZE; i++) {
      let gridElement = document.createElement("div");
      grid.appendChild(gridElement);
    }

    // устанавливаем базу грида
    for (let i = 0; i < GRID_WIDTH; i++) {
      let gridElement = document.createElement("div");
      gridElement.setAttribute("class", "block3");
      grid.appendChild(gridElement);
    }

    let previousGrid = document.querySelector(".previous-grid");
    for (let i = 0; i < 16; i++) {
      let gridElement = document.createElement("div");
      previousGrid.appendChild(gridElement);
    }
    return grid;
  }

  //кнопки
  function control(e) {
    if (e.keyCode === 39) moveright();
    else if (e.keyCode === 38) rotate();
    else if (e.keyCode === 37) moveleft();
    else if (e.keyCode === 40) moveDown();
  }

  // ивент на нажатие
  document.addEventListener("keydown", control);

  //тетрисинки
  const lTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
    [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2],
  ];

  const zTetromino = [
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
  ];

  const tTetromino = [
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
  ];

  const iTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  //случайный выбор тетрисинок
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //движение вниз
  let currentPosition = 4;
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("block");
      squares[currentPosition + index].style.backgroundImage = colors[random];
    });
  }

  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("block");
      squares[currentPosition + index].style.backgroundImage = "none";
    });
  }

  function moveDown() {
    undraw();
    currentPosition = currentPosition += width;
    draw();
    freeze();
    tyc.play();
  }
  leftBtn.addEventListener("click", () => {
    moveleft();
    navigator.vibrate(50);
  });
  rightBtn.addEventListener("click", () => {
    moveright();
    navigator.vibrate(50);
  });
  downBtn.addEventListener("click", () => {
    moveDown();
    navigator.vibrate(50);
  });
  upBtn.addEventListener("click", () => {
    rotate();
    navigator.vibrate(50);
  });
  startBtn.addEventListener("click", () => {
    if (music.paused) {
      addMusic();
    } else {
      pauseMusic();
    }
    navigator.vibrate(50);
  });
  muteBtn.addEventListener("click", () => {
    if (music.volume) {
      muteMusic();
    } else {
      unmuteMusic();
    }
    navigator.vibrate(50);
  });

  function addMusic() {
    music.volume = 0.5;
    music.play();
  }
  function pauseMusic() {
    music.pause();
  }
  function muteMusic() {
    music.volume = 0;
  }
  function unmuteMusic() {
    music.volume = 1;
  }

  //  управление
  openformC.addEventListener("click", () => {
    openC();
    navigator.vibrate(50);
  });
  function openC() {
    modalC.style.left = "0px";
  }
  closeUprav.addEventListener("click", () => {
    closeU();
    navigator.vibrate(50);
  });
  function closeU() {
    modalC.style.left = "-100%";
  }

  // Рекорды
  openformR.addEventListener("click", () => {
    openR();
    navigator.vibrate(50);
  });
  function openR() {
    modalR.style.left = "0px";
  }
  closeRecords.addEventListener("click", () => {
    closeR();
    navigator.vibrate(50);
  });
  function closeR() {
    modalR.style.left = "-100%";
  }

  // о игре
  openformA.addEventListener("click", () => {
    openA();
    navigator.vibrate(50);
  });
  function openA() {
    modalA.style.left = "0px";
  }
  closeAbout.addEventListener("click", () => {
    closeA();
    navigator.vibrate(50);
  });
  function closeA() {
    modalA.style.left = "-100%";
  }
  // swipe left
  modalC.addEventListener("swiped-left", function (e) {
    modalC.style.left = "-100%";
  });

  modalR.addEventListener("swiped-left", function (e) {
    modalR.style.left = "-100%";
  });

  modalA.addEventListener("swiped-left", function (e) {
    modalA.style.left = "-100%";
  });

  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 400);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
    navigator.vibrate(50);
  });

  restartGame.addEventListener("click", () => {
    restart();
    navigator.vibrate(50);
  });

  function restart() {
    document.location.reload();
  }
  //движение влево и предотвращение столкновений
  function moveright() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("block2")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
    peeek.play();
  }

  //движение вправо и предотвращение столкновений
  function moveleft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("block2")
      )
    ) {
      currentPosition += 1;
    }
    draw();
    peeek.play();
  }

  //заморозка
  function freeze() {
    if (
      current.some(
        (index) =>
          squares[currentPosition + index + width].classList.contains(
            "block3"
          ) ||
          squares[currentPosition + index + width].classList.contains("block2")
      )
    ) {
      current.forEach((index) =>
        squares[index + currentPosition].classList.add("block2")
      );
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  //Поворот
  ///фикс поворота около края
  function isAtRight() {
    return current.some((index) => (currentPosition + index + 1) % width === 0);
  }

  function isAtLeft() {
    return current.some((index) => (currentPosition + index) % width === 0);
  }

  function checkRotatedPosition(P) {
    P = P || currentPosition; //получаем текущее положение.  Затем проверка, находится ли тетрисина рядом с левой стороной.
    if ((P + 1) % width < 4) {
      //добавляем 1, потому что индекс позиции может быть на 1 меньше, чем тот, где находится тетрисина
      if (isAtRight()) {
        //используем текущее положение для проверки, перевернулся ли направо
        currentPosition += 1; //если да, то добавляем 1
        checkRotatedPosition(P); //проверяем позицию еще раз
      }
    } else if (P % width > 5) {
      if (isAtLeft()) {
        currentPosition -= 1;
        checkRotatedPosition(P);
      }
    }
  }

  //поворот
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      //if the current rotation gets to 4, make it go back to 0
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    checkRotatedPosition();
    draw();
    peeek.play();
  }

  //конец игры
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("block2")
      )
    ) {
      scoreDisplay.innerHTML = "";
      gameOverText.style.display = "flex";
      gameOverText.style.left = "0%";
      clearInterval(timerId);
      music.pause();
      sad.play();
    }
  }

  const displayWidth = 4;
  const displaySquares = document.querySelectorAll(".previous-grid div");
  let displayIndex = 0;

  const smallTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2] /* lTetromino */,
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1] /* zTetromino */,
    [1, displayWidth, displayWidth + 1, displayWidth + 2] /* tTetromino */,
    [0, 1, displayWidth, displayWidth + 1] /* oTetromino */,
    [
      1,
      displayWidth + 1,
      displayWidth * 2 + 1,
      displayWidth * 3 + 1,
    ] /* iTetromino */,
  ];

  function displayShape() {
    displaySquares.forEach((square) => {
      square.classList.remove("block");
      square.style.backgroundImage = "none";
    });
    smallTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("block");
      displaySquares[displayIndex + index].style.backgroundImage =
        colors[nextRandom];
    });
  }

  //Счет
  function addScore() {
    for (
      currentIndex = 0;
      currentIndex < GRID_SIZE;
      currentIndex += GRID_WIDTH
    ) {
      const row = [
        currentIndex,
        currentIndex + 1,
        currentIndex + 2,
        currentIndex + 3,
        currentIndex + 4,
        currentIndex + 5,
        currentIndex + 6,
        currentIndex + 7,
        currentIndex + 8,
        currentIndex + 9,
      ];
      if (row.every((index) => squares[index].classList.contains("block2"))) {
        score += 10;
        lines += 1;
        scoreDisplay.innerHTML = score;
        linesDisplay.innerHTML = lines;
        row.forEach((index) => {
          squares[index].style.backgroundImage = "none";
          squares[index].classList.remove("block2") ||
            squares[index].classList.remove("block");
          atom.play();
        });

        const squaresRemoved = squares.splice(currentIndex, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }
});
