//Library
import React from 'react';
import { Container, Row, Col } from 'reactstrap';

// Components
import Asia from './maps/Asia';
import View from './view/View';

// Config
import { puzzleSet } from '../components/puzzles/puzzle.config';

// Class
import { Board } from '../methods/board';
import { Move } from '../methods/move';

//image
import capoo from '../assets/image/hi.jpeg';
const SCALE = 30;

function containerOffset(e) {
        let offsetParent = e.currentTarget.offsetParent;
        let x = e.pageX - offsetParent.offsetLeft;
        let y = e.pageY - offsetParent.offsetTop;
        return { x, y };
}
class WebLokus extends React.Component {
        constructor(props) {
                super(props);
                this.board = new Board();
                this.drag = this.drag.bind(this);
                this.click = this.click.bind(this);
                this.dblclick = this.dblclick.bind(this);
                this.wheel = this.wheel.bind(this);
        }
        update() {
                let boardElem = document.getElementById('board');
                for (let y = 0; y < 14; y++) {
                        for (let x = 0; x < 14; x++) {
                                let col = this.board.colorAt(x, y); // 'violet' 'orange' 
                                if (!col) continue;
                                let id = 'board_' + x.toString(16) + y.toString(16);
                                let cell = document.getElementById(id);
                                if (!cell) {
                                        cell = document.createElement('div');
                                        cell.id = id;
                                        cell.setAttribute('style', 'position:absolute;' +
                                                'left:' + x * 40 + 'px;' +
                                                'top:' + y * 40 + 'px;' +
                                                'width:' + 40 + 'px;' +
                                                'height:' + 40 + 'px;');
                                        boardElem.appendChild(cell);
                                }
                                let cls = col === 'violet' ? 'block0' : 'block1';
                                cell.className = cls;
                        }
                }

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
                let direction = elem.getAttribute('data-direction');
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
                let elemId = parseInt(elem.id[1]);
                let rot = puzzleSet[elemId].rotations[dir];
                for (let i = 0; i < rot.size; i++) {
                        let child = elem.childNodes[i];
                        child.style.left = rot.coords[i].x * SCALE + 'px';
                        child.style.top = rot.coords[i].y * SCALE + 'px';
                }
                if (x != undefined) {
                        console.log('hi');
                        elem.style.left = x + 'px';
                        elem.style.top = y + 'px';
                }
        }

        toBoardPosition(x, y) {
                let boardStyle = window.getComputedStyle(document.getElementsByClassName('board')[0]);
                x -= parseInt(boardStyle.left) + parseInt(boardStyle.borderLeftWidth) ;
                y -= parseInt(boardStyle.top) + parseInt(boardStyle.borderTopWidth)  ;
                console.log(`x : ${x} y: ${y}`) ;
                x = Math.round(x / SCALE);
                y = Math.round(y / SCALE);
                console.log(`Board Position x : ${x} y: ${y}`) ;
                if (this.board.inBounds(x, y)) return { x, y };
                else return null;
        }

        fromBoardPosition(pos) {
                let boardStyle = window.getComputedStyle(document.getElementById('board'));
                return {
                        x: pos.x * SCALE + parseInt(boardStyle.left) +
                                parseInt(boardStyle.borderLeftWidth),
                        y: pos.y * SCALE + parseInt(boardStyle.top) +
                                parseInt(boardStyle.borderTopWidth)
                };
        }


        dragPuzzles(e, clientX, clientY) {
                let elem = e.currentTarget;
                let elemId = parseInt(elem.id[1]);
                let deltaX = clientX - elem.offsetLeft;
                let deltaY = clientY - elem.offsetTop;
                elem.classList.add('dragging');
                e.stopPropagation();
                e.preventDefault();
                let moveHandler = (e, clientX, clientY) => {
                        e.stopPropagation();
                        let x = clientX - deltaX;
                        let y = clientY - deltaY;
                        let bpos = this.toBoardPosition(x, y);
                        let pieceId = elemId << 3 | elem.getAttribute('data-direction');
                        if (bpos && this.board.isValidMove(new Move(bpos.x, bpos.y, pieceId))) {
                                let epos = this.fromBoardPosition(bpos);
                                elem.style.left = epos.x + 'px';
                                elem.style.top = epos.y + 'px';
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
                        let bpos = this.toBoardPosition(clientX - deltaX, clientY - deltaY);
                        if (bpos) {
                                let move = new Move(bpos.x, bpos.y, elemId << 3 | elem.getAttribute('data-direction'));
                                if (this.board.isValidMove(move)) {
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

        wheel(e) {
                console.log('wheel');
                e.stopPropagation();
                e.preventDefault();
                if (this.wheel_lock) return;
                this.wheel_lock = true;
                setTimeout(() => { this.wheel_lock = false; }, 50);
                let raw = e.detail ? e.detail : -e.wheelDelta;
                let { x, y } = containerOffset(e);
                console.log(`x : ${x} y : ${y}`);
                if (raw < 0) {
                        console.log('left');
                        this.rotate(e.currentTarget, 'left', x, y);
                }
                else {
                        console.log('right');
                        this.rotate(e.currentTarget, 'right', x, y);
                }

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
                        < Container >
                                <Row>
                                        <Col xs="2"><img src={capoo} style={{ width: 150, margin: 40 }} /></Col>
                                        <Col xs="7">
                                                <Asia />
                                        </Col>
                                        <Col xs="3">
                                                <View onMouseDown={this.drag} onWheel={this.wheel} onClick={this.click} onDoubleClick={this.dblclick} />
                                        </Col>
                                </Row>
                        </Container >
                );
        }
}

export default WebLokus;