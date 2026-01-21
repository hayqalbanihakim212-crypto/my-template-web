// Logika otomatis: Jika buka di localhost, pakai localhost:3000. Jika online, pakai URL Backend.
// PENTING: Ganti 'https://ganti-dengan-url-backend-anda.onrender.com' dengan URL asli dari Render/Railway nanti.
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocal ? 'http://localhost:3000' : 'https://ganti-dengan-url-backend-anda.onrender.com';

function hubungiDeveloper() {
    const noHp = "6282181858276"; // Ganti dengan nomor developer jika berbeda
    const pesan = `Halo Developer, saya ingin bertanya seputar website ini.`;
    const linkWA = `https://wa.me/${noHp}?text=${encodeURIComponent(pesan)}`;

    window.open(linkWA, '_blank');
}

function showDetails(button) {
    const card = button.closest('.card');
    const title = card.querySelector('h3').innerText;
    const description = card.querySelector('p').innerText;
    alert(`Detail Project: ${title}\n\n${description}`);
}

// --- Grafik 1: Broker Chart (Candlestick) ---
(function () {
    const canvas = document.getElementById('brokerChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let candles = [];
    const maxCandles = 60;
    const candleWidth = 8;
    const gap = 5;
    let basePrice;

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        basePrice = canvas.height / 2 - 40;
    }

    function createCandle(openPrice) {
        return {
            open: openPrice,
            close: openPrice,
            high: openPrice,
            low: openPrice,
            isNew: true
        };
    }

    function init() {
        resize();
        let lastClose = basePrice;
        for (let i = 0; i < maxCandles; i++) {
            let c = createCandle(lastClose);
            let move = (Math.random() - 0.5) * 60;
            c.close = c.open + move;
            c.high = Math.max(c.open, c.close) + Math.random() * 10;
            c.low = Math.min(c.open, c.close) - Math.random() * 10;
            c.isNew = false;
            candles.push(c);
            lastClose = c.close;
        }
    }

    function updateLastCandle() {
        let last = candles[candles.length - 1];
        let tick = (Math.random() - 0.5) * 5;
        last.close += tick;
        if (last.close > canvas.height * 0.7) last.close -= 5;
        if (last.close < canvas.height * 0.3) last.close += 5;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateLastCandle();

        const totalWidth = candles.length * (candleWidth + gap);
        const startX = canvas.width - totalWidth - 20;

        candles.forEach((c, i) => {
            const x = startX + i * (candleWidth + gap);
            const isUp = c.close >= c.open;
            const color = isUp ? '#ef5350' : '#26a69a';

            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 1.5;

            ctx.beginPath();
            ctx.moveTo(x + candleWidth / 2, c.high);
            ctx.lineTo(x + candleWidth / 2, c.low);
            ctx.stroke();

            const bodyY = Math.min(c.open, c.close);
            const bodyH = Math.max(Math.abs(c.open - c.close), 1);
            ctx.fillRect(x, bodyY, candleWidth, bodyH);

            if (i === candles.length - 1) {
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(0, c.close);
                ctx.lineTo(canvas.width, c.close);
                ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
                ctx.stroke();
                ctx.setLineDash([]);
            }
        });

        requestAnimationFrame(draw);
    }

    setInterval(() => {
        let lastClose = candles[candles.length - 1].close;
        candles.shift();
        candles.push(createCandle(lastClose));
    }, 2000);

    window.addEventListener('resize', resize);
    init();
    draw();
})();

// --- Grafik 2: Line Chart (Live Dynamic Data) ---
(function () {
    const canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 400;

    let points = [];
    let offset = 0;

    for (let i = 0; i < 50; i++) {
        points.push(0);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        offset += 0.05;
        let newValue = Math.sin(offset) * 100 + Math.sin(offset * 0.5) * 50;

        points.push(newValue);
        if (points.length > 60) points.shift();

        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#38bdf8';

        let spacing = canvas.width / (points.length - 1);

        for (let i = 0; i < points.length; i++) {
            let x = i * spacing;
            let y = (canvas.height / 2) - points[i];

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.shadowBlur = 15;
        ctx.shadowColor = '#38bdf8';

        requestAnimationFrame(draw);
    }

    draw();
})();

// --- Grafik 3: Win/Loss Diagram (Stat Label 1) ---
(function () {
    const canvas = document.getElementById('winLossChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = 150;
    canvas.height = 50;

    // Data dummy: 1 = Win (Hijau/Naik), 0 = Loss (Merah/Turun)
    const data = [1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1];
    const barWidth = canvas.width / data.length;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerY = canvas.height / 2;

        data.forEach((val, i) => {
            const x = i * barWidth;
            const isWin = val === 1;
            const barH = 15;
            const color = isWin ? '#14F195' : '#ef5350';

            ctx.fillStyle = color;
            // Gambar batang naik (Win) atau turun (Loss) dari tengah
            const y = isWin ? centerY - barH : centerY;
            ctx.fillRect(x + 1, y, barWidth - 2, barH);
        });
    }

    draw();
})();

// --- Scroll Animation Observer ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active'); // Hapus class agar animasi berulang saat scroll ke atas
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// --- Logika Pendaftaran & Update Data ---

async function submitRegistration(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const wa = document.getElementById('regWa').value;

    // Persiapkan URL WhatsApp
    const message = `Halo Founder, saya ${name} ingin konfirmasi pendaftaran komunitas Psikologi-Academia. Mohon info selanjutnya.`;
    const founderNumber = "6282276266058"; 
    const waUrl = `https://wa.me/${founderNumber}?text=${encodeURIComponent(message)}`;

    // TRIK: Buka tab baru SEBELUM fetch (async) agar tidak diblokir browser
    const newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.document.write('<html><body style="background:#1a1a2e;color:white;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;"><h2>Sedang mengalihkan ke WhatsApp...</h2></body></html>');
    }

    // 1. Simpan data ke Localhost (Backend Database)
    try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, wa })
        });
        if (!response.ok) throw new Error('Gagal menyimpan ke database');
        console.log('Data tersimpan di localhost');
    } catch (err) {
        console.warn('Server localhost tidak merespon atau error:', err);
    }

    // 2. Redirect tab yang sudah dibuka ke WhatsApp
    if (newWindow) {
        newWindow.location.href = waUrl;
    } else {
        window.location.href = waUrl; // Fallback jika popup diblokir
    }
}

