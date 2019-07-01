import http from 'http';
import express from 'express';
import { Server } from 'colyseus';
import cors from 'cors';
import regeneratorRuntime from "regenerator-runtime";

import { monitor } from '@colyseus/monitor';
//const socialRoutes = require("@colyseus/social/express").default;
import playGround from './Room/PlayGround';
const bodyParser = require("body-parser")
const port = process.env.PORT || 2567;
const app = express();
app.use(cors());

const server = http.createServer(app);
const gameServer = new Server({ server });

let Rank = require("../models/Rank")
const mongoose = require("mongoose")
const playboradRoutes = express.Router()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));


mongoose.connect('mongodb://127.0.0.1:27017/ranking', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})
//

playboradRoutes.route('/').get(function(req,res){
    Rank.find(function(err,ranks){
        if(err){
            console.log("errrrror",err)
        }
        else{
            res.json(ranks)
        }
    })
 
})


playboradRoutes.route('/playborad').post(function(req, res) {
    let rank = new Rank(req.body);
    rank.save()
        .then(post => {
            console.log("hi",req.body)
            res.status(200).json({'rank': 'rank added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new rank failed');
        });
});
app.use("/ranks",playboradRoutes)
// register your room handlers
/*
There could be many rooms in a single registrant
each room follows its handler's rule
In this line for example, it said registrant game_room_handler
could have many rooms and each room follows handler playGround's 
pattern.
*/
gameServer.register('game_room_handler', playGround);

// register @colyseus/social routes
//app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor(gameServer));

gameServer.listen(port);
console.log(`Listening on ws://localhost:${ port }`)
