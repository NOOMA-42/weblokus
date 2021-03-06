import { pieceSet, puzzleSet } from '../components/puzzles/puzzle.config';
import { Move, PASS } from './move.js';
const VIOLET_MASK = 0x07;
const ORANGE_MASK = 0x70;
const VIOLET_EDGE = 0x01; 
const ORANGE_EDGE = 0x10; 
const VIOLET_SIDE = 0x02; 
const ORANGE_SIDE = 0x20; 
const VIOLET_BLOCK = 0x04; 
const ORANGE_BLOCK = 0x40; 

export class Board {
        constructor(path) {
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

                if (path) {
                        let moves = path.split('/');
                        for (let i = 0; i < moves.length; i++) {
                                if (!moves[i])
                                        continue;
                                let move = new Move(moves[i]);
                                if (this.isValidMove(move))
                                        this.doMove(move);
                                else
                                        throw new Error('invalid move: ' + moves[i]);
                        }
                }
        }
        inBounds(x, y) { return (x >= 0 && y >= 0 && x < 14 && y < 14); }
        turn() { return this.history.length; }
        player() { return this.turn() % 2; }
        colorAt(x, y) {
                if (this.square[y][x] & VIOLET_BLOCK)
                        return 'violet';
                if (this.square[y][x] & ORANGE_BLOCK)
                        return 'orange';
                return null;
        }
        isValidMove(move) {
                if (move.isPass())
                        return true;
                if (this.used[move.blockId() + this.player() * 21])
                        return false;
                let coords = move.coords();
                if (!this._isMovable(coords))
                        return false;
                for (let i = 0; i < coords.length; i++) {
                        if (this.square[coords[i].y][coords[i].x] &
                                [VIOLET_EDGE, ORANGE_EDGE][this.player()])
                                return true;
                }
                return false;
        }
        doMove(move) {
                if (move.isPass()) {
                        this.history.push(move);
                        return;
                }
                let coords = move.coords();
                console.log(coords);
                let block = [VIOLET_BLOCK, ORANGE_BLOCK][this.player()];
                let side_bit = [VIOLET_SIDE, ORANGE_SIDE][this.player()];
                let edge_bit = [VIOLET_EDGE, ORANGE_EDGE][this.player()];
                for (let i = 0; i < coords.length; i++) {
                        let { x, y } = coords[i];
                        this.square[y][x] |= block;
                        if (this.inBounds(x - 1, y))
                                this.square[y][x - 1] |= side_bit;
                        if (this.inBounds(x, y - 1))
                                this.square[y - 1][x] |= side_bit;
                        if (this.inBounds(x + 1, y))
                                this.square[y][x + 1] |= side_bit;
                        if (this.inBounds(x, y + 1))
                                this.square[y + 1][x] |= side_bit;
                        if (this.inBounds(x - 1, y - 1))
                                this.square[y - 1][x - 1] |= edge_bit;
                        if (this.inBounds(x + 1, y - 1))
                                this.square[y - 1][x + 1] |= edge_bit;
                        if (this.inBounds(x - 1, y + 1))
                                this.square[y + 1][x - 1] |= edge_bit;
                        if (this.inBounds(x + 1, y + 1))
                                this.square[y + 1][x + 1] |= edge_bit;
                }
                this.used[move.blockId() + this.player() * 21] = true;
                this.history.push(move);
        }
        doPass() { this.history.push(PASS); }
        score(player) {
                let score = 0;
                for (let i = 0; i < 21; i++) {
                        if (this.used[i + player * 21])
                                score += blockSet[i].size;
                }
                return score;
        }
        _isMovable(coords) {
                let mask = (VIOLET_BLOCK | ORANGE_BLOCK) |
                        [VIOLET_SIDE, ORANGE_SIDE][this.player()];
                for (let i = 0; i < coords.length; i++) {
                        let { x, y } = coords[i];
                        if (x < 0 || x >= 14 || y < 0 || y >= 14 || this.square[y][x] & mask)
                                return false;
                }
                return true;
        }
        isUsed(player, blockId) {
                return this.used[blockId + player * 21];
        }
        canMove() {
                for (let p in pieceSet) {
                        let id = pieceSet[p].id;
                        if (this.used[(id >> 3) + this.player() * 21])
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
        getPath() { return this.history.join('/'); }
}