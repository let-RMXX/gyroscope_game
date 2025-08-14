const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOver = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');
const permissionScreen = document.getElementById('permissionScreen');
const permissionBtn = document.getElementById('permissionBtn');
const gameOverSound = new Audio('/Assets/Sound/biohazard.mp3');
const gameStart = document.getElementById('gameStart');
const countdownTxt = document.getElementById('countdownTxt');

function setCanvasDimensions() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
setCanvasDimensions();

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  color: 'red',
  speedX: 0,
  speedY: 0
};

let isGameOver = false;

function startCountdown() {
  let timeLeft = 3;
  gameStart.classList.remove('hidden');
  countdownTxt.textContent = timeLeft;

  const countdownInterval = setInterval(() => {
      timeLeft--;
      if(timeLeft > 0){
        countdownTxt.textContent = timeLeft;
      } else {
        clearInterval(countdownInterval);
        gameStart.classList.add('hidden');
        gameLoop();
      }
    }, 1000);
}

if (typeof DeviceOrientationEvent.requestPermission === 'function') {
  permissionBtn.addEventListener('click', () => {
    DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            permissionScreen.style.display = 'none';
            window.addEventListener('deviceorientation', handleOrientation);
            gameLoop();
          } else {
              alert('Permission to use gyroscope denied.');
          }
        })
        .catch(console.error);
  });
} else {
  permissionScreen.style.display = 'none';
  window.addEventListener('deviceorientation', handleOrientation);
  gameLoop();
}

function handleOrientation() {
  const tiltX = event.gamma;

  const tiltY =  event.beta;

  const sensitivity = 1;

  ball.speedX = tiltX * sensitivity;
  ball.speedY = tiltY * sensitivity;
}

function gameLoop() {
  if (isGameOver){
    return;
  }

  update();

  render();

  window.requestAnimationFrame(gameLoop);
}

gameOverSound.loop = false;

function update() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width || 
    ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {

      if (!isGameOver) {
          isGameOver = true;
          gameOver.classList.remove('hidden');

          gameOverSound.play();

          setTimeout(() => {
            gameOverSound.pause();
            gameOverSound.currentTime = 0;
          }, 30000);
      }
    }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

restartBtn.addEventListener('click', () => {
  isGameOver = false;
  gameOver.classList.add('hidden');

  // Stop sound on restart
  gameOverSound.pause();
  gameOverSound.currentTime = 0;

  //Reset Ball Pos and speed
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedX = 0;
  ball.speedY = 0;

  gameLoop();
});

gameLoop();