// Fungsi Update Otomatis Jumlah Anggota (Polling dari Server)
function updateMemberCount() {
    fetch(`${API_BASE_URL}/api/member-count`)
        .then(res => res.json())
        .then(data => {
            if (data.count !== undefined) {
                const statValue = document.querySelector('.stat-value');
                if (statValue) statValue.innerText = data.count;
            }
        })
        .catch(err => console.log('Menunggu koneksi server...'));
}

// ... (Kode grafik dan lainnya tetap sama, update bagian bawah ini) ...

// --- Fungsi Load Modul Pembelajaran (Termasuk Premium) ---
async function loadModules() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/modules`);
        const modules = await response.json();
        const container = document.getElementById('modulesContainer');
        if (!container) return;

        container.innerHTML = '';

        modules.forEach(m => {
            let btnAction = '';
            if (m.isPremium) {
                // Tombol untuk modul premium
                btnAction = `<button onclick="downloadPremium('${m.file}')" class="btn btn-warning w-100 fw-bold"><i class="fa-solid fa-lock me-2"></i> Premium Download</button>`;
            } else {
                // Tombol untuk modul gratis
                btnAction = `<a href="${API_BASE_URL}/downloads/${m.file}" class="btn btn-primary w-100" download><i class="fa-solid fa-download me-2"></i> Download Gratis</a>`;
            }

            const card = `
                <div class="col">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">${m.title}</h5>
                            <p class="card-text text-muted small">${m.description}</p>
                            <div class="mt-3">${btnAction}</div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (e) { console.error('Gagal memuat modul:', e); }
}

function downloadPremium(filename) {
    const password = prompt("Masukkan Password Premium untuk mengunduh file ini:");
    if (password) {
        // Redirect ke endpoint download premium dengan password
        window.location.href = `${API_BASE_URL}/api/download-premium?filename=${encodeURIComponent(filename)}&password=${encodeURIComponent(password)}`;
    }
}

// --- Fungsi Load Update Komunitas ---
async function loadUpdates() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/updates`);
        const updates = await response.json();
        const container = document.getElementById('updatesContainer');
        if (!container) return;
        
        container.innerHTML = ''; // Bersihkan konten lama

        if (updates.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-white"><p>Belum ada update komunitas terbaru.</p></div>';
            return;
        }

        updates.forEach(update => {
            const date = new Date(update.date).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
            
            // Pastikan path gambar sesuai dengan server.js (/downloads/namafile)
            const card = `
                <div class="col">
                    <div class="card h-100 shadow-sm border-0">
                        <img src="${API_BASE_URL}/downloads/${update.image}" class="card-img-top" alt="${update.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">${update.title}</h5>
                            <p class="card-text text-muted small"><i class="fa-regular fa-calendar me-1"></i> ${date}</p>
                            <p class="card-text">${update.description}</p>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (error) {
        console.error('Gagal memuat update:', error);
    }
}

// --- Fungsi Load Riwayat Trade ---
async function loadTrades() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/trades`);
        const trades = await response.json();
        const container = document.getElementById('tradesContainer');
        if (!container) return;
        
        container.innerHTML = '';

        if (trades.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-white"><p>Belum ada riwayat trade.</p></div>';
            return;
        }

        trades.forEach(trade => {
            const date = new Date(trade.date).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
            const isWin = trade.result.toLowerCase().includes('win') || trade.result.toLowerCase().includes('profit') || trade.result.includes('+');
            const badgeClass = isWin ? 'bg-success' : 'bg-danger';

            const card = `
                <div class="col">
                    <div class="card h-100 shadow-sm border-0" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(5px); color: white;">
                        <img src="${API_BASE_URL}/downloads/${trade.image}" class="card-img-top" alt="${trade.pair}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h5 class="card-title fw-bold mb-0">${trade.pair}</h5>
                                <span class="badge ${badgeClass}">${trade.result}</span>
                            </div>
                            <p class="card-text small text-white-50"><i class="fa-regular fa-calendar me-1"></i> ${date}</p>
                            <p class="card-text">${trade.description}</p>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (error) {
        console.error('Gagal memuat trades:', error);
    }
}

// Jalankan fungsi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    updateMemberCount();
    loadUpdates();
    loadTrades();
    loadModules();
    setInterval(updateMemberCount, 10000);
});
