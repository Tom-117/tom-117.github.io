document.addEventListener('DOMContentLoaded', () => {
    // Initialize canvas
    const canvas = document.getElementById("myCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        drawLogo(ctx);
    }

    // Initialize drawing canvas
    const drawingCanvas = document.getElementById('drawingCanvas');
    if (drawingCanvas) {
        initializeDrawingCanvas(drawingCanvas);
    }

    // Start SVG animation
    startSvgAnimation();
});

function drawLogo(ctx) {
    // Background
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, 200, 150);
    
    // Logo triangle
    ctx.beginPath();
    ctx.fillStyle = "#3399ee";
    ctx.moveTo(50, 20);
    ctx.lineTo(150, 20);
    ctx.lineTo(100, 80);
    ctx.closePath();
    ctx.fill();
    
    // Text
    ctx.fillStyle = "#333";
    ctx.font = "14px Arial";
    ctx.fillText("Egyetem", 70, 110);
}

function initializeDrawingCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getCoordinates(e);
    }

    function draw(e) {
        if (!isDrawing) return;
        const [x, y] = getCoordinates(e);
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = document.getElementById('colorPicker').value;
        ctx.lineWidth = document.getElementById('brushSize').value;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        [lastX, lastY] = [x, y];
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        return [
            e.clientX - rect.left,
            e.clientY - rect.top
        ];
    }
}

window.clearCanvas = function() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

function startSvgAnimation() {
    const circle = document.getElementById('movingCircle');
    const rect = document.getElementById('animatedRect');
    const path = document.getElementById('animatedPath');

    function animate() {
        const time = Date.now() / 1000;
        
        // Animate circle
        const x = 20 + Math.sin(time) * 30;
        circle.setAttribute('cx', x);
        
        // Animate rectangle
        rect.setAttribute('transform', `rotate(${time * 30}, 65, 50)`);
        
        // Animate path
        const scale = 1 + Math.sin(time * 2) * 0.2;
        path.setAttribute('transform', `scale(${scale}) translate(0, ${Math.sin(time) * 10})`);
        
        requestAnimationFrame(animate);
    }

    animate();
}
