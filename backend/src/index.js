import http from 'http';
import express from 'express';
import { Server } from 'colyseus';
import cors from 'cors';
import regeneratorRuntime from "regenerator-runtime";

import { monitor } from '@colyseus/monitor';
//const socialRoutes = require("@colyseus/social/express").default;
import playGround from './Room/PlayGround';

const port = process.env.PORT || 2567;
const app = express();
app.use(cors());
const server = http.createServer(app);
const gameServer = new Server({ server });

const Rank = require("../models/Rank")
const mongoose = require("mongoose")
const playboradRoutes = express.Router()


mongoose.connect('mongodb://127.0.0.1:27017/ranking', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})
app.use("/ranks",playboradRoutes)
/*
app.post('/playborad', (req, res) => {
    console.log('Inside the homepage callback')
    res.send(`Helle\n`)
    console.log(req.body)
    let rank = new Rank(req.body);
    rank.save()
        .then(post=>{
            res.send("in the function")
            res.status(200).json({'rank':'rank add successfully'})
            })
        .catch(err=>
            res.status(400).send("rank error"))
  })*/
  /*
app.post('/playborad',(req,res)=>{
    console.log("posttt")
    res.send("post")
})*/
/*
playboradRoutes.get('/',function(req,res,next){
    res.send("respond with rescorce")
})*/
playboradRoutes.route('/playborad').get(function(req,res){
    res.send("route get")
})

playboradRoutes.route('/playborad').post(function(req, res) {
    let rank = new Rank(req.body);
    rank.save()
        .then(post => {
            res.status(200).json({'rank': 'rank added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new rank failed');
        });
});
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
