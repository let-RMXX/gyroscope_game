const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOver = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');
const permissionScreen = document.getElementById('permissionScreen');
const permissionBtn = document.getElementById('permissionBtn');

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
  const tiltX = addEventListener.gamma;

  const tiltY =  addEventListener.beta;

  const sensitivity = 5;

  ball.speedX = tiltX * sensitivity;
  ball.speedY = tiltY * sensitivity;
}

function gameLoop() {
  if (isGameOver){
    return;
  }

  update();

  render();

  requestAnimationFrame();
}

function update() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width || 
    ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {

    isGameOver = true;
    gameOver.classList.remove('hidden');
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
  //Reset Ball Pos and speed
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedX = 0;
  ball.speedY = 0;

  gameLoop();
});

gameLoop();




