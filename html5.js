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

// Drag & Drop továbbfejlesztett verzió
function allowDrop(ev) {
  ev.preventDefault();
}

function dragStart(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  ev.target.style.opacity = "0.4";
}

function dragEnd(ev) {
  ev.target.style.opacity = "1";
}

function dropItem(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const draggedElement = document.getElementById(data);
  
  if (ev.target.id === "dropZone") {
      ev.target.appendChild(draggedElement);
      ev.target.style.background = "#e0e0e0";
      draggedElement.style.margin = "10px auto";
  }
}

function dragEnter(ev) {
  if (ev.target.id === "dropZone") {
      ev.target.style.background = "#c0c0c0";
  }
}

function dragLeave(ev) {
  if (ev.target.id === "dropZone") {
      ev.target.style.background = "white";
  }
}

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