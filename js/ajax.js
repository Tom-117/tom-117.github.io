const BASE_URL = 'http://webprogramozas.inf.elte.hu/hallgatok/bozso/TR-IT_program/API';
const USER_CODE = 'L2J7OUefg456';

async function makeApiRequest(operation, params = {}) {
    const formData = new FormData();
    formData.append('op', operation);
    formData.append('code', USER_CODE);
    
    for (const [key, value] of Object.entries(params)) {
        formData.append(key, value);
    }

    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return data;
    } catch (error) {
        showMessage('API hiba történt!', 'error');
        throw error;
    }
}

function validateInput(value, fieldName) {
    if (!value) {
        showMessage(`${fieldName} nem lehet üres!`, 'error');
        return false;
    }
    if (value.toString().length > 30) {
        showMessage(`${fieldName} nem lehet hosszabb 30 karakternél!`, 'error');
        return false;
    }
    return true;
}

function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    setTimeout(() => messageDiv.textContent = '', 3000);
}

async function readData() {
    try {
        const data = await makeApiRequest('read');
        if (data.list && data.list.length > 0) {
            displayData(data);
        } else {
            showMessage('Nem található adat!', 'info');
        }
    } catch (error) {
        showMessage('Hiba történt az adatok lekérése közben!', 'error');
    }
}

function displayData(data) {
    const resultDiv = document.getElementById('readResult');
    const statsDiv = document.getElementById('statistics');
    
    if (data.list && data.list.length > 0) {
        resultDiv.innerHTML = `
            <p>Összesen ${data.rowCount} rekord (maximum: ${data.maxNum})</p>
            <div class="records">
                ${data.list.map(item => 
                    `<div class="record">
                        ID: ${item.id} | 
                        Név: ${item.name} | 
                        Magasság: ${item.height} | 
                        Súly: ${item.weight}
                    </div>`
                ).join('')}
            </div>`;

        const heights = data.list.map(item => parseFloat(item.height) || 0);
        const sum = heights.reduce((a, b) => a + b, 0);
        const avg = heights.length ? sum / heights.length : 0;
        const max = Math.max(...heights);

        statsDiv.innerHTML = `
            <h4>Magasság statisztika:</h4>
            <p>Összeg: ${sum.toFixed(2)}</p>
            <p>Átlag: ${avg.toFixed(2)}</p>
            <p>Legnagyobb: ${max.toFixed(2)}</p>
        `;
    } else {
        resultDiv.innerHTML = '<div>Nincs megjeleníthető adat</div>';
        statsDiv.innerHTML = '';
    }
}

async function createData() {
    const name = document.getElementById('createName').value;
    const height = document.getElementById('createHeight').value;
    const weight = document.getElementById('createWeight').value;

    if (!validateInput(name, 'Név') || 
        !validateInput(height, 'Magasság') || 
        !validateInput(weight, 'Súly')) return;

    try {
        const result = await makeApiRequest('create', {
            name, height, weight
        });
        
        if (result === 1) {
            showMessage('Adat sikeresen létrehozva!', 'success');
            clearInputs(['createName', 'createHeight', 'createWeight']);
            readData();
        } else {
            showMessage('Nem sikerült létrehozni az adatot!', 'error');
        }
    } catch (error) {
        showMessage('Hiba történt a létrehozás során!', 'error');
    }
}

function clearInputs(inputIds) {
    inputIds.forEach(id => {
        document.getElementById(id).value = '';
    });
}

async function getDataForId() {
    const id = document.getElementById('updateId').value;
    if (!id) return showMessage('Adjon meg egy azonosítót!', 'error');

    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        document.getElementById('updateName').value = data.name;
        document.getElementById('updateHeight').value = data.height;
    } catch (error) {
        showMessage('Hiba történt az adatok lekérése során!', 'error');
    }
}

async function updateData() {
    const id = document.getElementById('updateId').value;
    const name = document.getElementById('updateName').value;
    const height = document.getElementById('updateHeight').value;
    const weight = document.getElementById('updateWeight').value;

    if (!validateInput(name, 'Név') || 
        !validateInput(height, 'Magasság') || 
        !validateInput(weight, 'Súly')) return;

    try {
        const result = await makeApiRequest('update', {
            id, name, height, weight
        });
        
        if (result === 1) {
            showMessage('Adat sikeresen módosítva!', 'success');
            readData();
        } else {
            showMessage('Nem sikerült módosítani az adatot!', 'error');
        }
    } catch (error) {
        showMessage('Hiba történt a módosítás során!', 'error');
    }
}

async function deleteData() {
    const id = document.getElementById('deleteId').value;
    if (!id) return showMessage('Adjon meg egy azonosítót!', 'error');

    try {
        const result = await makeApiRequest('delete', { id });
        if (result === 1) {
            showMessage('Adat sikeresen törölve!', 'success');
            readData();
        } else {
            showMessage('Nem sikerült törölni az adatot!', 'error');
        }
    } catch (error) {
        showMessage('Hiba történt a törlés során!', 'error');
    }
}
