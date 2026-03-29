const express = require('express');
const cors = require('cors');
const path = require('path');
const noteRoutes = require('./routes/noteRoutes');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
app.use(cors()); // Mengizinkan akses dari browser
app.use(express.json()); // Agar bisa membaca body request format JSON
app.use(express.urlencoded({ extended: true }));

// --- SERVE FRONTEND ---
// Ini penting agar saat buka localhost:3000, file index.html di /public langsung muncul
app.use(express.static(path.join(__dirname, 'public')));

// --- ROUTES ---
app.use('/api/notes', noteRoutes);

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`DB Host: ${process.env.DB_HOST}`);
    console.log(`=================================`);
});