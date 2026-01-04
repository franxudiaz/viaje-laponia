document.addEventListener('DOMContentLoaded', () => {
    const bookContainer = document.getElementById('book');

    // 1. Generate Pages HTML
    let pagesHTML = '';

    // -- Cover Page --
    pagesHTML += `
        <div class="page cover">
            <div class="page-content">
                <h1>Viaje a<br>Laponia</h1>
                <img src="assets/santa_custom.png" alt="Santa" style="width: 100px; margin: 20px 0;">
                <h2>Enero 2026</h2>
                <button class="start-btn" onclick="document.getElementById('book').pageFlip.flipNext()">¡Empezar Aventura!</button>
            </div>
            <div class="page-number">Portada</div>
        </div>
    `;

    // -- Day Pages --
    itinerary.forEach((day, index) => {
        const activitiesHTML = day.activities.map(act =>
            `<li><strong>${act.time}</strong>: ${act.desc}</li>`
        ).join('');

        pagesHTML += `
            <div class="page">
                <div class="page-content">
                    <div class="day-header">
                        <span class="date-badge">${day.dayInfo}</span>
                        <h3 class="day-title">${day.title}</h3>
                    </div>
                    
                    <img src="${day.icon}" class="day-icon" alt="Icono">
                    
                    <div class="location-image-container">
                        <img src="${day.locationImage}" class="location-image" alt="${day.location.name}">
                    </div>

                    <ul class="activities-list">
                        ${activitiesHTML}
                    </ul>

                    <a href="${day.location.url}" target="_blank" class="map-btn">
                        📍 Ver Mapa
                    </a>
                </div>
                <div class="page-number">Día ${index + 1}</div>
            </div>
        `;
    });

    // -- Back Cover --
    pagesHTML += `
        <div class="page cover">
            <div class="page-content">
                <h1>¡Fin del<br>Viaje!</h1>
                <img src="assets/reindeer_custom.png" alt="Reindeer" style="width: 100px; margin: 20px 0;">
                <p style="font-size: 1.2rem; margin-top: 20px;">Esperamos que haya sido<br>inolvidable.</p>
            </div>
            <div class="page-number">Contraportada</div>
        </div>
    `;

    // Inject into DOM
    bookContainer.innerHTML = pagesHTML;

    // 2. Initialize PageFlip
    // We wait a tiny bit to ensure DOM is fully parsed
    setTimeout(() => {
        const pageFlip = new St.PageFlip(document.getElementById('book'), {
            width: 350, // Base width
            height: 600, // Base height
            size: 'stretch',
            minWidth: 300,
            maxWidth: 500,
            minHeight: 500,
            maxHeight: 800,
            maxShadowOpacity: 0.5,
            showCover: true,
            mobileScrollSupport: false // Disable scroll on mobile to avoid conflicts
        });

        // Load pages
        pageFlip.loadFromHTML(document.querySelectorAll('.page'));

        // Expose to window for the "Start" button to work
        document.getElementById('book').pageFlip = pageFlip;

    }, 100);
});
