document.addEventListener("DOMContentLoaded", () => {
  // Minta diák adatok
  let students = [
      { nev: "Kovács Péter", azonosito: "D10001", szak: "Mérnökinformatika", atlag: 4.2, kreditAtlag: 4.0, osszKredit: 120 },
      { nev: "Teszt Elek", azonosito: "D10002", szak: "Biokémia", atlag: 4.0, kreditAtlag: 4.0, osszKredit: 300 },
      { nev: "Kovács Wilmos", azonosito: "D10003", szak: "Management", atlag: 4.1, kreditAtlag: 2.0, osszKredit: 175 },
      { nev: "Nagy Anna", azonosito: "D10004", szak: "Matematika", atlag: 4.8, kreditAtlag: 4.5, osszKredit: 150 },
      { nev: "Szabó László", azonosito: "D10005", szak: "Fizika", atlag: 3.9, kreditAtlag: 3.8, osszKredit: 90 },
      { nev: "Tóth Eszter", azonosito: "D10006", szak: "Üzemmérnök", atlag: 4.5, kreditAtlag: 4.3, osszKredit: 180 }
    ];
  
    let chart;
    let selectedStudents = [];
    let sortDirection = Array(6).fill('asc'); // Track sort direction for each column

    // Táblázat renderelése
    function renderTable() {
        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";
        students.forEach((student, index) => {
          let row = document.createElement("tr");
          row.innerHTML = `
            <td onclick="selectStudent(${index})">${student.nev}</td>
            <td onclick="selectStudent(${index})">${student.azonosito}</td>
            <td onclick="selectStudent(${index})">${student.szak}</td>
            <td onclick="selectStudent(${index})">${student.atlag}</td>
            <td onclick="selectStudent(${index})">${student.kreditAtlag}</td>
            <td onclick="selectStudent(${index})">${student.osszKredit}</td>
            <td>
              <button onclick="editStudent(${index})">Szerkesztés</button>
              <button onclick="deleteStudent(${index})">Törlés</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      }
  
      // Add these new functions
      window.handleSubmit = function(event) {
        event.preventDefault();
        
        const student = {
          nev: document.getElementById("nev").value,
          azonosito: document.getElementById("azonosito").value,
          szak: document.getElementById("szak").value,
          atlag: parseFloat(document.getElementById("atlag").value),
          kreditAtlag: parseFloat(document.getElementById("kreditAtlag").value),
          osszKredit: parseInt(document.getElementById("osszKredit").value)
        };
  
        const editId = document.getElementById("editId").value;
        
        if (editId === "") {
          // Create new student
          students.push(student);
        } else {
          // Update existing student
          students[parseInt(editId)] = student;
        }
  
        renderTable();
        resetForm();
      };
  
      window.editStudent = function(index) {
        const student = students[index];
        document.getElementById("editId").value = index;
        document.getElementById("nev").value = student.nev;
        document.getElementById("azonosito").value = student.azonosito;
        document.getElementById("szak").value = student.szak;
        document.getElementById("atlag").value = student.atlag;
        document.getElementById("kreditAtlag").value = student.kreditAtlag;
        document.getElementById("osszKredit").value = student.osszKredit;
        
        document.getElementById("submitBtn").textContent = "Módosítás";
      };
  
      window.resetForm = function() {
        document.getElementById("studentForm").reset();
        document.getElementById("editId").value = "";
        document.getElementById("submitBtn").textContent = "Hozzáadás";
      };
  
    // Törlés funkció
    window.deleteStudent = function(index) {
      if(confirm("Biztos törli a diák adatait?")) {
        students.splice(index, 1);
        renderTable();
      }
    };
  
    window.selectStudent = function(index) {
      const student = students[index];
      if (!selectedStudents.includes(student)) {
        selectedStudents.push(student);
      } else {
        selectedStudents = selectedStudents.filter(s => s !== student);
      }
      updateChart();
    };

    function updateChart() {
      const ctx = document.getElementById('studentChart').getContext('2d');
      
      if (chart) {
        chart.destroy();
      }
  
      const datasets = selectedStudents.map(student => ({
        label: student.nev,
        data: [ student.atlag, student.kreditAtlag, student.osszKredit/100],
        borderColor: getRandomColor(),
        borderWidth: 1,
        fill: false
      }));
  
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Tanulmányi Átlag', 'Kredit Átlag', 'Össz Kredit/100'],
          datasets: datasets
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 5
            }
          }
        }
      });
    }
  
    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
    
    window.sortTable = function(n) {
      const keys = ["nev", "azonosito", "szak", "atlag", "kreditAtlag", "osszKredit"];
        
      // Toggle sort direction
      sortDirection[n] = sortDirection[n] === 'asc' ? 'desc' : 'asc';
        
      // Update sort indicators
      document.querySelectorAll('th').forEach((th, index) => {
        th.textContent = th.textContent.replace(' ▲', '').replace(' ▼', '');
        if (index === n) {
          th.textContent += sortDirection[n] === 'asc' ? ' ▲' : ' ▼';
        }
      });

      students.sort((a, b) => {
        let valA = a[keys[n]];
        let valB = b[keys[n]];
        
        if (typeof valA === "string") {
          return sortDirection[n] === 'asc' 
              ? valA.localeCompare(valB)
              : valB.localeCompare(valA);
        } else {
          return sortDirection[n] === 'asc' 
              ? valA - valB
              : valB - valA;
        }
      });
        
      renderTable();
    };
  
    // Keresés funkció
    window.filterTable = function() {
      const input = document.getElementById("search");
      const filter = input.value.toLowerCase();
      const rows = document.querySelectorAll("#tableBody tr");
      rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        let show = false;
        cells.forEach(cell => {
          if(cell.textContent.toLowerCase().indexOf(filter) > -1) {
            show = true;
          }
        });
        row.style.display = show ? "" : "none";
      });
    };
  
    renderTable();
  });
