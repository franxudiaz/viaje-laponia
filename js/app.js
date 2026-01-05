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
            <div class="page" id="page-day-${day.id}">
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

                    <!-- Photo Gallery Section -->
                    <div class="gallery-section">
                        <div class="gallery-header">
                            <h4>📸 Recuerdos del día</h4>
                            <label class="upload-btn">
                                <input type="file" accept="image/*" class="photo-upload-input" data-day-id="${day.id}" style="display: none;">
                                ➕ Subir Foto
                            </label>
                        </div>
                        <div class="gallery-container" id="gallery-day-${day.id}">
                            <!-- Photos will appear here -->
                            <div class="gallery-placeholder">No hay fotos aún...</div>
                        </div>
                    </div>

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
        const isMobile = window.innerWidth < 768;

        const pageFlip = new St.PageFlip(document.getElementById('book'), {
            width: isMobile ? 400 : 500, // VUELTA A VALORES ORIGINALES
            height: isMobile ? 600 : 700,
            size: isMobile ? 'stretch' : 'fixed',
            // Configuración clave para móvil:
            minWidth: 300,
            maxWidth: 1000,
            minHeight: 400,
            maxHeight: 1400,
            maxShadowOpacity: 0.5,
            showCover: true,
            mobileScrollSupport: false,
            clickEvent: false, // DESACTIVAR cambio de página con click
            usePortrait: true,
            startPage: 0
        });

        // Load pages
        pageFlip.loadFromHTML(document.querySelectorAll('.page'));

        // Expose to window
        document.getElementById('book').pageFlip = pageFlip;

    }, 100);

    // 3. Initialize Firebase Integration
    const initGallery = () => {
        if (!window.fbServices) return;

        console.log("Initializing Gallery Logic");

        // Set up Listeners for each day
        itinerary.forEach(day => {
            const container = document.getElementById(`gallery-day-${day.id}`);

            // Subscribe to photos
            window.fbServices.subscribeToPhotos(day.id, (photos) => {
                if (photos.length === 0) {
                    container.innerHTML = '<div class="gallery-placeholder">No hay fotos aún...</div>';
                    return;
                }

                // Render photos with delete button
                container.innerHTML = photos.map(photo =>
                    `<div class="gallery-item">
                        <img src="${photo.url}" loading="lazy" alt="Foto del viaje" onclick="window.open('${photo.url}', '_blank')">
                        <button class="delete-btn" onclick="deletePhoto('${photo.id}', '${photo.filePath}')">🗑️</button>
                     </div>`
                ).join('');
            });
        });

        // Global delete function
        window.deletePhoto = async (docId, filePath) => {
            if (confirm("¿Seguro que quieres borrar esta foto?")) {
                try {
                    await window.fbServices.deletePhoto(docId, filePath);
                } catch (err) {
                    alert("Error al borrar: " + err.message);
                }
            }
        };

        // Set up Upload Buttons
        document.querySelectorAll('.upload-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Stop page flip
            });
        });

        document.querySelectorAll('.photo-upload-input').forEach(input => {
            input.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            input.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const dayId = parseInt(e.target.dataset.dayId);
                const btnLabel = e.target.parentElement;

                // Visual feedback using a temporary span, preserving existing children (input)
                btnLabel.style.opacity = '0.6';
                btnLabel.style.cursor = 'wait';

                // Create status indicator
                const statusSpan = document.createElement('span');
                statusSpan.className = 'upload-status-text';
                statusSpan.textContent = ' ⏳ Subiendo...';
                statusSpan.style.marginLeft = '5px';
                statusSpan.style.fontSize = '0.8rem';
                statusSpan.style.backgroundColor = 'white';
                statusSpan.style.color = 'black';
                statusSpan.style.padding = '2px 5px';
                statusSpan.style.borderRadius = '5px';

                btnLabel.appendChild(statusSpan);

                try {
                    await window.fbServices.uploadPhoto(file, dayId);
                    // Success feedback
                    alert("¡Foto subida con éxito!");
                    input.value = ''; // Reset file input
                } catch (err) {
                    alert("Error al subir la foto: " + err.message);
                } finally {
                    // Restore state
                    btnLabel.style.opacity = '1';
                    btnLabel.style.cursor = 'pointer';
                    if (statusSpan.parentNode) {
                        statusSpan.parentNode.removeChild(statusSpan);
                    }
                }
            });
        });
    };

    // Wait for firebase or check if ready
    if (window.fbServices) {
        initGallery();
    } else {
        window.addEventListener('firebase-ready', initGallery);
    }
});
