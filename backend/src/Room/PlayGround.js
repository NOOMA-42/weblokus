import { Room, serialize, FossilDeltaSerializer } from "colyseus";
import { Schema, type, MapSchema  } from "@colyseus/schema";
/*
importing regeneratorRuntime is to use async/await in bundling
*/
import regeneratorRuntime from "regenerator-runtime";
/*
https://discuss.colyseus.io/topic/52/version-0-9-0-has-been-released/2
points out we shouldn't use babel node (nodemon --exec babel node ..) to run script, or following error
colyseus.js: server error: Class constructor Room cannot be invoked without 'new'
will happen.
*/

class playGround extends Room{
    constructor(options) {
        super(options);
    }

    onInit(options) {
        this.maxClients = 2;
        this.setState(new roomStatus());
        console.log("CREATING NEW ROOM");
    }

    onJoin (client, options, auth) {
        console.log("JOINING ROOM");
        this.state.players[client.sessionId] = new Player();
        this.state.players[client.sessionId].connected = true;
        console.log("join " + client.id);
        
        let gameCanStart = this.hasReachedMaxClients();
        if(gameCanStart){
            this.state.waitingForUser = false;
            // broadcast a message to all clients
            this.broadcast("gameCanStart");
        }
    }

    requestJoin (options, isNewRoom) {
        return (options.create)
            ? (options.create && isNewRoom)
            : this.clients.length > 0;
    }

    onMessage (client, message) {
        // broadcast a message to all clients
        console.log("broadcast to all the clients")
        console.log(message);
        this.broadcast(message,{ except: client });
    }

    async onLeave(client, consented) {
        // flag client as inactive for other users
        //this.state.players[client.sessionId].connected = false;

        try {
            if (consented) {
                throw new Error("consented leave");
            }

            // allow disconnected client to rejoin into this room until 20 seconds
            await this.allowReconnection(client, 20);

            // client returned! let's re-activate it.
            this.state.players[client.sessionId].connected = true;

        } catch (e) {

            // 20 seconds expired. let's remove the client.
            delete this.state.players[client.sessionId];
        }

        console.log("ChatRoom: ", client.sessionId, "left!");
    }
    
    // useless function
    onDispose () {
        delete this.state.players;
        console.log("Dispose: " + this.state)        
    }
    
}

/*
warm reminder:
    field not initialised in constructor is default undefined
*/
class Player extends Schema {
}
type("boolean")(Player.prototype, "connected");

class roomStatus extends Schema {
    constructor() {
        super();
        this.players = new MapSchema();
        this.waitingForUser = true;
    }
}
type("boolean")(roomStatus.prototype, "waitingForUser");
type("string")(roomStatus.prototype, "currentTurn");
type({ map:Player })(roomStatus.prototype, "players");

export default playGround;
