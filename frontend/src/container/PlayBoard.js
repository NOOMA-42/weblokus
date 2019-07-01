//Library
import React from 'react';
import Popup from "reactjs-popup";
import BlockUi from 'react-block-ui';
import { Container, Row, Col, Button } from 'reactstrap';
import 'react-block-ui/style.css';

// Components
import PlayingArea from '../components/maps/PlayingArea';
import RighSidePuzzleContainer from '../components/view/RighSidePuzzleContainer';

// Config
import { pieceSet, puzzleSet } from '../components/puzzles/puzzle.config';
import { Move, PASS } from '../methods/move';
// Class
import { Board } from '../methods/board';

//image
import capoo from '../assets/image/hi.jpeg';
var blocking = false ;
const SCALE = 30;
const VIOLET_MASK = 0x07;
const ORANGE_MASK = 0x70;
const VIOLET_EDGE = 0x01;
const ORANGE_EDGE = 0x10;
const VIOLET_SIDE = 0x02;
const ORANGE_SIDE = 0x20;
const VIOLET_BLOCK = 0x04; // 0000 0100
const ORANGE_BLOCK = 0x40;  // 0100 0000

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
var haventSetListener = true, toSendMessage = false, initialize = true;
var playerID;

function containerOffset(e) {
        let x = e.currentTarget.offsetLeft;
        let y = e.currentTarget.offsetTop;
        return { x, y };
}
// player   0:自己  1:對方
class WebLokus extends React.Component {
        constructor(props) {
                super(props);
                this.square = [];
                for (let y = 0; y < 14; y++) {
                        this.square[y] = [];
                        for (let x = 0; x < 14; x++)
                                this.square[y][x] = 0;
                }
                this.square[0][0] = VIOLET_EDGE;
                this.square[13][13] = ORANGE_EDGE;
                this.history = [];
                this.used = new Array(21 * 2);
                this.used.fill(false)
                this.board = new Board();
                this.drag = this.drag.bind(this);
                this.click = this.click.bind(this);
                this.dblclick = this.dblclick.bind(this);
//                this.toggleBlocking = this.toggleBlocking.bind(this);
                this.state = {
                        playerId: 1, // 0,1
                        ownScore: undefined,
                        opponentScore: undefined,
                        boardInfo: this.square,
                        blockUsed: this.used,
                        history: this.history,
                        receiveMsg: false,
                        test: ""
                        //currentBoard: this.board
                }
                return true;
        }
        inBounds = (x, y) => { return (x >= 0 && y >= 0 && x < 14 && y < 14); }
        turn = () => { return this.state.history.length % 2 ; }
        colorAt = (x, y) => {
                if (this.state.boardInfo[y][x] & VIOLET_BLOCK) {
                        return 'violet';
                }
                if (this.state.boardInfo[y][x] & ORANGE_BLOCK) {
                        return 'orange';
                }
                return null;
        }
        isValidMove = (move) => {
                if (move.isPass()) {
                        return true;
                }
                if (this.state.blockUsed[move.blockId() + playerID * 21]) {
                        return false;
                }
                let coords = move.coords();
                if (!this.isMovable(coords)) {
                        return false;
                }
                for (let i = 0; i < coords.length; i++) {
                        if (this.state.boardInfo[coords[i].y][coords[i].x] &
                                [VIOLET_EDGE, ORANGE_EDGE][playerID]) {
                                return true;
                        }
                }
                return false;
        }
        doMove = (move) => {
                if (move.isPass()) {
                        this.state.history.push(move);
                        return;
                }
                let coords = move.coords();
                console.log(coords);
                let block = [VIOLET_BLOCK, ORANGE_BLOCK][playerID];
                let side_bit = [VIOLET_SIDE, ORANGE_SIDE][playerID];
                let edge_bit = [VIOLET_EDGE, ORANGE_EDGE][playerID];
                for (let i = 0; i < coords.length; i++) {
                        let { x, y } = coords[i];
                        this.state.boardInfo[y][x] |= block;
                        if (this.inBounds(x - 1, y))
                                this.state.boardInfo[y][x - 1] |= side_bit;
                        if (this.inBounds(x, y - 1))
                                this.state.boardInfo[y - 1][x] |= side_bit;
                        if (this.inBounds(x + 1, y))
                                this.state.boardInfo[y][x + 1] |= side_bit;
                        if (this.inBounds(x, y + 1))
                                this.state.boardInfo[y + 1][x] |= side_bit;
                        if (this.inBounds(x - 1, y - 1))
                                this.state.boardInfo[y - 1][x - 1] |= edge_bit;
                        if (this.inBounds(x + 1, y - 1))
                                this.state.boardInfo[y - 1][x + 1] |= edge_bit;
                        if (this.inBounds(x - 1, y + 1))
                                this.state.boardInfo[y + 1][x - 1] |= edge_bit;
                        if (this.inBounds(x + 1, y + 1))
                                this.state.boardInfo[y + 1][x + 1] |= edge_bit;
                }
                this.state.blockUsed[move.blockId() + playerID * 21] = true;
                this.state.history.push(move);
        }
        score = (player) => {
                let score = 0;
                for (let i = 0; i < 21; i++) {
                        if (this.state.blockUsed[i + player * 21])
                                score += puzzleSet[i].size;
                }
                return score;
        }
        isMovable = (coords) => {
                let mask = (VIOLET_BLOCK | ORANGE_BLOCK) |
                        [VIOLET_SIDE, ORANGE_SIDE][playerID];
                for (let i = 0; i < coords.length; i++) {
                        let { x, y } = coords[i];
                        //                        console.log(`this.square[y][x] & mask : ${ this.square[y][x] & mask}`) ;
                        if (x < 0 || x >= 14 || y < 0 || y >= 14 || this.state.boardInfo[y][x] & mask)
                                return false;
                }
                return true;
        }
        doPass = () => { this.state.history.push(PASS); }
        isUsed = (player, blockId) => {
                return this.state.blockUsed[blockId + player * 21];
        }
        canMove = () => {
                for (let p in pieceSet) {
                        let id = pieceSet[p].id;
                        if (this.state.blockUsed[(id >> 3) + playerID * 21])
                                continue;
                        for (let y = 0; y < 14; y++) {
                                for (let x = 0; x < 14; x++) {
                                        if (this.isValidMove(new Move(x, y, id)))
                                                return true;
                                }
                        }
                }
                return false;
        }
        getPath = () => { return this.state.history.join('/'); }
        //

