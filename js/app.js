// import { itinerary } from './data.js'; // Removed for local execution

const timelineContainer = document.getElementById('timeline');

// Snowfall effect generator
function createSnowflakes() {
    const symbols = ['❄', '❅', '❆', '•'];
    const count = 20; // Number of snowflakes

    for (let i = 0; i < count; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = symbols[Math.floor(Math.random() * symbols.length)];

        // Randomize position and animation delay
        snowflake.style.left = (Math.random() * 100) + 'vw';
        snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's, ' + (Math.random() * 3 + 2) + 's';
        snowflake.style.animationDelay = (Math.random() * 5) + 's, ' + (Math.random() * 2) + 's';
        snowflake.style.fontSize = (Math.random() * 1.5 + 0.5) + 'rem';
        snowflake.style.opacity = Math.random() * 0.7 + 0.3;

        document.body.appendChild(snowflake);
    }
}

function renderTimeline() {
    timelineContainer.innerHTML = '';


    itinerary.forEach((day, index) => {
        const card = document.createElement('article');
        card.className = 'day-card';
        card.style.animationDelay = `${index * 0.1}s`; // Stagger animation
        card.style.animation = `fadeInDown 0.5s ease-out forwards`;
        card.style.opacity = '0'; // Initial state for animation
        // Fix for animation visibility
        setTimeout(() => card.style.opacity = '1', index * 100);

        // Build Activities HTML
        const activitiesHtml = day.activities.map(act => `
            <li class="activity-item">
                <span class="time">${act.time}</span>
                <span class="desc">${act.desc}</span>
            </li>
        `).join('');

        card.innerHTML = `
            <div class="card-header">
                <span class="date">${day.dayInfo}</span>
                <img src="${day.icon}" alt="Icon" class="icon">
            </div>
            <h2 class="card-title">${day.title}</h2>
            <ul class="activities">
                ${activitiesHtml}
            </ul>
            <a href="${day.location.url}" target="_blank" class="map-btn" onclick="event.stopPropagation();">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                </svg>
                Ver en Mapa
            </a>
        `;

        // Add click event to open modal
        card.addEventListener('click', () => openModal(day));

        timelineContainer.appendChild(card);
    });
}

function openModal(day) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('day-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'day-modal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }

    const activitiesHtml = day.activities.map(act => `
        <li class="activity-item">
            <span class="time">${act.time}</span>
            <span class="desc">${act.desc}</span>
        </li>
    `).join('');

    modal.innerHTML = `
        <div class="expanded-card">
            <button class="close-btn" onclick="closeModal()">×</button>
            <img src="${day.locationImage}" alt="${day.title}" class="location-image">
            <div class="expanded-content">
                <div class="card-header">
                    <span class="date">${day.dayInfo}</span>
                    <img src="${day.icon}" alt="Icon" class="icon">
                </div>
                <h2 class="card-title">${day.title}</h2>
                <ul class="activities">
                    ${activitiesHtml}
                </ul>
                <a href="${day.location.url}" target="_blank" class="map-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                    Ver en Mapa
                </a>
            </div>
        </div>
    `;

    // Activate modal
    setTimeout(() => modal.classList.add('active'), 10);
    document.body.classList.add('modal-open');

    // Close on click outside
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}

window.closeModal = function () {
    const modal = document.getElementById('day-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        // Wait for animation to finish before removing/clearing
        setTimeout(() => {
            // Optional: modal.innerHTML = ''; 
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createSnowflakes();
    renderTimeline();
});
