import React, { Component }from 'react'
import { Client } from 'colyseus.js'
import { Button, Form, FormGroup, Input } from 'reactstrap'
import { DataChange } from '@colyseus/schema'
import PlayBoard from './PlayBoard';

var roomToSendMsg;

class PlayGround extends Component{
  constructor() {
    super();
    // use current hostname/port as colyseus server endpoint
    const endpoint = (window.location.hostname.indexOf("herokuapp") === -1)
      ? "ws://localhost:2567" // development (local)
      : window.location.protocol.replace("http", "ws") + "//" + window.location.hostname; // production (remote)

    // once entering lobby (this route) the new client will be created
    this.client = new Client(endpoint);
    this.state = {
      roomID: undefined,
      waitingForUser: true,
      createRoom: false
    }
  }

  /*
  The player will either gain the room object from creating the room or joining the room.
  Thus some of the function appear twice.
  */
  // Those who join game by creating room will go through this
  create = () => {
    this.room = this.client.join('game_room_handler', { create: true });
    
    /* to be used: same as state.onChange
    this.room.onStateChange.add((state) => {
      console.log("the room state has been updated:", state);
    });
    */  
    // notify this client whenever a new client join
    this.room.onJoin.add(() => {
      // detect change on backend state and update frontend state
      
      // to be used
      /*
      this.room.state.onChange = (changes) => {
        changes.forEach(change => {
            console.log("state on change");
            console.log(change);
            
          change packs only field value prevvalue
          value prev: Map Schema
          field: Player
            
            console.log("MMM"+change.field);
            console.log("MMM"+change.value);
            console.log("MMM"+change.previousValue);
        });
    };
      
      
      this.room.state.players.onAdd = (player, key) => {
        // player is schema object
        console.log("onAdd: ");
        console.log("key: "+key) // player session ID
        console.log(player, "has been added at", key);
    
        // add your player entity to the game world!
    
        // If you want to track changes on a child object inside a map, this is a common pattern:
        player.onChange = function(changes) {
          console.log("onChange: ")
            changes.forEach(change => {
                console.log(change);// only include field value prevValue
                console.log("onChange: "+change.field); // connected
                console.log("onChange: "+change.value);// true
                console.log("onChange: "+change.previousValue); // undefined
            })
        };
    
        // force "onChange" to be called immediatelly
        player.triggerAll();
    };
    */
    })
    
    // change client's frontend status
    this.room.onJoin.addOnce(() => {
      console.log("creating " + this.room.id);
      // this state update is async, so it needs the state as arg.
      this.setState((state) => ({
        roomID: this.room.id,
        createRoom: true
      }));
    })

    this.room.onMessage.add((message) => {
      if (message === "gameCanStart") {
        this.setState((state) => ({
          waitingForUser: false,
        }));
      }
    });

    // for playboard to access
    roomToSendMsg = this.room;
  }

  // Those who join game by searching ID will go through this
  submitHandler = (event) => {
    event.preventDefault();
    this.room = this.client.join(this.state.submit);

    // change client's frontend status
    this.room.onJoin.addOnce(() => {
      console.log("creating " + this.room.id);
      // this state update is async, so it needs the state as arg.
      this.setState((state) => ({
        roomID: this.room.id,
        createRoom: true,
      }));
    })

    this.room.onMessage.add((message) => {
      if (message === "gameCanStart") {
        this.setState((state) => ({
          waitingForUser: false,
        }));
      }
    });

    roomToSendMsg = this.room;
  }

  

  // *testing functionalities
  // join 1st room
  join = () => {
    var r = this.client.join('game_room_handler');
    r.onJoin.add(() => {
      console.log(r.id + ' joined');
      this.client.getAvailableRooms("game_room_handler", (rooms, err) => {
        console.log(rooms)
      });
    })
  }

  available = () => {
    this.client.getAvailableRooms("game_room_handler", (rooms, err) => {
      if (err) console.error(err);
      rooms.forEach((room) => {
        console.log(room.roomId);
        console.log(room.clients);
        console.log(room.maxClients);
        console.log(room.metadata);
      });
    });
  }

  renderPlayGround() {
    //create new game or join by id or return if in game
    return (
      <>
        <h1>Play Ground</h1>
        {    
          this.state.createRoom ? (
          <>
          <h2>your room ID:{this.state.roomID} send it to your friends, if you have</h2>
          <Button>Return Back Game</Button>
          </>
          ):(<>
          <h2>2 entries into game</h2>
          <Button onClick={this.create}>New Room</Button>
          <Form onSubmit={this.submitHandler}>
            <FormGroup row>
              <Input
                type="text"
                name="roomID"
                id="roomID"
                value={this.state.submit}
                placeholder="enter room ID"
                onChange={e => this.setState({ submit: e.target.value })}
              />
              <Button type="submit" color="primary">
                Let's go!
            </Button>
            </FormGroup>
          </Form>
          </>)
        }
        <h1>testing functions below</h1>
        <Button onClick={this.available}>available</Button>
        <Button onClick={this.join} >join</Button>
      </>
    );
  }

  render() {
    this.client.onOpen.add(() => {
      console.log("onOpen")
    });
    
    return(
      <>
        {
          this.state.waitingForUser ? this.renderPlayGround() : (<PlayBoard />)
        } 
      </>
    )
  }
}

export default PlayGround;


// for board to send message
export var roomToSendMsg = roomToSendMsg;

export function sendMessageToServer(room, boardInfo) {
  room.send(boardInfo);
}

export function listenMessageFromServer(room, boardObjectToSetState) {
  room.onMessage.add ( (newBoardInfo) => {
    console.log(`newBoardInfo: ${newBoardInfo.square}`) ;
    boardObjectToSetState.setState((state) => { boardInfo: newBoardInfo}, ()=>{
      console.log(boardObjectToSetState.state.boardInfo.square) ;
    }) ;
    });
}