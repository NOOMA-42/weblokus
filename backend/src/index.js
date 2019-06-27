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
