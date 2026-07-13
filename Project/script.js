const trains = [
    { id: 12951, name: "Mumbai Rajdhani Exp", src: "Delhi", dest: "Mumbai", departure: "16:55", arrival: "08:35", duration: "15h 40m", classes: { '1A': 10, '2A': 35, '3A': 150, CC: 0 } },
    { id: 12433, name: "Chennai Rajdhani Exp", src: "Delhi", dest: "Chennai", departure: "15:35", arrival: "20:40", duration: "29h 05m", classes: { '1A': 8, '2A': 40, '3A': 180, SL: 0 } },
    { id: 12802, name: "Purushottam Exp", src: "Delhi", dest: "Bhubaneswar", departure: "22:15", arrival: "05:25", duration: "31h 10m", classes: { '2A': 20, '3A': 100, SL: 300 } },
    { id: 12138, name: "Punjab Mail SF", src: "Mumbai", dest: "Delhi", departure: "20:00", arrival: "07:35", duration: "35h 35m", classes: { '2A': 45, '3A': 160, SL: 350 } },
    { id: 12859, name: "Gitanjali SF Exp", src: "Mumbai", dest: "Kolkata", departure: "06:00", arrival: "12:30", duration: "30h 30m", classes: { '1A': 0, '2A': 60, '3A': 190, SL: 400 } },
    { id: 12267, name: "Duronto Express", src: "Mumbai", dest: "Ahmedabad", departure: "23:25", arrival: "05:55", duration: "6h 30m", classes: { '1A': 12, '2A': 50, '3A': 200, CC: 80 } },
    { id: 11096, name: "Ahimsa Express", src: "Pune", dest: "Ahmedabad", departure: "19:50", arrival: "11:35", duration: "15h 45m", classes: { '2A': 30, '3A': 110, SL: 250 } },
    { id: 12840, name: "Coromandel Express", src: "Chennai", dest: "Kolkata", departure: "14:40", arrival: "17:00", duration: "26h 20m", classes: { '2A': 30, '3A': 120, SL: 350 } },
    { id: 12657, name: "Bangalore Mail", src: "Chennai", dest: "Bengaluru", departure: "22:40", arrival: "04:30", duration: "5h 50m", classes: { '1A': 10, '2A': 50, '3A': 180, SL: 0 } },
    { id: 12301, name: "Howrah Rajdhani", src: "Kolkata", dest: "Delhi", departure: "16:50", arrival: "10:00", duration: "17h 10m", classes: { '1A': 15, '2A': 40, '3A': 160, CC: 0 } },
    { id: 12222, name: "Pune Duronto Exp", src: "Kolkata", dest: "Pune", departure: "10:30", arrival: "14:15", duration: "27h 45m", classes: { '1A': 5, '2A': 25, '3A': 90, SL: 0 } },
    { id: 12781, name: "Swarna Jayanti Exp", src: "Bengaluru", dest: "Delhi", departure: "22:40", arrival: "21:30", duration: "46h 50m", classes: { '2A': 35, '3A': 140, SL: 380 } },
    { id: 16534, name: "YPR Garib Nawaz", src: "Bengaluru", dest: "Ahmedabad", departure: "15:45", arrival: "03:50", duration: "36h 05m", classes: { '2A': 50, '3A': 200, SL: 500 } },
    { id: 12903, name: "Golden Temple Mail", src: "Ahmedabad", dest: "Mumbai", departure: "18:30", arrival: "02:35", duration: "8h 05m", classes: { '1A': 10, '2A': 30, '3A': 100, SL: 200 } },
    { id: 12127, name: "Pune-Mumbai Intercity", src: "Pune", dest: "Mumbai", departure: "06:45", arrival: "09:57", duration: "3h 12m", classes: { CC: 150, '2A': 30, '3A': 0, SL: 0 } },
    { id: 12128, name: "Mumbai-Pune Intercity", src: "Mumbai", dest: "Pune", departure: "18:40", arrival: "22:00", duration: "3h 20m", classes: { CC: 180, '2A': 40, '3A': 0, SL: 0 } },
];

const sourceSelect = document.getElementById('source');
const destinationSelect = document.getElementById('destination');
const searchForm = document.getElementById('search-form');
const resultsContainer = document.getElementById('results-container');
const resultsMessage = document.getElementById('results-message');

