class Booking {
    constructor(studentName, neptunCode, date, time, appointmentType) {
        this.studentName = studentName;
        this.neptunCode = neptunCode;
        this.date = date;
        this.time = time;
        this.appointmentType = appointmentType;
        this.id = Date.now().toString();
    }

    toString() {
        return `${this.studentName} (${this.neptunCode}) - ${this.appointmentType} - ${this.date} ${this.time}`;
    }
}

class BookingManager {
    constructor() {
        this.bookings = [];
        this.loadBookings();
    }

    addBooking(booking) {
        if (this.isTimeSlotAvailable(booking.date, booking.time)) {
            this.bookings.push(booking);
            this.saveBookings();
            return true;
        }
        return false;
    }

    removeBooking(id) {
        this.bookings = this.bookings.filter(booking => booking.id !== id);
        this.saveBookings();
    }

    isTimeSlotAvailable(date, time) {
        return !this.bookings.some(booking => 
            booking.date === date && booking.time === time
        );
    }

    getBookings() {
        return this.bookings;
    }

    saveBookings() {
        localStorage.setItem('okiBookings', JSON.stringify(this.bookings));
    }

    loadBookings() {
        const saved = localStorage.getItem('okiBookings');
        this.bookings = saved ? JSON.parse(saved) : [];
    }
}

// Initialize the booking system
const bookingManager = new BookingManager();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Set date input constraints
    const dateInput = document.getElementById('bookingDate');
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 7);

    dateInput.min = today.toISOString().split('T')[0];
    dateInput.max = maxDate.toISOString().split('T')[0];

    const form = document.querySelector('.form-container');
    const bookingsList = document.getElementById('bookingsList');

    function displayBookings() {
        bookingsList.innerHTML = '';
        bookingManager.getBookings().forEach(booking => {
            const div = document.createElement('div');
            div.className = 'booking-item';
            div.innerHTML = `
                <p>${booking.toString()}</p>
                <button class="delete-btn" data-id="${booking.id}">Törlés</button>
            `;
            bookingsList.appendChild(div);
        });

        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                bookingManager.removeBooking(id);
                displayBookings();
            });
        });
    }

    document.getElementById('submitBooking').addEventListener('click', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('studentName').value;
        const neptun = document.getElementById('neptunCode').value;
        const date = document.getElementById('bookingDate').value;
        const time = document.getElementById('bookingTime').value;
        const appointmentType = document.getElementById('appointmentType').value;

        if (!name || !neptun || !date || !time || !appointmentType) {
            alert('Kérjük töltse ki az összes mezőt!');
            return;
        }

        const booking = new Booking(name, neptun, date, time, appointmentType);
        
        if (bookingManager.addBooking(booking)) {
            alert('Foglalás sikeres!');
            // Clear form fields
            document.getElementById('studentName').value = '';
            document.getElementById('neptunCode').value = '';
            document.getElementById('bookingDate').value = '';
            document.getElementById('appointmentType').value = '';
            displayBookings();
        } else {
            alert('A választott időpont már foglalt!');
        }
    });

    displayBookings();
});
