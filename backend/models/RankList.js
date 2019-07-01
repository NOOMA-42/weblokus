const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RankList = new Schema({
    ranks:[{
        rank:{
            rank_user:{type:String},
            rank_score:{type:Number}
        }
    }]
});

module.exports = mongoose.model('RankList', RankList);