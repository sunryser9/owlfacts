// OwlFacts Schengen Calculator - 2026 EES Compliant
// Wrapped to avoid browser extension conflicts

(function() {
    'use strict';

    class SchengenCalculator {
        constructor() {
            this.trips = this.loadTrips();
            this.initEventListeners();
            this.updateDisplay();
        }

        initEventListeners() {
            const addBtn = document.getElementById('addTrip');
            const clearBtn = document.getElementById('clearHistory');
            const emailForm = document.getElementById('emailForm');
            
            if (addBtn) addBtn.addEventListener('click', () => this.addTrip());
            if (clearBtn) clearBtn.addEventListener('click', () => this.clearHistory());
            if (emailForm) emailForm.addEventListener('submit', (e) => this.handleEmailSubmit(e));
            
            // Set default exit date to today
            const exitDateInput = document.getElementById('exitDate');
            if (exitDateInput) {
                const today = new Date();
                exitDateInput.valueAsDate = today;
            }
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
            return Math.round(Math.abs((exit - entry) / oneDay)) + 1;
        }

        calculateRemainingDays() {
    const today = new Date();
    const lookbackDate = new Date(today);
    lookbackDate.setDate(lookbackDate.getDate() - 180);

    let totalDays = 0;

    this.trips.forEach(trip => {
        const tripEntry = new Date(trip.entry);
        const tripExit = new Date(trip.exit);

        // Count ALL trips (past, current AND future) within 180-day window
        if (tripExit >= lookbackDate) {
            const countFrom = tripEntry < lookbackDate ? lookbackDate : tripEntry;
            // KEY FIX: Remove the "today" cap so future trips count too
            const countTo = tripExit;
            
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

            if (!statusDisplay || !daysRemainingEl) {
                console.error('Status elements not found');
                return;
            }

            const statusIcon = statusDisplay.querySelector('.status-icon');
            const statusTitle = statusDisplay.querySelector('h3');

            // Update the days number
            daysRemainingEl.textContent = remaining;

            // Remove all status classes
            statusDisplay.classList.remove('warning', 'danger');
            
            // Update based on remaining days
            if (remaining <= 0) {
                statusDisplay.classList.add('danger');
                if (statusIcon) statusIcon.textContent = '⚠️';
                if (statusTitle) statusTitle.textContent = 'DANGER - Over Limit';
            } else if (remaining <= 10) {
                statusDisplay.classList.add('danger');
                if (statusIcon) statusIcon.textContent = '⚠️';
                if (statusTitle) statusTitle.textContent = 'DANGER - Critical';
            } else if (remaining <= 30) {
                statusDisplay.classList.add('warning');
                if (statusIcon) statusIcon.textContent = '⚡';
                if (statusTitle) statusTitle.textContent = 'WARNING - Low Days';
            } else {
                if (statusIcon) statusIcon.textContent = '✅';
                if (statusTitle) statusTitle.textContent = 'SAFE - You\'re Good';
            }
        }

        addTripToTimeline(trip) {
            const timeline = document.getElementById('tripTimeline');
            if (!timeline) return;
            
            const tripEl = document.createElement('div');
            tripEl.className = 'trip-item';
            tripEl.dataset.id = trip.id;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'trip-remove';
            removeBtn.textContent = '×';
            removeBtn.onclick = () => this.removeTrip(trip.id);
            
            tripEl.innerHTML = `
                <div class="trip-info">
                    <div class="trip-dates">
                        ${this.formatDate(trip.entry)} → ${this.formatDate(trip.exit)}
                    </div>
                    <div class="trip-duration">${trip.days} days</div>
                </div>
            `;
            
            tripEl.appendChild(removeBtn);
            timeline.appendChild(tripEl);
        }

        removeTrip(tripId) {
            this.trips = this.trips.filter(t => t.id !== tripId);
            this.saveTrips();
            this.updateDisplay();
            
            const tripEl = document.querySelector(`[data-id="${tripId}"]`);
            if (tripEl) {
                tripEl.style.opacity = '0';
                setTimeout(() => tripEl.remove(), 200);
            }
        }

        clearHistory() {
            if (confirm('Are you sure you want to clear all trip history?')) {
                this.trips = [];
                this.saveTrips();
                this.updateDisplay();
                const timeline = document.getElementById('tripTimeline');
                if (timeline) timeline.innerHTML = '';
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
            try {
                localStorage.setItem('owlfacts_trips', JSON.stringify(this.trips));
            } catch (e) {
                console.error('Could not save trips:', e);
            }
        }

        loadTrips() {
            try {
                const saved = localStorage.getItem('owlfacts_trips');
                if (saved) {
                    const trips = JSON.parse(saved);
                    trips.forEach(trip => this.addTripToTimeline(trip));
                    return trips;
                }
            } catch (e) {
                console.error('Could not load trips:', e);
            }
            return [];
        }

        handleEmailSubmit(e) {
            e.preventDefault();
            const emailInput = e.target.querySelector('input[type="email"]');
            if (emailInput) {
                const email = emailInput.value;
                console.log('Email signup:', email);
                alert('✓ Thank you! We\'ll send you reminders when you\'re running low on days.');
                e.target.reset();
            }
        }
    }

    // Affiliate link tracking
    function initAffiliateLinks() {
        const affiliateLinks = {
    safetywing: 'https://safetywing.com/?referenceID=26451862&utm_source=26451862&utm_medium=Ambassador',
    wise: 'https://wise.com/invite/drhc/3ced2f',
    airalo: 'https://www.airalo.com'
};
        
        document.querySelectorAll('[data-affiliate]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const affiliate = e.currentTarget.dataset.affiliate;
                if (affiliateLinks[affiliate]) {
                    window.open(affiliateLinks[affiliate], '_blank');
                }
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.calculator = new SchengenCalculator();
            initAffiliateLinks();
        });
    } else {
        window.calculator = new SchengenCalculator();
        initAffiliateLinks();
    }

})();
