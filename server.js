const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Tambahkan baris ini
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Security: Block access to sensitive files
app.use((req, res, next) => {
    const sensitiveFiles = [
        '/server.js', '/.env', '/package.json', '/package-lock.json',
        '/database.json', '/modules.json', '/updates.json', '/trades.json'
    ];
    if (sensitiveFiles.includes(req.path)) {
        return res.status(403).send('Access Denied');
    }
    next();
});

app.use(express.static(__dirname));
app.use(express.json());

// Mencegah cache browser
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});

const DB_FILE = path.join(__dirname, 'database.json');
const MODULES_FILE = path.join(__dirname, 'modules.json');
const UPDATES_FILE = path.join(__dirname, 'updates.json');
const TRADES_FILE = path.join(__dirname, 'trades.json');

// --- Helper Functions ---
const readJSON = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return data ? JSON.parse(data) : [];
        }
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e);
    }
    return [];
};

const writeJSON = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(`Error writing ${filePath}:`, e);
    }
};

// Inisialisasi File
if (!fs.existsSync(DB_FILE)) writeJSON(DB_FILE, []);
if (!fs.existsSync(MODULES_FILE)) writeJSON(MODULES_FILE, []);
if (!fs.existsSync(UPDATES_FILE)) writeJSON(UPDATES_FILE, []);
if (!fs.existsSync(TRADES_FILE)) writeJSON(TRADES_FILE, []);

// --- Konfigurasi Upload ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, 'downloads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- ENDPOINTS ---

// 1. Register
app.post('/api/register', (req, res) => {
    try {
        const { name, wa } = req.body;
        const users = readJSON(DB_FILE);
        users.push({ name, wa, date: new Date().toISOString() });
        writeJSON(DB_FILE, users);
        res.json({ message: 'Berhasil' });
    } catch (err) {
        res.status(500).json({ message: 'Error Register' });
    }
});

// 2. Member Count
app.get('/api/member-count', (req, res) => {
    const users = readJSON(DB_FILE);
    res.json({ count: users.length });
});

// 3. Admin Data (Login & Get Data)
app.post('/api/admin/data', (req, res) => {
    try {
        if (req.body.password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ success: false, message: 'Password salah!' });
        const users = readJSON(DB_FILE);
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data' });
    }
});

// 4. Admin Delete User (PENTING: Pastikan ini ada)
app.delete('/api/admin/delete', (req, res) => {
    try {
        let users = readJSON(DB_FILE);
        users = users.filter(u => u.wa !== req.body.wa);
        writeJSON(DB_FILE, users);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Gagal menghapus user' });
    }
});

// 5. Get Modules
app.get('/api/modules', (req, res) => {
    const modules = readJSON(MODULES_FILE);
    res.json(modules);
});

// 6. Admin Upload Module
app.post('/api/admin/upload', upload.single('file'), (req, res) => {
    try {
        const { password, title, description, isPremium, filePassword } = req.body;
        if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ success: false, message: 'Password salah!' });
        
        const modules = readJSON(MODULES_FILE);
        modules.push({
            title, description,
            file: req.file ? req.file.filename : '',
            isPremium: isPremium === 'true',
            filePassword: filePassword || ''
        });
        writeJSON(MODULES_FILE, modules);
        res.json({ success: true, message: 'Upload Berhasil' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error saat Upload' });
    }
});

// 7. Admin Delete Module (PENTING: Pastikan ini ada)
app.delete('/api/admin/modules', (req, res) => {
    try {
        if (req.body.password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ success: false, message: 'Password salah!' });
        
        if (!req.body.filename) return res.status(400).json({ success: false, message: 'Nama file tidak valid' });

        const filename = path.basename(req.body.filename); // Sanitize filename to prevent path traversal
        let modules = readJSON(MODULES_FILE);

        // Hapus file fisik
        const filePath = path.join(__dirname, 'downloads', filename);
        if (fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch(e) { console.error("Gagal hapus file fisik:", e.message); }
        }

        modules = modules.filter(m => m.file !== filename);
        writeJSON(MODULES_FILE, modules);
        res.json({ success: true });
    } catch (err) {
        console.error("Error delete module:", err);
        res.status(500).json({ success: false, message: 'Gagal hapus modul' });
    }
});

