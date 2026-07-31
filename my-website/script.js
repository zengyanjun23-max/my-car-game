const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// 遊戲變數
let score = 0;
let gameOver = false;
let roadOffset = 0;

// 玩家賽車設定
const player = {
    x: 130,
    y: 400,
    width: 40,
    height: 70,
    speed: 5
};

// 障礙物設定
let obstacles = [];
let obstacleTimer = 0;

// 按鍵監聽
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// 產生障礙物
function createObstacle() {
    const laneWidth = 80;
    const lanes = [30, 130, 230]; // 三條車道
    const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
    
    obstacles.push({
        x: randomLane,
        y: -70,
        width: 40,
        height: 70,
        speed: 4 + Math.floor(score / 5) // 分數越高速度越快
    });
}

// 主遊戲迴圈
function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ff4d4d';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, 230);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.fillText('重新整理網頁即可再次挑戰！', canvas.width / 2, 270);
        return;
    }

    // 1. 清空畫布與繪製賽道背景
    ctx.fillStyle = '#444';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 繪製虛線車道分開線
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

    // 2. 移動玩家賽車
    if (keys['ArrowLeft'] && player.x > 10) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width - 10) {
        player.x += player.speed;
    }

    // 繪製玩家賽車（藍色）
    ctx.fillStyle = '#00a8ff';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 3. 處理障礙物
    obstacleTimer++;
    if (obstacleTimer % 60 === 0) {
        createObstacle();
    }

    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.y += obs.speed;

        // 繪製敵方賽車（紅色）
        ctx.fillStyle = '#e84118';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // 碰撞偵測
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            gameOver = true;
        }

        // 超出畫面加分並移除
        if (obs.y > canvas.height) {
            obstacles.splice(i, 1);
            i--;
            score++;
            scoreDisplay.textContent = score;
        }
    }

    requestAnimationFrame(gameLoop);
}

// 啟動遊戲
gameLoop();