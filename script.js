// OwlFacts Schengen Calculator - 2026 EES Compliant
// Wrapped to avoid browser extension conflicts

(function() {
    'use strict';

    // Real affiliate URLs (already in your code — preserved exactly)
    const affiliateLinks = {
        safetywing: 'https://safetywing.com/?referenceID=26451862&utm_source=26451862&utm_medium=Ambassador',
        wise: 'https://wise.com/invite/drhc/3ced2f',
        airalo: 'https://www.airalo.com'
    };

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

            // Clear inputs after adding
            document.getElementById('entryDate').value = '';
            // Reset exit to today
            const exitDateInput = document.getElementById('exitDate');
            if (exitDateInput) exitDateInput.valueAsDate = new Date();
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

                // Count trips within the 180-day window (past, current, future planned)
                if (tripExit >= lookbackDate) {
                    const countFrom = tripEntry < lookbackDate ? lookbackDate : tripEntry;
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

            if (!statusDisplay || !daysRemainingEl) return;

            const statusIcon = statusDisplay.querySelector('.status-icon');
            const statusTitle = statusDisplay.querySelector('h3');

            daysRemainingEl.textContent = remaining;
            statusDisplay.classList.remove('warning', 'danger');

            // FIX: Use HTML entities instead of emoji literals to avoid encoding issues
            if (remaining <= 0) {
                statusDisplay.classList.add('danger');
                if (statusIcon) statusIcon.innerHTML = '&#x26A0;&#xFE0F;';
                if (statusTitle) statusTitle.textContent = 'DANGER - Over Limit';
            } else if (remaining <= 10) {
                statusDisplay.classList.add('danger');
                if (statusIcon) statusIcon.innerHTML = '&#x26A0;&#xFE0F;';
                if (statusTitle) statusTitle.textContent = 'DANGER - Critical';
            } else if (remaining <= 30) {
                statusDisplay.classList.add('warning');
                if (statusIcon) statusIcon.innerHTML = '&#x26A1;';
                if (statusTitle) statusTitle.textContent = 'WARNING - Low Days';
            } else {
                if (statusIcon) statusIcon.innerHTML = '&#x2705;';
                if (statusTitle) statusTitle.textContent = "SAFE - You're Good";
            }

            // Trigger contextual affiliate message after every update
            this.updateContextualAffiliate(remaining);
        }

        updateContextualAffiliate(daysRemaining) {
            const msgEl = document.getElementById('contextualMessage');
            if (!msgEl) return;

            // Remove all highlights
            document.querySelectorAll('.affiliate-card').forEach(c => c.classList.remove('affiliate-highlight'));

            let msg = '';

            if (daysRemaining <= 0) {
                msg = '&#x26A0;&#xFE0F; <strong>You have no Schengen days left.</strong> You cannot enter the Schengen Area right now. Consider a long-stay visa &mdash; Portugal, Spain, and France offer Digital Nomad visas from &euro;280/mo.';
            } else if (daysRemaining <= 7) {
                msg = '&#x1F6A8; <strong>Only ' + daysRemaining + ' days left &mdash; critical zone.</strong> Make sure you have travel insurance that covers emergency repatriation if you need to leave sooner than planned.';
                const c = document.getElementById('cardSafetywing');
                if (c) c.classList.add('affiliate-highlight');
            } else if (daysRemaining <= 30) {
                msg = '&#x23F0; <strong>' + daysRemaining + ' days remaining.</strong> Your Schengen window is closing soon. Set up a Wise account now to handle money fee-free during your break period outside Schengen.';
                const c = document.getElementById('cardWise');
                if (c) c.classList.add('affiliate-highlight');
            } else if (daysRemaining <= 60) {
                msg = '&#x1F4F1; <strong>' + daysRemaining + ' days remaining &mdash; you\'re in good shape.</strong> Crossing multiple countries? An Airalo eSIM keeps you connected across all 29 Schengen states without roaming charges.';
                const c = document.getElementById('cardAiralo');
                if (c) c.classList.add('affiliate-highlight');
            } else {
                msg = '&#x2705; <strong>' + daysRemaining + ' days remaining &mdash; you\'re safe.</strong> Protect your trip with travel insurance and fee-free transfers while you explore Europe.';
            }

            msgEl.innerHTML = msg;
            msgEl.style.display = 'block';
        }

        addTripToTimeline(trip) {
            const timeline = document.getElementById('tripTimeline');
            if (!timeline) return;
            
            const tripEl = document.createElement('div');
            tripEl.className = 'trip-item';
            tripEl.dataset.id = trip.id;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'trip-remove';
            removeBtn.textContent = '\u00d7'; // × character — no encoding issue
            removeBtn.onclick = () => this.removeTrip(trip.id);
            
            tripEl.innerHTML = `
                <div class="trip-info">
                    <div class="trip-dates">
                        ${this.formatDate(trip.entry)} &rarr; ${this.formatDate(trip.exit)}
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
                // Hide contextual message when history cleared
                const msgEl = document.getElementById('contextualMessage');
                if (msgEl) msgEl.style.display = 'none';
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
                    // Render saved trips to timeline on page load
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
            if (!emailInput || !emailInput.value) return;

            const email = emailInput.value;
            const remaining = this.calculateRemainingDays();

            // TODO: Replace this with your actual email service (Mailchimp, ConvertKit, etc.)
            // Example fetch to your backend:
            // fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email, remaining }) })

            console.log('Email signup:', email, '| Days remaining:', remaining);

            // Show confirmation — replace alert with inline message for better UX
            const btn = e.target.querySelector('button[type="submit"]');
            if (btn) {
                btn.textContent = '&#x2713; You\'re protected!';
                btn.disabled = true;
            }
            emailInput.value = '';
            emailInput.placeholder = 'Subscribed! Check your inbox.';
        }
    }

    // Affiliate link tracking — uses real URLs from affiliateLinks object
    function initAffiliateLinks() {
        document.querySelectorAll('[data-affiliate]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const affiliate = e.currentTarget.dataset.affiliate;
                if (affiliateLinks[affiliate]) {
                    // Optional: log click for analytics
                    console.log('Affiliate click:', affiliate);
                    window.open(affiliateLinks[affiliate], '_blank', 'noopener');
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
