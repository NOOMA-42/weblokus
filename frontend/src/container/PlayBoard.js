//Library
import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';

// Components
import PlayingArea from '../components/maps/PlayingArea';
import RighSidePuzzleContainer from '../components/view/RighSidePuzzleContainer';

// Config
import { puzzleSet } from '../components/puzzles/puzzle.config';

// Class
import { Board } from '../methods/board';
import { Move } from '../methods/move';

//image
import capoo from '../assets/image/hi.jpeg';
const SCALE = 30;

/*
20190628
this line of code below is to share room object to you,
you have put it the data and room, you'll send the board data
to backend. We have to use require to access this variable, since
require is dynamic and we have to wait for room being created.

here'll be another onMessage function which is asynchronous in 
order to receive message.
*/


/* 
sendMessage & receiveMessage interface
usage: 
        function sendMessageToServer(room, boardInfo)
        function listenMessageFromServer(room, boardObjectToSetState) ***not done yet
*/
import { sendMessageToServer, listenMessageFromServer } from './PlayGround';
var haventSetListener = true;

function containerOffset(e) {
        let x = e.currentTarget.offsetLeft;
        let y = e.currentTarget.offsetTop;
        return { x, y };
}
// player   0:自己  1:對方
class WebLokus extends React.Component {
        constructor(props) {
                super(props);
                this.board = new Board();
                this.drag = this.drag.bind(this);
                this.click = this.click.bind(this);
                this.dblclick = this.dblclick.bind(this);
                this.state = {
                        playerId: 0, // 0,1
                        ownScore: 0,
                        opponentScore: 0,
                        boardInfo: this.board
                }
        }

        update() {
                for (let y = 0; y < 14; y++) {
                        for (let x = 0; x < 14; x++) {
                                let col = this.state.boardInfo.colorAt(x, y);
                                if (!col) continue;
                                let id = 'board_' + x.toString(16) + y.toString(16);
                                let cell = document.getElementById(id);
                                if (!cell) continue;
                                let cls = 'block' + this.state.playerId;
                                cell.classList.add(cls);
                        }
                }

                let currentScore = this.state.boardInfo.score(0);
                let opponentCurrentScore = this.state.boardInfo.score(1);
                if (currentScore + opponentCurrentScore !== 0) {
                        console.log('hi');
                        this.setState({
                                ownScore: currentScore,
                                opponentScore: opponentCurrentScore,
                                boardInfo: this.state.boardInfo
                        });
                }
        }

        updateBoardColor() {
                console.log('updtae Board Color');
                for (let y = 0; y < 14; y++) {
                        for (let x = 0; x < 14; x++) {
                                let col = this.state.boardInfo.colorAt(x, y);
                                if (!col) continue;
                                let id = 'board_' + x.toString(16) + y.toString(16);
                                let cell = document.getElementById(id);
                                if (!cell) continue;
                                let cls = 'block' + this.state.playerId;
                                cell.classList.add(cls);
                        }
                }
        }
        onPlayerMove(move) {
                this.state.boardInfo.doMove(move);
                this.update();
                if (!this.state.boardInfo.canMove()) {
                        console.log('inside the onplayermove if') ;
                        this.gameEnd();
                }
                
        }

        gameEnd() {
                if (this.state.ownScore > this.state.opponentScore){
                        alert('You '+this.state.ownScore + ' and ' + this.state.opponentScore) ;
                }
                else if (this.this.state.ownScore < this.state.opponentScore){
                        alert('You '+this.this.state.ownScore + ' and ' + this.state.opponentScore) ;
                }
                else{
                        alert('You '+this.state.ownScore + ' and ' + this.state.opponentScore) ;
                }
                        
        }

