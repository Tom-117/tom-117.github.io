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

window.showLineChart = function(row) {
    const canvas = document.getElementById('lineChart');
    const ctx = canvas.getContext('2d');
    
    // Clear previous chart
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get student name and data
    const cells = Array.from(row.cells);
    const studentName = cells[0].textContent;
    const data = cells.slice(1).map(cell => parseFloat(cell.textContent));
    
    // Chart settings
    const padding = 60;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    
    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for(let i = 0; i <= 5; i++) {
        const y = height + padding - (height * i / 5);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width + padding, y);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height + padding);
    ctx.lineTo(width + padding, height + padding);
    ctx.stroke();
    
    // Plot data points and connect them
    ctx.beginPath();
    ctx.strokeStyle = '#3399ee';
    ctx.lineWidth = 3;
    
    const xStep = width / (data.length - 1);
    const yScale = height / 2; // For range 3-5
    
    data.forEach((value, index) => {
        const x = padding + (index * xStep);
        const y = height + padding - ((value - 3) * yScale);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        // Draw points
        ctx.fillStyle = '#3399ee';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add value labels
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value.toString(), x, y - 15);
    });
    
    ctx.strokeStyle = '#3399ee';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    for (let i = 3; i <= 5; i += 0.5) {
        const y = height + padding - ((i - 3) * yScale);
        ctx.textAlign = 'right';
        ctx.fillText(i.toString(), padding - 10, y + 4);
    }
    
    const semesters = ['1. félév', '2. félév', '3. félév', '4. félév', '5. félév'];
    semesters.forEach((sem, index) => {
        const x = padding + (index * xStep);
        ctx.textAlign = 'center';
        ctx.fillText(sem, x, height + padding + 25);
    });
    
    // Add title with student name
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${studentName} - Féléves Tanulmányi Átlagai`, canvas.width / 2, padding - 20);
};
