const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    text: String,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const Note = mongoose.model('Note', NoteSchema)

module.exports = Note
