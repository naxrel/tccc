const API_URL = '/api/notes'; // Karena dilayani oleh Express yang sama, cukup relatif path

let notes = [];
let activeId = null;
let editingId = null;

// --- ELEMENTS ---
const noteList = document.getElementById('noteList');
const noteCount = document.getElementById('noteCount');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');
const editorPanel = document.getElementById('editorPanel');
const viewPanel = document.getElementById('viewPanel');
const titleInput = document.getElementById('titleInput');
const bodyInput = document.getElementById('bodyInput');

// --- UTILS ---
const fmt = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short' }) + ' ' + 
           d.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
};

// --- CORE FUNCTIONS (API CALLS) ---

const fetchNotes = async () => {
    try {
        const q = searchInput.value.trim().toLowerCase();
        const res = await fetch(API_URL);
        const data = await res.json();
        
        // Filter lokal untuk search
        notes = q ? data.filter(n => n.judul.toLowerCase().includes(q) || n.isi.toLowerCase().includes(q)) : data;
        renderList();
    } catch (err) { console.error("Load failed", err); }
};

const renderList = () => {
    noteCount.textContent = `${notes.length} notes`;
    noteList.innerHTML = notes.map(n => `
        <div class="note-item ${n.id === activeId ? 'active' : ''}" onclick="openNote(${n.id})">
            <div class="note-item-title">${n.judul || 'Untitled'}</div>
            <div class="note-item-preview">${n.isi.substring(0, 40)}...</div>
            <div class="note-item-date">${fmt(n.tanggal_dibuat)}</div>
        </div>
    `).join('') || '<div style="padding:20px; text-align:center">No notes found</div>';
};

const openNote = (id) => {
    activeId = id;
    const n = notes.find(x => x.id === id);
    document.getElementById('viewTitle').textContent = n.judul;
    document.getElementById('viewBody').textContent = n.isi;
    document.getElementById('viewMeta').textContent = `Created ${fmt(n.tanggal_dibuat)}`;
    showPanel('view');
    renderList();
};

const showPanel = (p) => {
    emptyState.style.display = p === 'empty' ? 'flex' : 'none';
    editorPanel.style.display = p === 'editor' ? 'flex' : 'none';
    viewPanel.style.display = p === 'view' ? 'flex' : 'none';
};

// --- EVENTS ---

document.getElementById('newBtn').onclick = () => {
    editingId = null;
    titleInput.value = '';
    bodyInput.value = '';
    showPanel('editor');
};

document.getElementById('saveBtn').onclick = async () => {
    const payload = { judul: titleInput.value, isi: bodyInput.value };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    editingId = null;
    fetchNotes();
    showPanel('empty');
};

document.getElementById('editBtn').onclick = () => {
    const n = notes.find(x => x.id === activeId);
    editingId = n.id;
    titleInput.value = n.judul;
    bodyInput.value = n.isi;
    showPanel('editor');
};

document.getElementById('deleteBtn').onclick = async () => {
    if(!confirm('Delete?')) return;
    await fetch(`${API_URL}/${activeId}`, { method: 'DELETE' });
    activeId = null;
    fetchNotes();
    showPanel('empty');
};

document.getElementById('cancelBtn').onclick = () => showPanel('empty');
searchInput.oninput = fetchNotes;

// --- INIT ---
fetchNotes();