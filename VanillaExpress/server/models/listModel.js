const {Schema, model} = require('mongoose');

const listSchema = new Schema({
    ownerId: {
        type: Schema.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    done: {
        type: Boolean,
        required: true
    }
}, {timestamps: true});

module.exports = model('lists', listSchema);