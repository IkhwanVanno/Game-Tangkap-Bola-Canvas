const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const timerElement = document.getElementById("timer");

let score = 0;
let lives = 3;
let gameOver = false;
let gameWin = false;
let timeLeft = 60;
let timerInterval;

// ------------------ Menggambar Objek ------------------
// Objek keranjang
const keranjang = {
  x: canvas.width / 2 - 30,
  y: canvas.height - 30,
  width: 60,
  height: 20,
  speed: 8,
};

// Objek bola
const bola = {
  x: Math.random() * (canvas.width - 20),
  y: 0,
  radius: 10,
  speed: 3,
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gambar keranjang
  ctx.fillStyle = "#333";
  ctx.fillRect(keranjang.x, keranjang.y, keranjang.width, keranjang.height);

  // Gambar bola
  ctx.beginPath();
  ctx.arc(bola.x, bola.y, bola.radius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();

  // Gambar game over/win
  if (gameOver || gameWin) {
    ctx.fillStyle = gameWin ? "green" : "black";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      gameWin ? "Kamu Menang!" : "Game Over!",
      canvas.width / 2,
      canvas.height / 2 - 30
    );
    ctx.font = "20px Arial";
    ctx.fillText("Skor Akhir: " + score, canvas.width / 2, canvas.height / 2);
    ctx.fillText(
      "Tekan SPASI/RESTART untuk main lagi",
      canvas.width / 2,
      canvas.height / 2 + 30
    );
    return;
  }
}

// ---------------- Timer ----------------
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      gameWin = true;
      endGame();
    }
  }, 1000);
}
// ---------------- Movement ----------------
// Kontrol keyboard
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
};

// Kontrol holding untuk tombol
const holding = {
  left: false,
  right: false,
};

document.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }
  if (e.code === "Space" && (gameOver || gameWin)) {
    restartGame();
  }
});

document.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

function moveLeft() {
  if (keranjang.x > 0) {
    keranjang.x -= keranjang.speed;
  }
}

function moveRight() {
  if (keranjang.x < canvas.width - keranjang.width) {
    keranjang.x += keranjang.speed;
  }
}

function moveKeranjang() {
  if (keys.ArrowLeft || holding.left) {
    moveLeft();
  }
  if (keys.ArrowRight || holding.right) {
    moveRight();
  }
}

// ---------------- Logika Game ----------------
function moveBola() {
  bola.y += bola.speed;

  // Cek collision dengan keranjang
  if (
    bola.y + bola.radius > keranjang.y &&
    bola.x > keranjang.x &&
    bola.x < keranjang.x + keranjang.width
  ) {
    score++;
    scoreElement.textContent = score;
    resetBall();
    if (score % 5 === 0) {
      bola.speed += 0.5;
    }
  }

  // Bola jatuh ke bawah
  if (bola.y > canvas.height) {
    lives--;
    livesElement.textContent = lives;
    if (lives <= 0) {
      gameOver = true;
      endGame();
    } else {
      resetBall();
    }
  }
}

// untuk reset posisi bola
function resetBall() {
  bola.x = Math.random() * (canvas.width - 20);
  bola.y = 0;
}

// untuk mengakhiri game
function endGame() {
  clearInterval(timerInterval);
  cancelAnimationFrame(gameLoop);
  draw();
}

// untuk start game
function startGame() {
  if (gameOver || gameWin) {
    restartGame();
  } else if (!timerInterval) {
    startTimer();
    gameLoop();
  }
}

// untuk restart game
function restartGame() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  score = 0;
  lives = 3;
  timeLeft = 60;
  bola.speed = 3;
  gameOver = false;
  gameWin = false;
  scoreElement.textContent = score;
  livesElement.textContent = lives;
  timerElement.textContent = timeLeft;
  resetBall();
  startTimer();
  gameLoop();
}

// untuk looping game
function gameLoop() {
  if (!gameOver && !gameWin) {
    moveKeranjang();
    moveBola();
    draw();
    requestAnimationFrame(gameLoop);
  }
}
