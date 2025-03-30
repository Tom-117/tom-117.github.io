
const workerCode = `
    let grades = [];

    self.addEventListener('message', function(e) {
        try {
            switch (e.data.type) {
                case 'setGrades':
                    grades = e.data.grades;
                    break;
                case 'addGrade':
                    if (!grades.some(g => g.subject === e.data.grade.subject)) {
                        grades.push(e.data.grade);
                        self.postMessage({
                            type: 'gradeAdded',
                            message: \`"\${e.data.grade.subject}" tárgy (\${e.data.grade.grade}) sikeresen hozzáadva!\`,
                            average: calculateAverage()
                        });
                    } else {
                        self.postMessage({
                            type: 'error',
                            message: 'Ez a tantárgy már hozzá lett adva!'
                        });
                    }
                    break;
                case 'calculate':
                    self.postMessage({
                        type: 'result',
                        ...calculateAverage()
                    });
                    break;
            }
        } catch (error) {
            self.postMessage({
                type: 'error',
                message: 'Hiba történt a számítás során'
            });
        }
    });

    function calculateAverage() {
        if (grades.length === 0) return { average: "0.00", count: 0 };
        
        const sum = grades.reduce((acc, grade) => acc + parseFloat(grade.grade), 0);
        const average = sum / grades.length;
        
        return {
            average: average.toFixed(2),
            count: grades.length
        };
    }
`;

// Create blob URL for worker
const workerBlob = new Blob([workerCode], { type: 'text/javascript' });
const workerUrl = URL.createObjectURL(workerBlob);

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

function deleteNotes() {
    if (confirm('Biztosan törölni szeretnéd az összes jegyzetet?')) {
        localStorage.removeItem('notes');
        displayNotes();
    }
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
    const dropZones = document.querySelectorAll('.drop-zone');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            e.target.classList.add('dragging');
            e.dataTransfer.setData('text/plain', e.target.getAttribute('data-value'));
        });

        draggable.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });

        zone.addEventListener('dragleave', (e) => {
            zone.classList.remove('dragover');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            const subject = e.dataTransfer.getData('text/plain');
            
            // Clear existing content
            if (zone.innerHTML.trim() !== '') {
                if (!confirm('Már van itt egy óra. Szeretnéd felülírni?')) {
                    return;
                }
            }
            
            zone.innerHTML = `
                <div class="scheduled-subject">
                    ${subject}
                    <button class="delete-lesson" onclick="deleteLesson(this)">×</button>
                    <div class="time">${zone.dataset.time}</div>
                </div>
            `;
            
            // Save timetable state to localStorage
            saveTimetableState();
        });
    });

    // Add delete lesson function
    window.deleteLesson = function(button) {
        if (confirm('Biztosan törölni szeretnéd ezt az órát?')) {
            button.closest('.scheduled-subject').remove();
            saveTimetableState();
        }
    };

    // Function to save timetable state
    function saveTimetableState() {
        const timetableState = {};
        dropZones.forEach(zone => {
            const key = `${zone.dataset.day}-${zone.dataset.time}`;
            timetableState[key] = zone.innerHTML;
        });
        localStorage.setItem('timetableState', JSON.stringify(timetableState));
    }

    // Load saved timetable state
    function loadTimetableState() {
        const savedState = localStorage.getItem('timetableState');
        if (savedState) {
            const timetableState = JSON.parse(savedState);
            dropZones.forEach(zone => {
                const key = `${zone.dataset.day}-${zone.dataset.time}`;
                if (timetableState[key]) {
                    zone.innerHTML = timetableState[key];
                }
            });
        }
    }

    // Load saved state when page loads
    loadTimetableState();
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
    // Progress circle animation
    const progressArc = document.getElementById('progressArc');
    const progressText = document.getElementById('progressText');
    const creditsArc = document.getElementById('creditsArc');
    const creditsText = document.getElementById('creditsText');
    const gradeArc = document.getElementById('gradeArc');
    const gradeText = document.getElementById('gradeText');

    // Félév progress animation
    const semesterProgress = (Math.sin(Date.now() / 2000) + 1) * 50;
    const semesterDashOffset = 251.2 * (1 - semesterProgress / 100);
    progressArc.style.strokeDashoffset = semesterDashOffset;
    progressText.textContent = `${Math.round(semesterProgress)}%`;

    // Kredit progress animation
    const creditProgress = 45; // 45/120 credits
    const creditDashOffset = 251.2 * (1 - (creditProgress / 120));
    creditsArc.style.strokeDashoffset = creditDashOffset;

    // Grade animation
    const gradeProgress = 4.2; // 4.2/5.0 GPA
    const gradeDashOffset = 251.2 * (1- (gradeProgress / 5));
    gradeArc.style.strokeDashoffset = gradeDashOffset;

    requestAnimationFrame(animateSvg);
}

// Update worker initialization to use Blob URL
let worker = new Worker(workerUrl);

let gradesList = [];

worker.onmessage = function(e) {
    const container = document.getElementById('workerResult');
    switch (e.data.type) {
        case 'gradeAdded':
            container.innerHTML = `<span style="color: green">✓ ${e.data.message}</span>`;
            container.innerHTML += `<div style="margin-top: 10px;">Jelenlegi átlag: ${e.data.average.average} (${e.data.average.count} tárgy)</div>`;
            break;
        case 'error':
            container.innerHTML = `<span style="color: red">⚠️ ${e.data.message}</span>`;
            break;
        case 'result':
            container.innerHTML = `
                <div style="background: #f0f9ff; padding: 10px; border-radius: 4px; margin-top: 10px;">
                    <strong>Tanulmányi átlag:</strong> ${e.data.average}<br>
                    <strong>Tárgyak száma:</strong> ${e.data.count}
                </div>`;
            break;
    }
};

function addGrade() {
    const subject = document.getElementById('subjectSelect').value;
    const grade = parseInt(document.getElementById('gradeSelect').value);
    
    if (!subject) {
        document.getElementById('workerResult').innerHTML = 
            `<span style="color: red">⚠️ Kérlek válassz tantárgyat!</span>`;
        return;
    }

    worker.postMessage({ 
        type: 'addGrade', 
        grade: { subject, grade } 
    });
    
    // Update UI list
    gradesList.push({ subject, grade });
    updateGradesList();
    
    // Reset subject selection
    document.getElementById('subjectSelect').value = '';
    document.getElementById('gradeSelect').value = '5';
}

function updateGradesList() {
    const container = document.getElementById('gradesList');
    container.innerHTML = gradesList.map((item, index) => `
        <div class="grade-item">
            ${item.subject}: ${item.grade}
            <button onclick="removeGrade(${index})">×</button>
        </div>`).join('');
}

function removeGrade(index) {
    gradesList.splice(index, 1);
    updateGradesList();
}

function startCalculation() {
    if (gradesList.length === 0) {
        document.getElementById('workerResult').innerHTML = 
            `<span style="color: red">⚠️ Nincsenek megadott jegyek!</span>`;
        return;
    }
    worker.postMessage({ type: 'calculate' });
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

