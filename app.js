
        const images = {
            gallery: [
                { src: "bedrooms.webp", alt: "Schlafzimmer" },
                { src: "livingroom.webp", alt: "Wohnzimmer" },
                { src: "kitchen.webp", alt: "Küche" },
                { src: "bathroom.webp", alt: "Badezimmer" }
            ]
        };

function setLang(lang) {
    document.body.classList.toggle('lang-en', lang === 'en');
    document.getElementById('btn-de').classList.toggle('active', lang === 'de');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');

    // WhatsApp Text dynamisch anpassen
    const waLink = document.getElementById('whatsapp-link');
    if (lang === 'de') {
        waLink.href = "https://wa.me/436801610618?text=Hallo!%20Ich%20hätte%20gerne%20Infos%20zu%20einem%20Zimmer%20im%20Gästehaus%2022.";
    } else {
        waLink.href = "https://wa.me/436801610618?text=Hello!%20I%20am%20interested%20in%20a%20room%20at%20Gästehaus%2022.";
    }
}
        function toggleModal(id) {
            const m = document.getElementById('modal-' + id);
            m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
        }

        function closeModals(e) { if (e.target.classList.contains('modal')) e.target.style.display = 'none'; }

        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();
            const container = document.getElementById('gallery-container');
            images.gallery.forEach(img => {
                const div = document.createElement('div');
                div.className = 'gallery-item';
                div.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy">`;
                div.onclick = () => {
                    document.getElementById('lightbox-img').src = img.src;
                    document.getElementById('lightbox').style.display = 'flex';
                };
                container.appendChild(div);
            });

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pos => {
                    const R = 6371;
                    const dLat = (48.2163 - pos.coords.latitude) * Math.PI / 180;
                    const dLon = (14.4144 - pos.coords.longitude) * Math.PI / 180;
                    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(pos.coords.latitude * Math.PI / 180) * Math.cos(48.2163 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    const dist = R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
                    const el = document.getElementById('dist-info');
                    if(el) {
                        el.style.display = 'block';
                        el.innerText = `Nur ${dist.toFixed(1)} km entfernt`;
                    }
                });
            }

            ['data-as-772', 'data-as-772-en'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.innerText = "rentiehclA lraK";
            });
        });

        function openNavigation() {
            const addr = encodeURIComponent("Gästehaus 22, Eichenstraße 22, 4481 Asten");
            const url = /iPad|iPhone|iPod/.test(navigator.userAgent) ? `maps://maps.apple.com/?daddr=${addr}` : `https://www.google.com/maps/dir/?api=1&destination=${addr}`;
            window.open(url, '_blank');
        }

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
            });
        }

        let deferredPrompt;
        const installBtn = document.getElementById('install-button');
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installBtn.style.display = 'flex';
        });

        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') installBtn.style.display = 'none';
                deferredPrompt = null;
            }
        });