function populateCities() {
    const allCities = new Set();

    trains.forEach(train => {
        allCities.add(train.src);
        allCities.add(train.dest);
    });

    const cityArray = Array.from(allCities).sort();

    cityArray.forEach(city => {
        const sourceOption = document.createElement('option');
        sourceOption.value = city;
        sourceOption.textContent = city;
        sourceSelect.appendChild(sourceOption);

        const destOption = document.createElement('option');
        destOption.value = city;
        destOption.textContent = city;
        destinationSelect.appendChild(destOption);
    });

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);
}

function handleSearch(event) {
    event.preventDefault();

    const source = sourceSelect.value;
    const destination = destinationSelect.value;
    const travelDate = document.getElementById('date').value;

    if (source === '' || destination === '' || travelDate === '') {
        alert("Please select a Source, Destination, and Travel Date.");
        return;
    }

    if (source === destination) {
        alert("Source and Destination cannot be the same.");
        return;
    }

    const matchingTrains = trains.filter(train => {
        return train.src === source && train.dest === destination;
    });

    displayResults(matchingTrains, travelDate);
}

function displayResults(results, date) {
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsMessage.innerHTML = `<p>No direct trains found for this route on ${date}. Try another city pair or check for connecting trains!</p>`;
        return;
    }

    resultsMessage.innerHTML = `<p>Showing ${results.length} train(s) available on <strong>${date}</strong>.</p>`;

    results.forEach(train => {
        const card = document.createElement('div');
        card.className = 'train-card';

        const availabilityHTML = Object.entries(train.classes).map(([className, seats]) => {
            const durationHours =
                parseInt(train.duration.split('h')[0]) +
                (parseInt(train.duration.split('h ')[1].replace('m', '')) / 60);

            let basePrice = Math.round(durationHours * 50);
            let priceMultiplier = 1;

            if (className === 'CC') priceMultiplier = 2.5;
            else if (className === '3A') priceMultiplier = 3.5;
            else if (className === '2A') priceMultiplier = 5;
            else if (className === '1A') priceMultiplier = 8;

            const finalPrice =
                Math.ceil((basePrice * priceMultiplier) / 10) * 10;

            const status = seats > 0 ? `${seats} Available` : 'Waitlist';

            return `
                <div class="coach-type ${className}">
                    ${className}<br>
                    ${status} (₹${finalPrice})
                </div>
            `;
        }).join('');

        card.innerHTML = `
            <h3>${train.name} (${train.id})</h3>
            <div class="train-info">
                <span>Departure: <strong>${train.departure}</strong> (${train.src})</span>
                <span>Arrival: <strong>${train.arrival}</strong> (${train.dest})</span>
            </div>
            <div class="train-info">
                <span>Duration: <strong>${train.duration}</strong></span>
                <span>Type: <strong>${
                    train.name.includes('Rajdhani')
                        ? 'Rajdhani'
                        : train.name.includes('Duronto')
                        ? 'Duronto'
                        : 'Superfast'
                }</strong></span>
            </div>

            <h4>Availability & Price</h4>

            <div class="availability-box">
                ${availabilityHTML}
            </div>

            <button class="book-btn"
                onclick="handleBooking('${train.name}','${train.id}','${train.src}','${train.dest}','${date}')">
                Book Now
            </button>
        `;

        resultsContainer.appendChild(card);
    });
}

window.handleBooking = function (
    name,
    id,
    src,
    dest,
    date
) {
    const ticketId = `T${Math.floor(Math.random() * 900000) + 100000}`;

    const bookingMessage = `
--- BOOKING CONFIRMED ---

Ticket ID: ${ticketId}
Train Name: ${name}
Train No.: ${id}
Route: ${src} to ${dest}
Travel Date: ${date}

Status: CONFIRMED
Coach: B2 / Seat: 56 (Simulated)

Thank you for booking with the IR Simulator!
`;

    alert(bookingMessage);

    console.log("Booking data saved:", {
        name,
        id,
        src,
        dest,
        date,
        ticketId
    });
};

document.addEventListener('DOMContentLoaded', () => {
    populateCities();
    searchForm.addEventListener('submit', handleSearch);
});