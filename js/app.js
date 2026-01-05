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
        const container = document.getElementById('book');

        const pageFlip = new St.PageFlip(container, {
            width: isMobile ? window.innerWidth : 550,
            height: isMobile ? window.innerHeight : 750,
            size: isMobile ? 'stretch' : 'fixed',
            // Mobile adjustments
            minWidth: 300,
            maxWidth: 1000,
            minHeight: 400,
            maxHeight: 1400,
            maxShadowOpacity: 0.5,
            showCover: true,
            mobileScrollSupport: false,

            // CRITICAL FIXES:
            clickEvent: false, // Turn off click-to-flip universally (user hates accidental flips)
            useMouseEvents: !isMobile, // Only use mouse events on desktop
            usePortrait: true,
            startPage: 0
        });

        // Load pages
        pageFlip.loadFromHTML(document.querySelectorAll('.page'));

        // Expose to window
        container.pageFlip = pageFlip;

    }, 200);

    // 3. Initialize Firebase Integration
    const initGallery = () => {
        if (!window.fbServices) return;

        console.log("Initializing Gallery Logic");

        // Set up Listeners for each day
        itinerary.forEach(day => {
            const container = document.getElementById(`gallery-day-${day.id}`);

            // Subscribe to photos
            window.fbServices.subscribeToPhotos(day.id, (photos) => {
                if (!photos || photos.length === 0) {
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
            // Confirm dialog stops propagation naturally usually, but we are inside an onclick.
            // The event stopping logic below regarding gallery containers helps here.
            if (confirm("¿Seguro que quieres borrar esta foto?")) {
                try {
                    await window.fbServices.deletePhoto(docId, filePath);
                } catch (err) {
                    alert("Error al borrar: " + err.message);
                }
            }
        };

        // --- ROBUST EVENT HANDLING ---
        const stopAllEvents = (element) => {
            ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'pointerdown', 'pointerup'].forEach(evt => {
                element.addEventListener(evt, (e) => e.stopPropagation(), { passive: false });
            });
        };

        // Apply to Upload Buttons and Inputs to prevent PageFlip stealing focus/clicks
        document.querySelectorAll('.upload-btn, .photo-upload-input').forEach(el => {
            stopAllEvents(el);
        });

        // Apply prevention to gallery containers (allow scroll, stop propagation)
        document.querySelectorAll('.gallery-container').forEach(container => {
            // We only stop propagation of touch/click to prevent page flip. 
            // We do NOT stop default behavior entirely otherwise scrolling won't work?
            // Actually, stopPropagation() is enough to stop PageFlip.
            ['touchstart', 'touchmove', 'touchend', 'mousedown', 'mousemove', 'mouseup'].forEach(evt => {
                container.addEventListener(evt, (e) => e.stopPropagation(), { passive: true });
            });
        });

        // --- UPLOAD PROCESS ---
        document.querySelectorAll('.photo-upload-input').forEach(input => {
            input.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const dayId = parseInt(e.target.dataset.dayId);
                const btnLabel = e.target.parentElement;

                // Safe UI Update: Don't destroy the input by replacing innerHTML.
                // Find the text node "➕ Subir Foto"
                let textNode = null;
                for (let i = 0; i < btnLabel.childNodes.length; i++) {
                    const node = btnLabel.childNodes[i];
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                        textNode = node;
                        break;
                    }
                }

                const originalText = textNode ? textNode.textContent : "➕ Subir Foto";

                // Visual feedback
                btnLabel.style.opacity = '0.6';
                btnLabel.style.cursor = 'wait';
                if (textNode) textNode.textContent = " ⏳ Subiendo...";

                // Create a timeout promise to prevent hanging
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error("La subida está tardando demasiado. Verifica tu conexión.")), 60000);
                });

                try {
                    if (!navigator.onLine) {
                        throw new Error("No hay conexión a internet.");
                    }

                    // Race between upload and timeout
                    await Promise.race([
                        window.fbServices.uploadPhoto(file, dayId),
                        timeoutPromise
                    ]);

                    alert("¡Foto subida con éxito!");
                    input.value = '';
                } catch (err) {
                    console.error("Upload error:", err);
                    alert("Error: " + err.message);
                } finally {
                    // Restore state reliably
                    btnLabel.style.opacity = '1';
                    btnLabel.style.cursor = 'pointer';
                    if (textNode) textNode.textContent = originalText;
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

    // --- DEBUG CONSOLE (Temporary for Mobile) ---
    // Creates a small overlay to read logs on mobile
    const debugDiv = document.createElement('div');
    debugDiv.style.position = 'fixed';
    debugDiv.style.bottom = '0';
    debugDiv.style.left = '0';
    debugDiv.style.width = '100%';
    debugDiv.style.height = '100px';
    debugDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
    debugDiv.style.color = '#00ff00';
    debugDiv.style.fontSize = '10px';
    debugDiv.style.overflowY = 'scroll';
    debugDiv.style.zIndex = '9999';
    debugDiv.style.pointerEvents = 'none'; // Click through
    debugDiv.style.fontFamily = 'monospace';
    debugDiv.innerHTML = '<div>Debug Started...</div>';
    document.body.appendChild(debugDiv);

    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
        originalLog.apply(console, args);
        debugDiv.innerHTML = `<div>LOG: ${args.join(' ')}</div>` + debugDiv.innerHTML;
    };

    console.error = (...args) => {
        originalError.apply(console, args);
        debugDiv.innerHTML = `<div style="color:red">ERR: ${args.join(' ')}</div>` + debugDiv.innerHTML;
    };

});
