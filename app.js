/**
 * Gästehaus 22 - Hauptskript (app.js)
 */

// 1. KONFIGURATION & GLOBALE VARIABLEN
const TARGET_COORDS = { lat: 48.21245, lon: 14.41432 }; // Eichenstraße 22, Asten
let deferredPrompt;

// DOM Elemente
const installBtn = document.getElementById('install-button');
const checkDistBtn = document.getElementById('check-dist-btn');
const distInfo = document.getElementById('dist-info');

// 2. INITIALISIERUNG BEIM LADEN
document.addEventListener('DOMContentLoaded', () => {
    // Lucide Icons rendern
    if (window.lucide) {
        lucide.createIcons();
    }

    // Standardsprache auf Deutsch setzen
    setLang('de');

    // Service Worker für PWA registrieren (erforderlich für den Install-Button)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('Service Worker registration failed: ', err);
        });
    }
});

// 3. SPRACHSTEUERUNG (DE/EN)
function setLang(lang) {
    const elements = document.querySelectorAll('[lang]');
    
    elements.forEach(el => {
        // Wir ignorieren das <html> Tag selbst
        if (el.tagName.toLowerCase() === 'html') return;

        if (el.getAttribute('lang') === lang) {
            el.style.display = ''; // Sichtbar machen
            el.removeAttribute('aria-hidden');
        } else {
            el.style.display = 'none'; // Verstecken
            el.setAttribute('aria-hidden', 'true');
        }
    });

    // Aktive Klasse bei den Buttons tauschen
    document.getElementById('btn-de').classList.toggle('active', lang === 'de');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
}

// 4. PWA INSTALLATION (APP BUTTON)
window.addEventListener('beforeinstallprompt', (e) => {
    // Verhindert, dass der Standard-Browser-Banner erscheint
    e.preventDefault();
    deferredPrompt = e;
    // Zeigt den versteckten App-Button im Header an
    if (installBtn) {
        installBtn.style.display = 'flex';
    }
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            installBtn.style.display = 'none';
        }
        deferredPrompt = null;
    });
}

// 5. GEOLOCATION & DISTANZBERECHNUNG
function calculateHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Erdradius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

if (checkDistBtn) {
    checkDistBtn.addEventListener('click', () => {
        checkDistBtn.disabled = true;
        distInfo.style.display = 'block';
        distInfo.innerHTML = '<span class="loading-spinner">...</span>';

        if (!navigator.geolocation) {
            distInfo.innerText = "Geolocation nicht unterstützt.";
            checkDistBtn.disabled = false;
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const distance = calculateHaversine(
                    pos.coords.latitude, 
                    pos.coords.longitude, 
                    TARGET_COORDS.lat, 
                    TARGET_COORDS.lon
                );
                
                distInfo.innerHTML = `
                    <div style="font-weight: bold; color: #4ade80;">
                        ${distance.toFixed(1)} km entfernt
                    </div>
                `;
                checkDistBtn.disabled = false;
            },
            (err) => {
                distInfo.innerText = "Standortzugriff abgelehnt.";
                checkDistBtn.disabled = false;
            },
            { timeout: 10000 }
        );
    });
}

// 6. NAVIGATION & MODALS
function openNavigation() {
    // Öffnet Google Maps direkt mit der Zieladresse
    const url = `https://www.google.com/maps/dir/?api=1&destination=${TARGET_COORDS.lat},${TARGET_COORDS.lon}`;
    window.open(url, '_blank');
}

function toggleModal(type) {
    const modal = document.getElementById(`modal-${type}`);
    if (modal) {
        modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
    }
}

function closeModals(event) {
    // Schließt das Modal, wenn man außerhalb des Inhalts klickt
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}