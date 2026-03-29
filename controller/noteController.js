const db = require('../config/db');

// 1. Ambil semua catatan (READ)
exports.getAllNotes = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM notes ORDER BY tanggal_dibuat DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Gagal mengambil data: " + err.message });
    }
};

// 2. Tambah catatan baru (CREATE)
exports.createNote = async (req, res) => {
    const { judul, isi } = req.body;
    try {
        if (!judul || !isi) {
            return res.status(400).json({ error: "Judul dan isi tidak boleh kosong" });
        }
        await db.query('INSERT INTO notes (judul, isi) VALUES (?, ?)', [judul, isi]);
        res.status(201).json({ message: "Catatan berhasil disimpan ke Cloud SQL" });
    } catch (err) {
        res.status(500).json({ error: "Gagal menyimpan data: " + err.message });
    }
};

// 3. Update catatan (UPDATE)
exports.updateNote = async (req, res) => {
    const { id } = req.params;
    const { judul, isi } = req.body;
    try {
        const [result] = await db.query('UPDATE notes SET judul = ?, isi = ? WHERE id = ?', [judul, isi, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Catatan tidak ditemukan" });
        }
        res.json({ message: "Catatan berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ error: "Gagal update data: " + err.message });
    }
};

// 4. Hapus catatan (DELETE)
exports.deleteNote = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM notes WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Catatan tidak ditemukan" });
        }
        res.json({ message: "Catatan berhasil dihapus dari Cloud SQL" });
    } catch (err) {
        res.status(500).json({ error: "Gagal menghapus data: " + err.message });
    }
};