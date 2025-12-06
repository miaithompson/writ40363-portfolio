// ===================================
// Barcelona Study Abroad Planner
// Main JavaScript Application
// ===================================

// State Management
const state = {
    currentDate: new Date(2026, 0, 1), // Start at January 2026
    selectedDate: null,
    trips: [], // Each trip will have an itinerary array
    generalIdeas: {
        'must-see': [],
        'food': [],
        'activities': []
    },
    minMonth: new Date(2026, 0, 1), // January 2026
    maxMonth: new Date(2026, 3, 1)  // April 2026
};

// Temporary costs storage for the modal
let tempCosts = [];

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    initializeCalendar();
    initializeEventListeners();
    renderTrips();
    renderGeneralIdeas();
    
    // Add some default ideas if first time user
    if (state.generalIdeas['must-see'].length === 0) {
        addDefaultIdeas();
    }
});

// ===================================
// Calendar Functions
// ===================================

function initializeCalendar() {
    renderCalendar();
    updateNavigationButtons();
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const monthDisplay = document.getElementById('currentMonth');
    
    // Clear calendar
    calendar.innerHTML = '';
    
    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const year = state.currentDate.getFullYear();
    const month = state.currentDate.getMonth();
    monthDisplay.textContent = `${monthNames[month]} ${year}`;
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendar.appendChild(header);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Add previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day inactive';
        day.textContent = daysInPrevMonth - i;
        calendar.appendChild(day);
    }
    
    // Add current month's days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        
        const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        // Check if today
        if (year === today.getFullYear() && 
            month === today.getMonth() && 
            i === today.getDate()) {
            day.classList.add('today');
        }
        
        // Check if has trip or event
        const dateStatus = getDateStatus(currentDateStr);
        if (dateStatus.hasTrip) {
            day.classList.add('has-trip');
        }
        if (dateStatus.hasEvent) {
            day.classList.add('has-event');
        }
        
        // Add event titles if this is the start date of any events
        const eventsStartingToday = state.trips.filter(trip => trip.startDate === currentDateStr);
        if (eventsStartingToday.length > 0) {
            const titleDiv = document.createElement('div');
            titleDiv.className = 'calendar-event-title';
            titleDiv.textContent = eventsStartingToday[0].destination;
            if (eventsStartingToday.length > 1) {
                titleDiv.textContent += ` +${eventsStartingToday.length - 1}`;
            }
            day.appendChild(titleDiv);
        }
        
        // Add click event
        day.addEventListener('click', () => {
            state.selectedDate = currentDateStr;
            // Check if date has any events
            const eventsOnDate = getEventsOnDate(currentDateStr);
            if (eventsOnDate.length > 0) {
                showEventsModal(currentDateStr, eventsOnDate);
            } else {
                openTripModal(currentDateStr);
            }
        });
        
        calendar.appendChild(day);
    }
    
    // Add next month's days to fill grid
    const totalCells = calendar.children.length - 7; // Subtract headers
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day inactive';
        day.textContent = i;
        calendar.appendChild(day);
    }
}

function getDateStatus(dateStr) {
    let hasTrip = false;
    let hasEvent = false;
    
    state.trips.forEach(trip => {
        const startDate = trip.startDate;
        const endDate = trip.endDate;
        if (dateStr >= startDate && dateStr <= endDate) {
            if (trip.isWeekendTrip) {
                hasTrip = true;
            } else {
                hasEvent = true;
            }
        }
    });
    
    return { hasTrip, hasEvent };
}

function dateHasTrip(dateStr) {
    return state.trips.some(trip => {
        const startDate = trip.startDate;
        const endDate = trip.endDate;
        return dateStr >= startDate && dateStr <= endDate;
    });
}