        rotate(elem, dir, x, y) {
                function setClass(name) {
                        elem.classList.add(name);
                        setTimeout(() => elem.classList.remove(name), 16);
                }
                let direction = parseInt(elem.getAttribute('data-direction'));
                switch (dir) {
                        case 'left':
                                dir = (direction + [6, 2][direction & 1]) & 7;
                                setClass('rotate-left');
                                break;
                        case 'right':
                                dir = (direction + [2, 6][direction & 1]) & 7;
                                setClass('rotate-right');
                                break;
                        case 'flip':
                                dir = direction ^ 1;
                                setClass('rotate-flip');
                                break;
                        case 'cyclic':
                                if (direction == 1 || direction == 6) {
                                        dir = direction ^ 1;
                                        setClass('rotate-flip');
                                }
                                else {
                                        dir = direction + (direction & 1 ? -2 : 2);
                                        setClass('rotate-right');
                                }
                                break;
                }
                elem.setAttribute('data-direction', dir);
                let elemId = parseInt(elem.id.length == 3 ? elem.id[1] + elem.id[2] : elem.id[1]); // 變形ㄌ
                let rot = puzzleSet[elemId].rotations[dir];
                for (let i = 0; i < rot.size; i++) {
                        let child = elem.childNodes[i];
                        child.style.left = rot.coords[i].x * SCALE + 'px';
                        child.style.top = rot.coords[i].y * SCALE + 'px';
                }
                /*
                if (x != undefined) {
                        console.log('hi');
                        elem.style.left = x + 'px';
                        elem.style.top = y + 'px';
                }
                */
        }

        toBoardPosition(x, y) {
                let boardStyle = window.getComputedStyle(document.getElementsByClassName('board-border')[0]);
                let containerStyle = window.getComputedStyle(document.getElementsByClassName('container')[0]);
                let colOneStyle = window.getComputedStyle(document.getElementsByClassName('col-2')[0]);
                let colTwoStyle = window.getComputedStyle(document.getElementsByClassName('col-7')[0]);
                x -= parseFloat(containerStyle.marginLeft) + parseFloat(containerStyle.padding) + parseFloat(colOneStyle.width) + 2 * parseFloat(colOneStyle.padding) + parseFloat(boardStyle.marginLeft) + parseFloat(boardStyle.padding) + parseFloat(colTwoStyle.padding);
                y -= parseFloat(boardStyle.padding) + parseFloat(boardStyle.marginTop);
                x = Math.floor(x / 40);
                y = Math.floor(y / 40);
                if (this.state.boardInfo.inBounds(x, y)) return { x, y };
                else return null;
        }

        fromBoardPosition(pos) {
                let boardStyle = window.getComputedStyle(document.getElementsByClassName('board-border')[0]);
                let containerStyle = window.getComputedStyle(document.getElementsByClassName('container')[0]);
                let colOneStyle = window.getComputedStyle(document.getElementsByClassName('col-2')[0]);
                let colTwoStyle = window.getComputedStyle(document.getElementsByClassName('col-7')[0]);
                return {
                        x: pos.x * 40 + parseFloat(containerStyle.marginLeft) + parseFloat(containerStyle.padding) + parseFloat(colOneStyle.width) + 2 * parseFloat(colOneStyle.padding) + parseFloat(boardStyle.marginLeft) + parseFloat(boardStyle.padding) + parseFloat(colTwoStyle.padding),
                        y: pos.y * 40 + parseFloat(boardStyle.padding) + parseFloat(boardStyle.marginTop)
                };

        }


