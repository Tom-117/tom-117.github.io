document.addEventListener("DOMContentLoaded", () => {
    // Minta diák adatok
    let students = [
      { nev: "Kovács Péter", azonosito: "D1001", szak: "Informatika", atlag: 4.2 },
      { nev: "Nagy Anna", azonosito: "D1002", szak: "Matematika", atlag: 4.8 },
      { nev: "Szabó László", azonosito: "D1003", szak: "Fizika", atlag: 3.9 },
      { nev: "Tóth Eszter", azonosito: "D1004", szak: "Kémia", atlag: 4.5 }
    ];
  
    // Táblázat renderelése
    function renderTable() {
        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";
        students.forEach((student, index) => {
          let row = document.createElement("tr");
          row.innerHTML = `
            <td>${student.nev}</td>
            <td>${student.azonosito}</td>
            <td>${student.szak}</td>
            <td>${student.atlag}</td>
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
          atlag: parseFloat(document.getElementById("atlag").value)
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
  
    
    window.sortTable = function(n) {
      students.sort((a, b) => {
        const keys = ["nev", "azonosito", "szak", "atlag"];
        let valA = a[keys[n]];
        let valB = b[keys[n]];
        if (typeof valA === "string") {
          return valA.localeCompare(valB);
        } else {
          return valA - valB;
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
  