        update() {
                for (let y = 0; y < 14; y++) {
                        for (let x = 0; x < 14; x++) {
                                let col = this.colorAt(x, y);
                                if (!col) continue;
                                let id = 'board_' + x.toString(16) + y.toString(16);
                                let cell = document.getElementById(id);
                                if (!cell) continue;
                                if( cell.className.indexOf ('block0') >= 0 || cell.className.indexOf ('block1') >= 0 ) 
                                        continue ;
                                let cls = 'block' + playerID;
                                cell.classList.add(cls);
                        }
                }

                let currentScore = this.score(playerID);
                let opponentCurrentScore = this.score(playerID === 0 ? 1 : 0);
                if (currentScore + opponentCurrentScore !== 0) {
                        this.setState((prevState) => ({
                                ownScore: currentScore,
                                opponentScore: opponentCurrentScore,
                                boardInfo: this.state.boardInfo,
                                blockUsed: this.state.blockUsed,
                                history: this.state.history
                        }), () => {
                                var { roomToSendMsg } = require('./PlayGround');
//                                console.log(`send boardInfo : ${this.state.boardInfo} ${this.state.blockUsed}`);
                                sendMessageToServer(roomToSendMsg, 
                                        this.state.boardInfo, this.state.blockUsed, this.state.history
                                );
                        }
                        );
                }

                //                console.log(`currentScore: ${this.board.score(0)} opponentCurrentScore: ${this.board.score(1)}`);
        }

