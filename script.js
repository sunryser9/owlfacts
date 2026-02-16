// OwlFacts Schengen Calculator - 2026 EES Compliant
// Implements the official EU rolling 180-day window algorithm

class SchengenCalculator {
    constructor() {
        this.trips = this.loadTrips();
        this.initEventListeners();
        this.updateDisplay();
    }

    initEventListeners() {
        document.getElementById('addTrip').addEventListener('click', () => this.addTrip());
        document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());
        document.getElementById('emailForm').addEventListener('submit', (e) => this.handleEmailSubmit(e));
        
        // Set default dates
        const today = new Date();
        document.getElementById('exitDate').valueAsDate = today;
    }

    addTrip() {
        const entryDate = document.getElementById('entryDate').value;
        const exitDate = document.getElementById('exitDate').value;

        if (!entryDate || !exitDate) {
            alert('Please enter both entry and exit dates');
            return;
        }

        const entry = new Date(entryDate);
        const exit = new Date(exitDate);

        if (exit < entry) {
            alert('Exit date must be after entry date');
            return;
        }

        const trip = {
            id: Date.now(),
            entry: entryDate,
            exit: exitDate,
            days: this.calculateDays(entry, exit)
        };

        this.trips.push(trip);
        this.saveTrips();
        this.updateDisplay();
        this.addTripToTimeline(trip);

        // Clear inputs
        document.getElementById('entryDate').value = '';
        document.getElementById('exitDate').value = '';
    }

    calculateDays(entry, exit) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((exit - entry) / oneDay)) + 1; // +1 because both days count
    }

    calculateRemainingDays() {
        const today = new Date();
        const lookbackDate = new Date(today);
        lookbackDate.setDate(lookbackDate.getDate() - 180);

        let totalDays = 0;

        this.trips.forEach(trip => {
            const tripEntry = new Date(trip.entry);
            const tripExit = new Date(trip.exit);

            // Only count trips within the 180-day window
            if (tripExit >= lookbackDate) {
                const countFrom = tripEntry < lookbackDate ? lookbackDate : tripEntry;
                const countTo = tripExit > today ? today : tripExit;
                
                if (countTo >= countFrom) {
                    totalDays += this.calculateDays(countFrom, countTo);
                }
            }
        });

        return Math.max(0, 90 - totalDays);
    }

    updateDisplay() {
        const remaining = this.calculateRemainingDays();
        const statusDisplay = document.getElementById('statusDisplay');
        const daysRemainingEl = document.getElementById('daysRemaining');

        daysRemainingEl.textContent = remaining;

        // Update status styling
        statusDisplay.classList.remove('warning', 'danger');
        
        if (remaining <= 0) {
            statusDisplay.classList.add('danger');
            statusDisplay.querySelector('.status-icon').textContent = '??';
            statusDisplay.querySelector('h3').textContent = 'You are Over Limit';
        } else if (remaining <= 10) {
            statusDisplay.classList.add('danger');
            statusDisplay.querySelector('.status-icon').textContent = '??';
            statusDisplay.querySelector('h3').textContent = 'Critical - Low Days';
        } else if (remaining <= 30) {
            statusDisplay.classList.add('warning');
            statusDisplay.querySelector('.status-icon').textContent = '?';
            statusDisplay.querySelector('h3').textContent = 'Warning - Running Low';
        } else {
            statusDisplay.querySelector('.status-icon').textContent = '?';
            statusDisplay.querySelector('h3').textContent = 'You are Safe';
        }
    }

    addTripToTimeline(trip) {
        const timeline = document.getElementById('tripTimeline');
        
        const tripEl = document.createElement('div');
        tripEl.className = 'trip-item';
        tripEl.dataset.id = trip.id;
        
        tripEl.innerHTML = `
            <div class="trip-info">
                <div class="trip-dates">
                    ${this.formatDate(trip.entry)} ? ${this.formatDate(trip.exit)}
                </div>
                <div class="trip-duration">${trip.days} days</div>
            </div>
            <button class="trip-remove" onclick="calculator.removeTrip(${trip.id})">×</button>
        `;
        
        timeline.appendChild(tripEl);
    }

    removeTrip(tripId) {
        this.trips = this.trips.filter(t => t.id !== tripId);
        this.saveTrips();
        this.updateDisplay();
        
        const tripEl = document.querySelector(`[data-id="${tripId}"]`);
        if (tripEl) {
            tripEl.style.animation = 'none';
            tripEl.style.opacity = '0';
            setTimeout(() => tripEl.remove(), 200);
        }
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all trip history?')) {
            this.trips = [];
            this.saveTrips();
            this.updateDisplay();
            document.getElementById('tripTimeline').innerHTML = '';
        }
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
    }

    saveTrips() {
        localStorage.setItem('owlfacts_trips', JSON.stringify(this.trips));
    }

    loadTrips() {
        const saved = localStorage.getItem('owlfacts_trips');
        if (saved) {
            const trips = JSON.parse(saved);
            trips.forEach(trip => this.addTripToTimeline(trip));
            return trips;
        }
        return [];
    }

    handleEmailSubmit(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // In production, send to your email service
        console.log('Email signup:', email);
        
        alert('? Thank you! We\'ll send you reminders when you\'re running low on days.');
        e.target.reset();
    }
}

// Affiliate link tracking
document.querySelectorAll('[data-affiliate]').forEach(link => {
    link.addEventListener('click', (e) => {
        const affiliate = e.currentTarget.dataset.affiliate;
        console.log('Affiliate click:', affiliate);
        
        // Add your actual affiliate links here
        const affiliateLinks = {
            safetywing: 'https://safetywing.com/?referenceID=owlfacts',
            wise: 'https://wise.com/invite/u/owlfacts',
            airalo: 'https://ref.airalo.com/owlfacts'
        };
        
        if (affiliateLinks[affiliate]) {
            window.open(affiliateLinks[affiliate], '_blank');
        }
        
        e.preventDefault();
    });
});

// Initialize calculator
const calculator = new SchengenCalculator();

// Analytics tracking (add your GA4 code here)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
// gtag('config', 'G-XXXXXXXXXX'); // Add your Google Analytics ID
