//Library
import React from 'react';
import { Container, Row, Col } from 'reactstrap';

// Components
import PlayingArea from '../components/maps/PlayingArea';
import View from '../components/view/RighSidePuzzleContainer';

// Config
import { puzzleSet } from '../components/puzzles/puzzle.config';

// Class
import { Board } from '../methods/board';
import { Move } from '../methods/move';

//image
import capoo from '../assets/image/hi.jpeg';
const SCALE = 30;

function containerOffset(e) {
        let x = e.currentTarget.offsetLeft;
        let y = e.currentTarget.offsetTop;
        return { x, y };
}
class WebLokus extends React.Component {
        constructor(props) {
                super(props);
                this.board = new Board();
                this.drag = this.drag.bind(this);
                this.click = this.click.bind(this);
                this.dblclick = this.dblclick.bind(this);
                this.state = {
                        playerId: 0, // 0,1
                        score: undefined,
                        boardInformation: undefined
                }
        }
        update() {
                let boardInfo = [];
                for (let y = 0; y < 14; y++) {
                        for (let x = 0; x < 14; x++) {
                                let col = this.board.colorAt(x, y); // 'violet' 'orange' 
                                if (!col) continue;
                                let id = 'board_' + x.toString(16) + y.toString(16);
                                let cell = document.getElementById(id);
                                let cls = col === 'violet' ? 'block0' : 'block1';
                                cell.classList.add(cls);
                        }
                }
                this.updateScore() ;
//                this.setState({ boardInformation: boardInfo });
        }

        updateScore() {
                let currentScore = this.board.score(0);
                this.setState({score: currentScore}) ;
        }

        onPlayerMove(move) {
                this.board.doMove(move);
                this.update();
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
                if (this.board.inBounds(x, y)) return { x, y };
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
                        console.log(`moveHandler: elemId: ${elemId} direction:${elem.getAttribute('data-direction')}`);
                        console.log(`moveHandler: elemId << 3 | elem.getAttribute('data-direction') = ${elemId << 3 | elem.getAttribute('data-direction')}`) ;
                        let pieceId = elemId << 3 | elem.getAttribute('data-direction');
                        console.log(`moveHandler: pieceId: ${pieceId}`);
                        
                        if (bpos && this.board.isValidMove(new Move(bpos.x, bpos.y, pieceId))) {
                                console.log('hello bpos and welcome epos');
                                let epos = this.fromBoardPosition(bpos);
                                console.log(`epos: ${epos.x}  ${epos.y}`) ;
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
                                console.log(`upHandler: clientX:${clientX} clientY:${clientY}`) ;
                                console.log(`upHandler: bpos.x:${bpos.x} bpos.y:${bpos.y}`) ;
                                console.log(`upHandler: elemId << 3 | elem.getAttribute('data-direction') : ${elemId << 3 | elem.getAttribute('data-direction')} `);
                                let move = new Move(bpos.x, bpos.y, elemId << 3 | elem.getAttribute('data-direction'));
                                console.log(`this.board.isValidMove(move): ${this.board.isValidMove(move)}`) ;
                                if (this.board.isValidMove(move)) {
                                        console.log('put on') ;
                                        elem.style.visibility = 'hidden';
                                        this.onPlayerMove(move);
                                }
                                /*
                                console.log(`this.board.isValidMove(move): ${this.board.isValidMove(move)}`) ;
                                elem.style.visibility = 'hidden';
                                this.onPlayerMove(move);
                                */

                                // 拼圖推最旁邊 顯示在最旁邊
                                // 拼圖放在合法地方消失
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

        render() {
                return (
                        <Container>
                                <Row>
                                        <Col xs="2"><img src={capoo} style={{ width: 150, margin: 40 }} /></Col>
                                        <Col xs="7">
                                                <PlayingArea />
                                        </Col>
                                        <Col xs="3">
                                                <View onMouseDown={this.drag} onClick={this.click} onDoubleClick={this.dblclick} playerId={this.state.playerId} />
                                        </Col>
                                </Row>
                        </Container >
                );
        }
}

export default WebLokus;

// 收到盤面資訊 reRender的function
// playerId 顏色問題
// 算分數 function 

/*
{
        board_00: {
                isOccupied : 0 or 1,
                className:  !className
        },
}
*/