        dragPuzzles(e, clientX, clientY) {
                let elem = e.currentTarget;
                let elemId = parseInt(elem.id.length == 3 ? elem.id[1] + elem.id[2] : elem.id[1]);
                let deltaX = clientX - elem.offsetLeft;
                let deltaY = clientY - elem.offsetTop;
                elem.classList.add('dragging');
                e.stopPropagation();
                e.preventDefault();
                let moveHandler = (e, clientX, clientY) => {
                        e.stopPropagation();
                        let x = clientX - deltaX; //elem.offsetLeft
                        let y = clientY - deltaY; //elem.offsetTop
                        let bpos = this.toBoardPosition(clientX, clientY);
                        let pieceId = elemId << 3 | elem.getAttribute('data-direction');

                        if (bpos && this.state.boardInfo.isValidMove(new Move(bpos.x, bpos.y, pieceId))) {
                                let epos = this.fromBoardPosition(bpos);
                                elem.style.left = x + 'px';
                                elem.style.top = y + 'px';
                        }
                        else {
                                elem.style.left = x + 'px';
                                elem.style.top = y + 'px';
                        }
                };
                let mouseMove = (e) => {
                        moveHandler(e, e.clientX, e.clientY);
                };
                let upHandler = (e, clientX, clientY) => {
                        document.removeEventListener('mouseup', mouseUp, true);
                        document.removeEventListener('mousemove', mouseMove, true);
                        e.stopPropagation();
                        let bpos = this.toBoardPosition(clientX, clientY);
                        if (bpos) {
                                let move = new Move(bpos.x, bpos.y, elemId << 3 | elem.getAttribute('data-direction'));
                                console.log(`this.board.isValidMove(move): ${this.state.boardInfo.isValidMove(move)}`);
                                if (this.state.boardInfo.isValidMove(move)) {
                                        console.log('put on');
                                        elem.style.visibility = 'hidden';
                                        this.onPlayerMove(move);
                                }
                        }
                };
                let mouseUp = (e) => {
                        upHandler(e, e.clientX, e.clientY);
                };
                document.addEventListener('mousemove', mouseMove, true);
                document.addEventListener('mouseup', mouseUp, true);
        }

        drag(e) {
                this.dragPuzzles(e, e.clientX, e.clientY);
        }

        click(e) {
                if (!e.shiftKey)
                        return;
                let { x, y } = containerOffset(e);
                this.rotate(e.currentTarget, 'right', x, y);
        }

        dblclick(e) {
                if (e.shiftKey)
                        return;
                let { x, y } = containerOffset(e);
                this.rotate(e.currentTarget, 'flip', x, y);
        }


        //**** it's for testing    it's up to you to delete it or not */
        test = () => {
                this.setState({
                        boardInfo: "Miao"
                })
        }


        render() {
                /* 
                require moment:
                1. first time rendering
                2. right after player update local state: boardInfo
                drawback: the room will be required everytime.
                */
                var { roomToSendMsg } = require('./PlayGround');

                console.log('1');
                //only set listener once 
                /*
                if (haventSetListener) {
                        haventSetListener = false;
                        listenMessageFromServer(roomToSendMsg, this);
                        console.log("client listen to message from server!");
                } else {
                        console.log('ready to send message to server') ;
                        if (this.state.boardInfo !== undefined) {
                                console.log('send boardInfo to server');
                                console.log(`send boardInfo : ${this.state.boardInfo.square}`);
                                sendMessageToServer(roomToSendMsg, this.state.boardInfo);
                        }
                }
                */
                

                /** 
                     *
                if you wanna send more data you should pack it in a bigger object then parse it yourself,
                you send what object to server you'll get the same one (by listenMessageFromServer setState)
                     *
                */
                /// second row is for testing, if you dont wanna test  delete it 
                console.log(`this.state.boardInfo.square: ${this.state.boardInfo.square}`);
                this.updateBoardColor();

                return (
                        <Container>
                                <Row>
                                        <Col xs="2"><img src={capoo} style={{ width: 150, margin: 40 }} /></Col>
                                        <Col xs="7">
                                                <PlayingArea boardInf={this.state.boardInfo} />
                                        </Col>
                                        <Col xs="3">
                                                <RighSidePuzzleContainer onMouseDown={this.drag} onClick={this.click} onDoubleClick={this.dblclick} playerId={this.state.playerId} />
                                        </Col>
                                </Row>
                                <Row>
                                        <Button onClick={this.test}>test: Click it set new state of boardInfo </Button>
                                </Row>
                        </Container >
                );
        }
}

export default WebLokus;

