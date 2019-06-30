import React, { Component }from 'react'
import { Client } from 'colyseus.js'
import { Jumbotron,Button, Form, FormGroup, Input } from 'reactstrap'
import { DataChange } from '@colyseus/schema'
import { AwesomeButton,AwesomeButtonProgress } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";
import PlayBoard from './PlayBoard';
import {CopyToClipboard} from 'react-copy-to-clipboard';

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
    console.log("createee")
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
      
      <div style={{margin:'20px 20%',padding:"10%",textAlign:"center"}}>
       
        <h1>WebLoKus</h1>
        <div className="playground">
              
        <Form onSubmit={this.submitHandler} style={{padding:'3%'}}>
          <FormGroup >
            <div>
            <Input
              type="text"
              name="roomID"
              id="roomID"
              value={this.state.submit}
              placeholder="enter room ID"
              onChange={e => this.setState({ submit: e.target.value })}
            />
            <AwesomeButton type="submit" style={{color:"orange"}}>
            Let's go!
            </AwesomeButton>

            </div>
            
              
             
            
          </FormGroup>
        </Form>
        </div>

        <div className ="createRoom">
          <small style={{padding:"2% 3%"}}>Don't have a room? <br/>click here to get a new room ID</small>
        <br/>
        <AwesomeButton onPress={this.create} style={{margin:"12px"}} type="primary">New Room</AwesomeButton>
        {this.state.createRoom?
        <div className="playground">
          <Jumbotron style={{padding:"3px"}}>
          <small>your room ID:  </small>{this.state.roomID}<br/>
          <hr/>
          <small style={{height:"1px"}}>Share with your friends,<br/> well, if you have one...</small>
          <CopyToClipboard text={this.state.roomID}
          onCopy={() => this.setState({copied: true})}>
            
          <button type="primary" style={{color:"black",height:"40px",padding:"0 4px",alignItems:"right"}}>
            {this.state.copied?<small>copied</small>:<small>copy</small>}
          </button>
        </CopyToClipboard>
      </Jumbotron>
          </div>:<div/>}
        </div>

        <hr/>
        
      <small>testing functions below</small>
      <div>
        <AwesomeButton onPress={this.available} type="secondary">available</AwesomeButton>
        <AwesomeButton onPress={this.join} type="secondary">join</AwesomeButton>    
      </div>
          
     

      </div>
        
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



