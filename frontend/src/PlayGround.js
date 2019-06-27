import React, { Component }from 'react'
import { Client } from 'colyseus.js'
import { Button, Form, FormGroup, Input } from 'reactstrap'

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

  create = () => {
    this.room = this.client.join('game_room_handler', { create: true });
    this.room.onStateChange.add((state) => {
      console.log("the room state has been updated:", state);
    });

    // change client's frontend status
    this.room.onJoin.addOnce(() => {
      console.log("creating " + this.room.id);
      // this state update is async, so it needs the state as arg.
      this.setState((state) => ({
        roomID: this.room.id,
        createRoom: true
      }));
    })
  }

  submitHandler = (event) => {
    event.preventDefault();
    this.room = this.client.join(this.state.submit);

    // notify this client whenever a new client join
    this.room.onJoin.add(() => {
      console.log(this.room.id + ' joined');
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


  render() {
    this.client.onOpen.add(() => {
      console.log("onOpen")
    });

    return(
      <>
        <h1>Play Ground</h1>
        {
            /*
            create new game or join by id or return if in game
            */
          this.state.createRoom ?
            (<>
              <h2>your room ID:{this.state.roomID} send it to your friends, if you have</h2>
              <Button>Return Back Game</Button>
            </>)
              :
            (<>
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
    )
  }
}

export default PlayGround;
