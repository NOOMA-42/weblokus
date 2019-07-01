const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Rank = new Schema({
    rank_user: {
        type: String
    },
    post_score:{
        type: Number
    }
});

module.exports = mongoose.model('Rank', Rank);