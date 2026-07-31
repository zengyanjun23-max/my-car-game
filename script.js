const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

let score = 0;
let gameOver = false;
let roadOffset = 0;

const player = {
    x: 130,
    y: 360,
    width: 40,
    height: 70,
    speed: 5
};

let obstacles = [];
let obstacleTimer = 0;

// 按鍵與觸控狀態
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// 綁定手機按鈕事件
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

const handleLeft = (e) => { e.preventDefault(); keys['ArrowLeft'] = true; };
const stopLeft = (e) => { e.preventDefault(); keys['ArrowLeft'] = false; };
const handleRight = (e) => { e.preventDefault(); keys['ArrowRight'] = true; };
const stopRight = (e) => { e.preventDefault(); keys['ArrowRight'] = false; };

leftBtn.addEventListener('touchstart', handleLeft);
leftBtn.addEventListener('touchend', stopLeft);
leftBtn.addEventListener('mousedown', handleLeft);
leftBtn.addEventListener('mouseup', stopLeft);

rightBtn.addEventListener('touchstart', handleRight);
rightBtn.addEventListener('touchend', stopRight);
rightBtn.addEventListener('mousedown', handleRight);
rightBtn.addEventListener('mouseup', stopRight);

function createObstacle() {
    const lanes = [30, 130, 230];
    const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
    
    obstacles.push({
        x: randomLane,
        y: -70,
        width: 40,
        height: 70,
        speed: 4 + Math.floor(score / 5)
    });
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ff4d4d';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, 200);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '15px Arial';
        ctx.fillText('重新整理網頁即可再次挑戰！', canvas.width / 2, 240);
        return;
    }

    ctx.fillStyle = '#444';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 20]);
    ctx.lineDashOffset = -roadOffset;
    
    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.lineTo(100, canvas.height);
    ctx.moveTo(200, 0);
    ctx.lineTo(200, canvas.height);
    ctx.stroke();

    roadOffset = (roadOffset + 5) % 40;

    if (keys['ArrowLeft'] && player.x > 10) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width - 10) {
        player.x += player.speed;
    }

    ctx.fillStyle = '#00a8ff';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    obstacleTimer++;
    if (obstacleTimer % 60 === 0) {
        createObstacle();
    }

    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.y += obs.speed;

        ctx.fillStyle = '#e84118';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            gameOver = true;
        }

        if (obs.y > canvas.height) {
            obstacles.splice(i, 1);
            i--;
            score++;
            scoreDisplay.textContent = score;
        }
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
