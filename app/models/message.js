/**
 * Created by JohnWu on 2016-11-12.
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('Message', {
    author: {
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: ''
    },
    emoji: {
        type: String,
        default: ''
    }
});