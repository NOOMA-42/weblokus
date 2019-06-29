import { puzzleSet } from '../components/puzzles/puzzle.config';

export class Move {
        constructor(x, y, piece_id) {
                if (typeof x == 'number') {
                        if (arguments.length == 3)
                                this.m = x << 4 | y | piece_id << 8;
                        else
                                this.m = x;
                }
                else if (x == '----') {
                        this.m = 0xffff;
                }
                else {
                        let xy = parseInt(x.substring(0, 2), 16);
                        let blk = 117 - x.charCodeAt(2); 
                        let dir = parseInt(x.substring(3));
                        this.m = xy - 0x11 | blk << 11 | dir << 8;
                }
                console.log(`Move: this.m=${this.m}`) ;
        }
        x() { return this.m >> 4 & 0xf; }
        y() { return this.m & 0xf; } 
        pieceId() { return this.m >> 8; }
        blockId() { return this.m >> 11; }
        direction() { return this.m >> 8 & 0x7; }  
        isPass() { return this.m == 0xffff; } 
        fourcc() {
                if (this.isPass())
                        return '----';
                return ((this.m & 0xff) + 0x11).toString(16) +
                        String.fromCharCode(117 - this.blockId()) +
                        this.direction();
        }
        toString() { return this.fourcc(); }
        coords() {
                if (this.isPass())
                        return [];
                console.log(`Move: blockId: ${this.blockId()}`);
                console.log(`Move: direction: ${this.direction()}`);
                console.log(`Move: x: ${this.x()}`);
                console.log(`Move: y: ${this.y()}`);
                let rot = puzzleSet[this.blockId()].rotations[this.direction()];
                let coords = [];
                for (let i = 0; i < rot.size; i++)
                        coords[i] = {
                                x: this.x() + rot.coords[i].x,
                                y: this.y() + rot.coords[i].y
                        };
                return coords;
        }
}

export const PASS = new Move(0xffff);