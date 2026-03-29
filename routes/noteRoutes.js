const express = require('express');
const router = express.Router();
const noteController = require('../controller/noteController');

// URL: /api/notes/
router.get('/', noteController.getAllNotes);

// URL: /api/notes/
router.post('/', noteController.createNote);

// URL: /api/notes/:id
router.put('/:id', noteController.updateNote);

// URL: /api/notes/:id
router.delete('/:id', noteController.deleteNote);

module.exports = router;