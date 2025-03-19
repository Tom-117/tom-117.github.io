// Web Storage példa
function saveDepartment() {
  const dept = document.getElementById("departmentSelect").value;
  localStorage.setItem("selectedDept", dept);
  document.getElementById("savedDept").innerText = "Mentett szak: " + dept;
}

// Load saved department on page load
window.addEventListener('load', () => {
  const savedDept = localStorage.getItem("selectedDept");
  if (savedDept) {
      document.getElementById("departmentSelect").value = savedDept;
      document.getElementById("savedDept").innerText = "Mentett szak: " + savedDept;
  }
});

// Web Storage
function saveNote() {
    const note = document.getElementById('noteInput').value;
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
    document.getElementById('noteInput').value = '';
}

function displayNotes() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const container = document.getElementById('savedNotes');
    container.innerHTML = notes.map(note => `<p>${note}</p>`).join('');
}

// Geolocation példa
function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              document.getElementById("locationInfo").innerHTML = 
                  `Szélesség: ${lat.toFixed(4)}<br>
                   Hosszúság: ${lon.toFixed(4)}<br>
                   Pontosság: ${position.coords.accuracy} méter`;
              
              // Draw location on canvas
              drawLocationOnMap(lat, lon);
          },
          (error) => {
              document.getElementById("locationInfo").innerText = 
                  "Hiba: " + getGeolocationError(error);
          }
      );
  } else {
      document.getElementById("locationInfo").innerText = "Geolocation nem támogatott.";
  }
}

function getGeolocationError(error) {
  switch(error.code) {
      case error.PERMISSION_DENIED:
          return "Felhasználó nem engedélyezte a helymeghatározást.";
      case error.POSITION_UNAVAILABLE:
          return "Helyadatok nem elérhetőek.";
      case error.TIMEOUT:
          return "Időtúllépés a lekérésben.";
      default:
          return "Ismeretlen hiba.";
  }
}

let watchId;

function trackLocation() {
    if (!navigator.geolocation) {
        document.getElementById('locationDisplay').innerHTML = "Geolocation is not supported";
        return;
    }

    const locationMap = document.getElementById('locationMap').getContext('2d');
    
    watchId = navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            document.getElementById('locationDisplay').innerHTML = 
                `Latitude: ${latitude.toFixed(4)}<br>Longitude: ${longitude.toFixed(4)}`;
            
            // Draw on map
            locationMap.clearRect(0, 0, 400, 300);
            locationMap.fillStyle = '#f0f0f0';
            locationMap.fillRect(0, 0, 400, 300);
            locationMap.fillStyle = 'red';
            locationMap.beginPath();
            locationMap.arc(200, 150, 5, 0, Math.PI * 2);
            locationMap.fill();
        },
        (error) => {
            document.getElementById('locationDisplay').innerHTML = `Error: ${error.message}`;
        }
    );
}

// Drag & Drop továbbfejlesztett verzió
document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable');
    const dropZone = document.getElementById('dropZone');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            e.target.classList.add('dragging');
            e.dataTransfer.setData('text/plain', e.target.getAttribute('data-value'));
        });

        draggable.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.background = '#e0e0e0';
    });

    dropZone.addEventListener('dragleave', (e) => {
        dropZone.style.background = '';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        dropZone.innerHTML += `<div class="dragged-item">${data}</div>`;
        dropZone.style.background = '';
    });
});

// Canvas rajzolás
window.addEventListener("load", () => {
  const canvas = document.getElementById("myCanvas");
  if (canvas.getContext) {
      const ctx = canvas.getContext("2d");
      
      // Háttér
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Egyetem logo
      ctx.beginPath();
      ctx.fillStyle = "#3399ee";
      ctx.moveTo(50, 20);
      ctx.lineTo(150, 20);
      ctx.lineTo(100, 80);
      ctx.closePath();
      ctx.fill();
      
      // Szöveg
      ctx.fillStyle = "#333";
      ctx.font = "14px Arial";
      ctx.fillText("Egyetem", 70, 95);
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Add clear canvas function
    window.clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    function draw(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = document.getElementById('colorPicker').value;
        ctx.lineWidth = document.getElementById('brushSize').value;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        [lastX, lastY] = [x, y];
    }

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        [lastX, lastY] = [e.clientX - rect.left, e.clientY - rect.top];
    });

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);
});

// SVG dinamikus manipuláció
function updateSvg() {
  const svg = document.getElementById("dynamicSvg");
  const circle = document.getElementById("movingCircle");
  const currentX = parseInt(circle.getAttribute("cx"));
  
  // Mozgatás balról jobbra
  circle.setAttribute("cx", (currentX + 5) % 180 + 20);
  
  // Szín változtatás
  const hue = Math.floor((currentX / 200) * 360);
  circle.setAttribute("fill", `hsl(${hue}, 70%, 60%)`);
}

// SVG animáció indítása
window.addEventListener("load", () => {
  setInterval(updateSvg, 50);
});

function animateSvg() {
    // Graduation cap bounce animation
    const gradCap = document.getElementById('gradCap');
    const gradTassel = document.getElementById('gradTassel');
    const bounceHeight = Math.sin(Date.now() / 1000) * 10;
    gradCap.style.transform = `translateY(${bounceHeight}px)`;
    gradTassel.style.transform = `translateY(${bounceHeight}px) rotate(${Math.sin(Date.now() / 500) * 15}deg)`;

    // Book opening/closing animation
    const book = document.querySelector('.animated-book');
    const openAmount = Math.abs(Math.sin(Date.now() / 2000));
    book.style.transform = `translate(300,80) scaleX(${0.8 + openAmount * 0.2})`;

    // Progress circle animation
    const progressArc = document.getElementById('progressArc');
    const progressText = document.getElementById('progressText');
    const progress = (Math.sin(Date.now() / 2000) + 1) * 50; // 0-100%
    const dashOffset = 251.2 * (1 - progress / 100);
    progressArc.style.strokeDashoffset = dashOffset;
    progressText.textContent = `${Math.round(progress)}%`;

    requestAnimationFrame(animateSvg);
}

// Web Worker
let worker = new Worker('worker.js');
worker.onmessage = function(e) {
    document.getElementById('workerResult').textContent = 
        `Prímszámok 1000-ig: ${e.data.slice(0, 5).join(', ')}...`;
};

function startCalculation() {
    worker.postMessage(1000);
}

// Server-Sent Events
const evtSource = new EventSource('events.php');
evtSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const div = document.getElementById('serverEvents');
    div.innerHTML = `Idő: ${data.time}, Érték: ${data.value}`;
};

// Initialize
window.addEventListener('load', () => {
    displayNotes();
    animateSvg();
});

function drawLocationOnMap(lat, lon) {
  const canvas = document.getElementById("locationCanvas");
  if (canvas.getContext) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Egyszerű térkép rajzolása
      ctx.fillStyle = "#e0e0e0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Pozíció jelölése
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
      
      // Koordináták kiírása
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillText(`${lat.toFixed(4)}, ${lon.toFixed(4)}`, 10, 20);
  }
}