// 8. Get Updates
app.get('/api/updates', (req, res) => {
    const updates = readJSON(UPDATES_FILE);
    res.json(updates);
});

// 9. Admin Post Update
app.post('/api/admin/updates', upload.single('image'), (req, res) => {
    try {
        const { password, title, description } = req.body;
        if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ success: false, message: 'Password salah!' });
        
        const updates = readJSON(UPDATES_FILE);
        updates.unshift({
            title, description,
            image: req.file ? req.file.filename : '',
            date: new Date()
        });
        writeJSON(UPDATES_FILE, updates);
        res.json({ success: true, message: 'Update Berhasil' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error saat Post Update' });
    }
});

// 10. Admin Delete Update (PENTING: Pastikan ini ada)
app.delete('/api/admin/updates', (req, res) => {
    try {
        if (req.body.password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ success: false, message: 'Password salah!' });
        
        if (!req.body.image) return res.status(400).json({ success: false, message: 'Nama gambar tidak valid' });

        const image = path.basename(req.body.image); // Tambahkan path.basename untuk keamanan
        let updates = readJSON(UPDATES_FILE);

        const filePath = path.join(__dirname, 'downloads', image);
        if (fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch(e) { console.error("Gagal hapus gambar fisik:", e.message); }
        }

        updates = updates.filter(u => u.image !== image);
        writeJSON(UPDATES_FILE, updates);
        res.json({ success: true });
    } catch (err) {
        console.error("Error delete update:", err);
        res.status(500).json({ success: false, message: 'Gagal hapus update' });
    }
});

// 12. Get Trades (Riwayat Trade)
app.get('/api/trades', (req, res) => {
    const trades = readJSON(TRADES_FILE);
    res.json(trades);
});

// 13. Admin Post Trade
app.post('/api/admin/trades', upload.single('image'), (req, res) => {
    try {
        const { password, pair, result, description } = req.body;
        if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ success: false, message: 'Password salah!' });
        
        const trades = readJSON(TRADES_FILE);
        trades.unshift({
            pair,
            result,
            description,
            image: req.file ? req.file.filename : '',
            date: new Date()
        });
        writeJSON(TRADES_FILE, trades);
        res.json({ success: true, message: 'Riwayat Trade Berhasil Ditambahkan' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error saat Post Trade' });
    }
});

// 14. Admin Delete Trade
app.delete('/api/admin/trades', (req, res) => {
    try {
        if (req.body.password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ success: false, message: 'Password salah!' });
        
        const image = path.basename(req.body.image);
        let trades = readJSON(TRADES_FILE);
        const filePath = path.join(__dirname, 'downloads', image);
        if (fs.existsSync(filePath)) { try { fs.unlinkSync(filePath); } catch(e) {} }
        trades = trades.filter(t => t.image !== image);
        writeJSON(TRADES_FILE, trades);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Gagal hapus trade' });
    }
});

// 11. Download Premium Module
app.get('/api/download-premium', (req, res) => {
    const { filename, password } = req.query;
    
    if (!filename) return res.status(400).send('Filename diperlukan.');

    const modules = readJSON(MODULES_FILE);
    const moduleData = modules.find(m => m.file === filename);

    if (!moduleData) {
        return res.status(404).send('Modul tidak ditemukan.');
    }

    // Cek Password jika Premium
    if (moduleData.isPremium) {
        if (moduleData.filePassword && moduleData.filePassword !== password) {
            return res.status(403).send(`
                <!DOCTYPE html>
                <html style="background:#1a1a2e;color:white;font-family:sans-serif;text-align:center;height:100%;">
                <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;margin:0;">
                    <h1 style="color:#ef5350;">Password Salah!</h1>
                    <p>Password yang Anda masukkan tidak sesuai.</p>
                    <button onclick="history.back()" style="padding:10px 20px;background:#ef5350;color:white;border:none;border-radius:5px;cursor:pointer;">Coba Lagi</button>
                </body>
                </html>
            `);
        }
    }

    const filePath = path.join(__dirname, 'downloads', path.basename(filename));
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File fisik tidak ditemukan.');
    }
});

// Folder Static untuk download
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Routes untuk file HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '0.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