function changeMonth(direction) {
    const currentMonth = state.currentDate.getMonth();
    const currentYear = state.currentDate.getFullYear();
    
    let newDate;
    if (direction === 'prev') {
        newDate = new Date(currentYear, currentMonth - 1, 1);
    } else {
        newDate = new Date(currentYear, currentMonth + 1, 1);
    }
    
    // Only change if within valid range
    if (newDate >= state.minMonth && newDate <= state.maxMonth) {
        state.currentDate = newDate;
        renderCalendar();
        updateNavigationButtons();
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    // Disable prev button if at minimum month
    if (state.currentDate <= state.minMonth) {
        prevBtn.disabled = true;
        prevBtn.style.opacity = '0.3';
        prevBtn.style.cursor = 'not-allowed';
    } else {
        prevBtn.disabled = false;
        prevBtn.style.opacity = '1';
        prevBtn.style.cursor = 'pointer';
    }
    
    // Disable next button if at maximum month
    if (state.currentDate >= state.maxMonth) {
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.3';
        nextBtn.style.cursor = 'not-allowed';
    } else {
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
}

// ===================================
// Trip Management Functions
// ===================================

function openTripModal(dateStr = null) {
    const modal = document.getElementById('tripModal');
    const form = document.getElementById('tripForm');
    
    // Reset temporary costs
    tempCosts = [];
    renderModalCosts();
    
    // Pre-fill dates if a date was clicked
    if (dateStr) {
        document.getElementById('tripStartDate').value = dateStr;
        // Default end date to same day
        document.getElementById('tripEndDate').value = dateStr;
    }
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('tripDestination').focus();
}

function closeTripModal() {
    const modal = document.getElementById('tripModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.getElementById('tripForm').reset();
    tempCosts = [];
    renderModalCosts();
}

function addCostToModal() {
    const description = document.getElementById('costDescription').value.trim();
    const amount = parseFloat(document.getElementById('costAmount').value);
    
    if (!description || !amount || amount <= 0) {
        alert('Please enter both a description and a valid amount.');
        return;
    }
    
    tempCosts.push({
        id: Date.now(),
        description: description,
        amount: amount
    });
    
    // Clear inputs
    document.getElementById('costDescription').value = '';
    document.getElementById('costAmount').value = '';
    
    renderModalCosts();
}

function removeCostFromModal(costId) {
    tempCosts = tempCosts.filter(cost => cost.id !== costId);
    renderModalCosts();
}

function renderModalCosts() {
    const costsList = document.getElementById('costsList');
    
    if (tempCosts.length === 0) {
        costsList.innerHTML = '';
        return;
    }
    
    costsList.innerHTML = tempCosts.map(cost => `
        <div class="cost-item">
            <div class="cost-item-info">
                <span class="cost-item-description">${escapeHtml(cost.description)}</span>
                <span class="cost-item-amount">€${cost.amount.toFixed(2)}</span>
            </div>
            <button type="button" class="btn-remove-cost" onclick="removeCostFromModal(${cost.id})">✕</button>
        </div>
    `).join('');
}

function addTrip(tripData) {
    const trip = {
        id: Date.now(),
        destination: tripData.destination,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        notes: tripData.notes || '',
        costs: tripData.costs || [],
        isWeekendTrip: tripData.isWeekendTrip || false,
        itinerary: [] // Each trip has its own itinerary
    };
    
    state.trips.push(trip);
    saveToLocalStorage();
    renderTrips();
    renderCalendar(); // Update calendar to show trip markers
    closeTripModal();
}

function deleteTrip(tripId) {
    if (confirm('Are you sure you want to delete this event?')) {
        state.trips = state.trips.filter(trip => trip.id !== tripId);
        saveToLocalStorage();
        renderTrips();
        renderCalendar();
        
        // Close events modal if it's open
        closeEventsModal();
    }
}

function getEventsOnDate(dateStr) {
    return state.trips.filter(trip => {
        return dateStr >= trip.startDate && dateStr <= trip.endDate;
    });
}

function showEventsModal(dateStr, events) {
    const modal = document.getElementById('eventsModal');
    const content = document.getElementById('eventsModalContent');
    const formattedDate = formatDate(dateStr);
    
    document.getElementById('eventsModalTitle').textContent = `Events on ${formattedDate}`;
    
    content.innerHTML = events.map(event => {
        const typeLabel = event.isWeekendTrip ? 'Weekend Trip' : 'Event';
        return `
            <div class="event-modal-item">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--spacing-xs);">
                    <div>
                        <h3 style="font-family: 'Times New Roman', Times, serif; color: var(--color-primary); margin-bottom: 4px; font-weight: 600;">${escapeHtml(event.destination)}</h3>
                        <p style="font-size: 0.9rem; color: var(--color-accent);">${typeLabel} • ${formatDate(event.startDate)} - ${formatDate(event.endDate)}</p>
                    </div>
                </div>
                ${event.notes ? `<p style="margin: var(--spacing-xs) 0; color: var(--color-accent);">${escapeHtml(event.notes)}</p>` : ''}
                <button onclick="deleteTrip(${event.id})" class="btn-secondary" style="margin-top: var(--spacing-xs);">Delete Event</button>
            </div>
        `;
    }).join('<hr style="margin: var(--spacing-md) 0; border: none; border-top: 1px solid var(--color-light);">');
    
    // Store the date for adding new event
    modal.dataset.date = dateStr;
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
}

function closeEventsModal() {
    const modal = document.getElementById('eventsModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
}

function renderTrips() {
    const tripsList = document.getElementById('tripsList');
    const noTrips = document.getElementById('noTrips');
    
    // Filter to only show weekend trips
    const weekendTrips = state.trips.filter(trip => trip.isWeekendTrip);
    
    if (weekendTrips.length === 0) {
        tripsList.style.display = 'none';
        noTrips.style.display = 'block';
        return;
    }
    
    tripsList.style.display = 'grid';
    noTrips.style.display = 'none';
    tripsList.innerHTML = '';
    
    // Sort trips by start date
    const sortedTrips = [...weekendTrips].sort((a, b) => 
        new Date(a.startDate) - new Date(b.startDate)
    );
    
    sortedTrips.forEach(trip => {
        const card = createTripCard(trip);
        tripsList.appendChild(card);
    });
}

function createTripCard(trip) {
    const card = document.createElement('div');
    card.className = 'trip-card';
    
    // Add class based on trip type
    if (trip.isWeekendTrip) {
        card.classList.add('weekend-trip');
    } else {
        card.classList.add('regular-event');
    }
    
    const formattedStartDate = formatDate(trip.startDate);
    const formattedEndDate = formatDate(trip.endDate);
    
    // Ensure itinerary exists for backwards compatibility
    if (!trip.itinerary) {
        trip.itinerary = [];
    }
    
    card.innerHTML = `
        <div class="trip-card-header">
            <div>
                <h3>${escapeHtml(trip.destination)}</h3>
                <div class="trip-dates">${formattedStartDate} - ${formattedEndDate}</div>
            </div>
        </div>
        ${trip.notes ? `<p class="trip-notes">${escapeHtml(trip.notes)}</p>` : ''}
        ${trip.costs && trip.costs.length > 0 ? renderTripCosts(trip.costs) : ''}
        
        <div class="trip-itinerary">
            <div class="trip-itinerary-header">
                <h4>Itinerary</h4>
                <button class="btn-small" onclick="openItineraryModal(${trip.id})">Add Item</button>
            </div>
            <ul class="itinerary-list" id="itinerary-${trip.id}">
                ${trip.itinerary.length === 0 ? 
                    '<li class="empty-itinerary">No itinerary items yet. Click "Add Item" to start planning!</li>' :
                    trip.itinerary.map(item => createItineraryItemHTML(item, trip.id)).join('')
                }
            </ul>
        </div>
        
        <div class="trip-actions">
            <button class="btn-icon btn-delete" onclick="deleteTrip(${trip.id})" aria-label="Delete trip">
                ✕
            </button>
        </div>
    `;
    
    return card;
}

function createItineraryItemHTML(item, tripId) {
    const category = item.category || item.type || 'activity';
    const categoryClass = `itinerary-${category}`;
    
    // Capitalize category for display
    const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
    
    return `
        <li class="itinerary-item ${categoryClass}">
            <div class="itinerary-item-header">
                <div class="itinerary-title-section">
                    <span class="itinerary-category-badge">${categoryLabel}</span>
                    <div class="itinerary-title">${escapeHtml(item.title)}</div>
                </div>
                ${item.time ? `<div class="itinerary-time">${item.time}</div>` : ''}
                <button class="btn-delete" onclick="deleteItineraryItem(${tripId}, ${item.id})" aria-label="Delete item">
                    ✕
                </button>
            </div>
            ${item.notes ? `<div class="itinerary-notes">${escapeHtml(item.notes)}</div>` : ''}
        </li>
    `;
}

function renderTripCosts(costs) {
    if (!costs || costs.length === 0) return '';
    
    const total = costs.reduce((sum, cost) => sum + cost.amount, 0);
    
    const costsHTML = costs.map(cost => `
        <div class="trip-cost-item">
            <span class="trip-cost-description">${escapeHtml(cost.description)}</span>
            <span class="trip-cost-amount">€${cost.amount.toFixed(2)}</span>
        </div>
    `).join('');
    
    return `
        <div class="trip-costs">
            <div class="trip-costs-header">Costs:</div>
            ${costsHTML}
            <div class="trip-cost-item">
                <span class="trip-cost-description">Total</span>
                <span class="trip-cost-amount">€${total.toFixed(2)}</span>
            </div>
        </div>
    `;
}

// ===================================
// Trip Itinerary Functions
// ===================================

function openItineraryModal(tripId) {
    const modal = document.getElementById('itineraryModal');
    document.getElementById('itineraryTripId').value = tripId;
    
    // Reset form to defaults
    document.getElementById('itineraryForm').reset();
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('itineraryTitle').focus();
}

function closeItineraryModal() {
    const modal = document.getElementById('itineraryModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.getElementById('itineraryForm').reset();
}

function addItineraryItem(tripId, itemData) {
    const trip = state.trips.find(t => t.id === tripId);
    if (!trip) return;
    
    // Initialize itinerary array if it doesn't exist (backwards compatibility)
    if (!trip.itinerary) {
        trip.itinerary = [];
    }
    
    const item = {
        id: Date.now(),
        title: itemData.title,
        category: itemData.category || 'activity',
        time: itemData.time || '',
        notes: itemData.notes || ''
    };
    
    trip.itinerary.push(item);
    saveToLocalStorage();
    renderTrips();
    closeItineraryModal();
}

function deleteItineraryItem(tripId, itemId) {
    const trip = state.trips.find(t => t.id === tripId);
    if (!trip) return;
    
    trip.itinerary = trip.itinerary.filter(item => item.id !== itemId);
    saveToLocalStorage();
    renderTrips();
}

// ===================================
// General Ideas Functions
// ===================================

function addGeneralIdea(category) {
    const modal = document.getElementById('barcelonaSpotModal');
    const categoryNames = {
        'must-see': 'Must See',
        'food': 'Food & Dining',
        'activities': 'Activities'
    };
    
    document.getElementById('spotModalTitle').textContent = `Add ${categoryNames[category]} Spot`;
    document.getElementById('spotCategory').value = category;
    document.getElementById('barcelonaSpotForm').reset();
    document.getElementById('spotCategory').value = category; // Set again after reset
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('spotTitle').focus();
}

function closeBarcelonaSpotModal() {
    const modal = document.getElementById('barcelonaSpotModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.getElementById('barcelonaSpotForm').reset();
}

function deleteIdea(category, ideaId) {
    state.generalIdeas[category] = state.generalIdeas[category].filter(idea => idea.id !== ideaId);
    saveToLocalStorage();
    renderGeneralIdeas();
}

function renderGeneralIdeas() {
    // Render each category
    Object.keys(state.generalIdeas).forEach(category => {
        const listId = category === 'must-see' ? 'mustSeeList' : 
                       category === 'food' ? 'foodList' : 'activitiesList';
        const list = document.getElementById(listId);
        list.innerHTML = '';
        
        state.generalIdeas[category].forEach(idea => {
            const item = createIdeaItem(idea, category);
            list.appendChild(item);
        });
    });
}

function createIdeaItem(idea, category) {
    const item = document.createElement('li');
    item.className = 'idea-item';
    
    item.innerHTML = `
        <div class="idea-item-header">
            <div class="idea-title">${escapeHtml(idea.title)}</div>
            <button class="btn-delete" onclick="deleteIdea('${category}', ${idea.id})" aria-label="Delete idea">
                ✕
            </button>
        </div>
        ${idea.description ? `<div class="idea-description">${escapeHtml(idea.description)}</div>` : ''}
    `;
    
    return item;
}

function addDefaultIdeas() {
    // Add some default Barcelona ideas
    const defaults = [
        { category: 'must-see', title: 'Sagrada Familia', description: 'Gaudí\'s masterpiece basilica' },
        { category: 'must-see', title: 'Park Güell', description: 'Colorful park with amazing views' },
        { category: 'must-see', title: 'Las Ramblas', description: 'Famous pedestrian street' },
        { category: 'food', title: 'Try authentic paella', description: 'Traditional Spanish rice dish' },
        { category: 'food', title: 'Tapas crawl in El Born', description: 'Sample various small plates' },
        { category: 'food', title: 'Churros con chocolate', description: 'Sweet breakfast treat' },
        { category: 'activities', title: 'Beach day at Barceloneta', description: 'Relax by the Mediterranean' },
        { category: 'activities', title: 'Gothic Quarter walking tour', description: 'Explore medieval streets' },
        { category: 'activities', title: 'Flamenco show', description: 'Traditional Spanish dance performance' }
    ];
    
    defaults.forEach(idea => {
        state.generalIdeas[idea.category].push({
            id: Date.now() + Math.random(),
            ...idea
        });
    });
    
    saveToLocalStorage();
    renderGeneralIdeas();
}

// ===================================
// Event Listeners
// ===================================

function initializeEventListeners() {
    // Calendar navigation
    document.getElementById('prevMonth').addEventListener('click', () => changeMonth('prev'));
    document.getElementById('nextMonth').addEventListener('click', () => changeMonth('next'));
    
    // Trip modal
    document.getElementById('addTripBtn').addEventListener('click', () => openTripModal());
    document.querySelectorAll('#tripModal .modal-close').forEach(btn => {
        btn.addEventListener('click', closeTripModal);
    });
    document.getElementById('cancelTripBtn').addEventListener('click', closeTripModal);
    
    // Add cost button
    document.getElementById('addCostBtn').addEventListener('click', addCostToModal);
    
    // Allow Enter key to add cost
    document.getElementById('costAmount').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCostToModal();
        }
    });
    
    // Itinerary modal
    document.querySelectorAll('#itineraryModal .modal-close').forEach(btn => {
        btn.addEventListener('click', closeItineraryModal);
    });
    document.getElementById('cancelItineraryBtn').addEventListener('click', closeItineraryModal);
    
    // Trip form submission
    document.getElementById('tripForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            destination: document.getElementById('tripDestination').value.trim(),
            startDate: document.getElementById('tripStartDate').value,
            endDate: document.getElementById('tripEndDate').value,
            notes: document.getElementById('tripNotes').value.trim(),
            costs: [...tempCosts], // Copy the temporary costs array
            isWeekendTrip: document.getElementById('isWeekendTrip').checked
        };
        
        // Validate dates
        if (formData.endDate < formData.startDate) {
            alert('End date must be after start date!');
            return;
        }
        
        addTrip(formData);
    });
    
    // Itinerary form submission
    document.getElementById('itineraryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const tripId = parseInt(document.getElementById('itineraryTripId').value);
        const formData = {
            title: document.getElementById('itineraryTitle').value.trim(),
            category: document.getElementById('itineraryCategory').value,
            time: document.getElementById('itineraryTime').value,
            notes: document.getElementById('itineraryNotes').value.trim()
        };
        
        addItineraryItem(tripId, formData);
    });
    
    // Barcelona Spot form submission
    document.getElementById('barcelonaSpotForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const category = document.getElementById('spotCategory').value;
        const formData = {
            id: Date.now(),
            title: document.getElementById('spotTitle').value.trim(),
            description: document.getElementById('spotDescription').value.trim()
        };
        
        state.generalIdeas[category].push(formData);
        saveToLocalStorage();
        renderGeneralIdeas();
        closeBarcelonaSpotModal();
    });
    
    // Close modals when clicking outside
    document.getElementById('tripModal').addEventListener('click', (e) => {
        if (e.target.id === 'tripModal') {
            closeTripModal();
        }
    });
    
    document.getElementById('itineraryModal').addEventListener('click', (e) => {
        if (e.target.id === 'itineraryModal') {
            closeItineraryModal();
        }
    });
    
    // Barcelona Spot modal
    document.querySelectorAll('#barcelonaSpotModal .modal-close').forEach(btn => {
        btn.addEventListener('click', closeBarcelonaSpotModal);
    });
    document.getElementById('cancelSpotBtn').addEventListener('click', closeBarcelonaSpotModal);
    document.getElementById('barcelonaSpotModal').addEventListener('click', (e) => {
        if (e.target.id === 'barcelonaSpotModal') {
            closeBarcelonaSpotModal();
        }
    });
    
    // Events modal
    document.querySelectorAll('#eventsModal .modal-close').forEach(btn => {
        btn.addEventListener('click', closeEventsModal);
    });
    document.getElementById('closeEventsModalBtn').addEventListener('click', closeEventsModal);
    document.getElementById('addEventOnDateBtn').addEventListener('click', () => {
        const modal = document.getElementById('eventsModal');
        const dateStr = modal.dataset.date;
        closeEventsModal();
        openTripModal(dateStr);
    });
    
    document.getElementById('eventsModal').addEventListener('click', (e) => {
        if (e.target.id === 'eventsModal') {
            closeEventsModal();
        }
    });
    
    // Keyboard accessibility for modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeTripModal();
            closeItineraryModal();
            closeEventsModal();
        }
    });
}

// ===================================
// Local Storage Functions
// ===================================

function saveToLocalStorage() {
    try {
        localStorage.setItem('barcelonaTrips', JSON.stringify(state.trips));
        localStorage.setItem('barcelonaGeneralIdeas', JSON.stringify(state.generalIdeas));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const trips = localStorage.getItem('barcelonaTrips');
        const generalIdeas = localStorage.getItem('barcelonaGeneralIdeas');
        
        if (trips) {
            state.trips = JSON.parse(trips);
            // Ensure all trips have an itinerary array (backwards compatibility)
            state.trips.forEach(trip => {
                if (!trip.itinerary) {
                    trip.itinerary = [];
                }
            });
        }
        
        if (generalIdeas) {
            state.generalIdeas = JSON.parse(generalIdeas);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

// ===================================
// Utility Functions
// ===================================

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================================
// Export functions for inline event handlers
// ===================================
window.deleteTrip = deleteTrip;
window.addGeneralIdea = addGeneralIdea;
window.deleteIdea = deleteIdea;
window.openItineraryModal = openItineraryModal;
window.deleteItineraryItem = deleteItineraryItem;
window.removeCostFromModal = removeCostFromModal;