        updateBoardColor() {
                for (let y = 0; y < 14; y++) {
                        for (let x = 0; x < 14; x++) {
                                let col = this.colorAt(x, y);
                                if (!col) continue;
                                let id = 'board_' + x.toString(16) + y.toString(16);
                                let cell = document.getElementById(id);
                                if (!cell) continue;
                                if( cell.className.indexOf ('block0') >= 0 || cell.className.indexOf ('block1') >= 0 ) 
                                        continue ;
                                let cls = 'block' + playerID;
                                cell.classList.add(cls);
                        }
                }
        }

        onPlayerMove(move) {
                this.doMove(move);
                this.update();
                
                if (!this.canMove()) {
                        console.log('inside the onplayermove if');
                        this.gameEnd();
                }
        }

        gameEnd() {
                let elem = document.getElementById("message");
                if (this.state.ownScore > this.state.opponentScore) {
                        elem.innerHTML = ('Your: ' + this.state.ownScore + ' Opponent:  ' + this.state.opponentScore + ' so you win');
                }
                else if (this.state.ownScore < this.state.opponentScore) {
                        elem.innerHTML = ('Your: ' + this.state.ownScore + ' Opponent:  ' + this.state.opponentScore + ' so you lose');
                }
                else {
                        elem.innerHTML = ('Your: ' + this.state.ownScore + ' Opponent:  ' + this.state.opponentScore + ' so tie');
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
                if (this.inBounds(x, y)) return { x, y };
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
                        if (bpos && this.isValidMove(new Move(bpos.x, bpos.y, pieceId))) {
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
                                console.log(`this.board.isValidMove(move): ${this.isValidMove(move)}`);
                                if (this.isValidMove(move)) {
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
                        test: this.state.boardInfo
                })
                toSendMessage = true;
        }


        render() {
                /* 
                require moment:
                1. first time rendering
                2. right after player update local state: boardInfo
                drawback: the room will be required everytime.
                */
                var { roomToSendMsg, ID } = require('./PlayGround');
                playerID = ID;
                if (initialize) {

                        listenMessageFromServer(roomToSendMsg, this);
                        console.log("client listen to message from server!");
                        initialize = false;
                }
                /**
                     *
                if you wanna send more data you should pack it in a bigger object then parse it yourself,
                you send what object to server you'll get the same one (by listenMessageFromServer setState)
                     *
                */
                console.log("here")
                if( this.turn() !== playerID ) {
                        blocking = true;
                } else {
                        blocking = false;
                }
                /// second row is for testing, if you dont wanna test  delete it 
                this.updateBoardColor();
                return (
                        <BlockUi tag="div" blocking={blocking} message="It is not your turn!!!!!!!!">
                        <Container>
                                <Row>
                                        <Col xs="2"><img src={capoo} style={{ width: 150, margin: 40 }} /></Col>
                                        <Col xs="7">
                                                <PlayingArea boardInf={this.state.boardInfo} />
                                        </Col>
                                        <Col xs="3">
                                                
                                                <RighSidePuzzleContainer onMouseDown={this.drag} onClick={this.click} onDoubleClick={this.dblclick} playerId={playerID} />
                                                
                                        </Col>
                                </Row>
                                <Row>
                                        <Popup trigger={<Button > Game Rules </Button>} modal>
                                                <div>
                                                        <div className="header"> Game Rules </div>
                                                        <div className="content">
                                                                <ul>
                                                                        <li>1.自己的拼圖與拼圖需角對角放 不可碰到邊</li>
                                                                        <li>2.紫色玩家從最左上角開始放, 橘色玩家從最右下角開始放</li>
                                                                        <li>3.按shift+滑鼠點擊可以旋轉拼圖，雙擊兩下可以翻拼圖</li>
                                                                        <li>4.分數的計算方式是看你下了多少個拼圖</li>
                                                                        <li>5.當有一方沒得放的時候就結束</li>
                                                                        <li>6.放置可能會感應不太到：（（（我很抱歉 如果確定是合法的就多移移看</li>
                                                                </ul>
                                                        </div>
                                                </div>
                                        </Popup>
                                        <Col xs="6">
                                                <div ><span id="message">Playing......</span></div>
                                        </Col>
                                </Row>
                        </Container >
                        </BlockUi>
                );
        }
}

export default WebLokus;

// update -> return  所以沒改變 
// puzzle 也要改變
