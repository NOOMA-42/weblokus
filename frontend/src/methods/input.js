import { Move } from './move.js';
import { puzzleSet, puzzlePositionConfig } from '../components/puzzles/puzzle.config';
const SCALE = 30;

export class Input {
        constructor(board, player, onPlayerMove) {
                this.board = board;
                this.player = player;
                this.onPlayerMove = onPlayerMove;
        }
        rotate(elem, dir, x, y) {
                function setClass(name) {
                        elem.classList.add(name);
                        setTimeout(() => elem.classList.remove(name), 16);
                }
                switch (dir) {
                        case 'left':
                                dir = (elem.direction + [6, 2][elem.direction & 1]) & 7;
                                setClass('rotate-left');
                                break;
                        case 'right':
                                dir = (elem.direction + [2, 6][elem.direction & 1]) & 7;
                                setClass('rotate-right');
                                break;
                        case 'flip':
                                dir = elem.direction ^ 1;
                                setClass('rotate-flip');
                                break;
                        case 'cyclic':
                                if (elem.direction == 1 || elem.direction == 6) {
                                        dir = elem.direction ^ 1;
                                        setClass('rotate-flip');
                                }
                                else {
                                        dir = elem.direction + (elem.direction & 1 ? -2 : 2);
                                        setClass('rotate-right');
                                }
                                break;
                }
                elem.direction = dir;
                let rot = blockSet[elem.blockId].rotations[dir];
                for (let i = 0; i < rot.size; i++) {
                        let child = elem.childNodes[i];
                        child.style.left = rot.coords[i].x * SCALE + 'px';
                        child.style.top = rot.coords[i].y * SCALE + 'px';
                }
                if (x != undefined) {
                        elem.style.left = x - SCALE / 2 + 'px';
                        elem.style.top = y - SCALE / 2 + 'px';
                }
        }
        toBoardPosition(x, y) {
                let boardStyle = window.getComputedStyle(document.getElementById('board'));
                x -= parseInt(boardStyle.left) + parseInt(boardStyle.borderLeftWidth);
                y -= parseInt(boardStyle.top) + parseInt(boardStyle.borderTopWidth);
                x = Math.round(x / SCALE);
                y = Math.round(y / SCALE);
                if (this.board.inBounds(x, y))
                        return { x, y };
                else
                        return null;
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
        createPiece(x, y, id, dir) {
                let elem = document.getElementById('b' + id);
                if (elem) {
                        elem.style.left = x + 'px';
                        elem.style.top = y + 'px';
                        this.rotate(elem, dir);
                        return;
                }
                // create a new piece
                elem = document.createElement('div');
                elem.id = 'b' + id;
                elem.blockId = id;
                elem.direction = dir;
                elem.classList.add('piece');
                elem.setAttribute('style', 'left:' + x + 'px;' +
                        'top:' + y + 'px;' +
                        'position:absolute;');
                let piece = blockSet[id].rotations[dir].piece;
                for (let i = 0; i < piece.size; i++) {
                        let cell = document.createElement('div');
                        cell.setAttribute('style', 'position:absolute;' +
                                'left:' + piece.coords[i].x * SCALE + 'px;' +
                                'top:' + piece.coords[i].y * SCALE + 'px;' +
                                'width:' + SCALE + 'px;' +
                                'height:' + SCALE + 'px;');
                        cell.className = 'block' + this.player;
                        elem.appendChild(cell);
                }
                elem.onmousedown = this.mouseDrag.bind(this);
                elem.onclick = this.click.bind(this);
                elem.ondblclick = this.dblclick.bind(this);
                elem.onmousewheel = this.wheel.bind(this);
                if (elem.addEventListener)
                        elem.addEventListener('DOMMouseScroll', this.wheel.bind(this), false); // for FF
                document.getElementById('pieces').appendChild(elem);
        }
        createPieces() {
                let area = window.getComputedStyle(document.getElementById('piece-area'));
                let left = parseInt(area.left) + parseInt(area.paddingLeft);
                let top = parseInt(area.top) + parseInt(area.paddingTop);
                for (let i = 0; i < puzzlePositionConfig.length; i++) {
                        let a = puzzlePositionConfig[i];
                        if (!this.board.isUsed(this.player, i)) {
                                if (mqFullsize.matches)
                                        this.createPiece(left + a[0] * SCALE, top + a[1] * SCALE, i, a[2]);
                        }
                }
        }
        wheel(e) {
                e.stopPropagation();
                e.preventDefault();
                if (this.wheel_lock)
                        return;
                this.wheel_lock = true;
                setTimeout(() => { this.wheel_lock = false; }, 50);
                if (this.board.player() != this.player)
                        return;
                let raw = e.detail ? e.detail : -e.wheelDelta;
                let { x, y } = containerOffset(e);
                if (raw < 0)
                        this.rotate(e.currentTarget, 'left', x, y);
                else
                        this.rotate(e.currentTarget, 'right', x, y);
        }
        select(e) {
                if (this.board.player() != this.player)
                        return;
                let elem = e.currentTarget;
                if (this.selected && this.selected !== elem) {
                        this.unselect();
                }
                this.selected = elem;
                elem.classList.remove('unselected');
                elem.classList.add('selected');
                elem.style.left = '155px';
                elem.style.top = '305px';
                elem.onclick = this.click.bind(this);
        }
        // For compact mode
        unselect() {
                if (!this.selected)
                        return;
                this.selected.classList.remove('selected');
                this.selected.classList.add('unselected');
                this.selected.onclick = this.select.bind(this);
                this.selected.removeEventListener('touchstart', this.touchDragHandler, false);
                this.selected = null;
                this.createPieces();
        }
        click(e) {
                if ( !e.shiftKey )
                        return;
                if (this.board.player() != this.player)
                        return;
                let { x, y } = containerOffset(e);
                this.rotate(e.currentTarget,  'right' , x, y);
        }
        // For full-size mode
        dblclick(e) {
                if (e.shiftKey)
                        return;
                if (this.board.player() != this.player)
                        return;
                let { x, y } = containerOffset(e);
                this.rotate(e.currentTarget, 'flip', x, y);
        }
        mouseDrag(e) {
                if (this.board.player() != this.player)
                        return;
                this.dragCommon(e, e.clientX, e.clientY);
        }
        dragCommon(e, clientX, clientY) {
                let elem = e.currentTarget;
                let deltaX = clientX - elem.offsetLeft;
                let deltaY = clientY - elem.offsetTop;
                let touchClick = true;
                elem.classList.add('dragging');
                e.stopPropagation();
                e.preventDefault();
                let moveHandler = (e, clientX, clientY) => {
                        e.stopPropagation();
                        let x = clientX - deltaX;
                        let y = clientY - deltaY;
                        let bpos = this.toBoardPosition(x, y);
                        let pieceId = elem.blockId << 3 | elem.direction;
                        if (bpos &&
                                this.board.isValidMove(new Move(bpos.x, bpos.y, pieceId))) {
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
                                let move = new Move(bpos.x, bpos.y, elem.blockId << 3 | elem.direction);
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
}
function containerOffset(e) {
        let offsetParent = e.currentTarget.offsetParent;
        let x = e.pageX - offsetParent.offsetLeft;
        let y = e.pageY - offsetParent.offsetTop;
        return { x, y };
}