declare const io: () => import("socket.io-client").Socket;
const socket = io();

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (!ctx) {
  throw new Error("Canvas context not available");
}

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('gameState', (data) => {
  console.log(data);
  // ctx.fillStyle = 'blue';
  // ctx.beginPath();
  // ctx.arc(data.x, data.y, 10, 0, Math.PI * 2);
  // ctx.fill();
});

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  socket.emit('draw', { x, y });
});
