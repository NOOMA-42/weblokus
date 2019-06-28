class Piece {
        constructor(id, coords) {
                this.id = id;
                this.size = coords.length ;
                this.coords = [];
                for (let i = 0; i < coords.length; i++) {
                        this.coords[i] = { x: coords[i][0], y: coords[i][1] };
                }
        }
}

class Rotation {
        constructor(config) {
                [this.offsetX, this.offsetY, this.piece] = config;
                this.size = this.piece.size;
                this.coords = [];
                for (let i = 0; i < this.piece.size; i++) {
                        this.coords[i] = {
                                x: this.piece.coords[i].x + this.offsetX,
                                y: this.piece.coords[i].y + this.offsetY
                        };
                }
        }
}

class Puzzle {
        constructor(id, size, rotations) {
                this.id = id;
                this.size = size;
                this.rotations = [];
                for (let i = 0; i < 8; i++)
                        this.rotations[i] = new Rotation(rotations[i]);
        }
}

const pieceSet = {
        u0: new Piece(0x00, [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1]]),
        t0: new Piece(0x08, [[-1, -1], [-1, 0], [0, 0], [1, 0], [0, 1]]),
        t1: new Piece(0x09, [[1, -1], [1, 0], [0, 0], [-1, 0], [0, 1]]),
        t2: new Piece(0x0a, [[1, -1], [0, -1], [0, 0], [0, 1], [-1, 0]]),
        t3: new Piece(0x0b, [[-1, -1], [0, -1], [0, 0], [0, 1], [1, 0]]),
        t4: new Piece(0x0c, [[1, 1], [1, 0], [0, 0], [-1, 0], [0, -1]]),
        t5: new Piece(0x0d, [[-1, 1], [-1, 0], [0, 0], [1, 0], [0, -1]]),
        t6: new Piece(0x0e, [[-1, 1], [0, 1], [0, 0], [0, -1], [1, 0]]),
        t7: new Piece(0x0f, [[1, 1], [0, 1], [0, 0], [0, -1], [-1, 0]]),
        s0: new Piece(0x10, [[0, 0], [1, 0], [1, 1], [-1, 0], [-1, -1]]),
        s1: new Piece(0x11, [[0, 0], [-1, 0], [-1, 1], [1, 0], [1, -1]]),
        s2: new Piece(0x12, [[0, 0], [0, 1], [-1, 1], [0, -1], [1, -1]]),
        s3: new Piece(0x13, [[0, 0], [0, 1], [1, 1], [0, -1], [-1, -1]]),
        r0: new Piece(0x18, [[0, 0], [1, 0], [1, 1], [0, -1], [-1, -1]]),
        r1: new Piece(0x19, [[0, 0], [-1, 0], [-1, 1], [0, -1], [1, -1]]),
        r2: new Piece(0x1a, [[0, 0], [0, 1], [-1, 1], [1, 0], [1, -1]]),
        r3: new Piece(0x1b, [[0, 0], [0, 1], [1, 1], [-1, 0], [-1, -1]]),
        q0: new Piece(0x20, [[0, 0], [1, 0], [2, 0], [0, -1], [0, -2]]),
        q1: new Piece(0x21, [[0, 0], [-1, 0], [-2, 0], [0, -1], [0, -2]]),
        q2: new Piece(0x22, [[0, 0], [0, 1], [0, 2], [1, 0], [2, 0]]),
        q3: new Piece(0x23, [[0, 0], [0, 1], [0, 2], [-1, 0], [-2, 0]]),
        p0: new Piece(0x28, [[0, 0], [0, -1], [0, 1], [-1, 1], [1, 1]]),
        p2: new Piece(0x2a, [[0, 0], [1, 0], [-1, 0], [-1, -1], [-1, 1]]),
        p3: new Piece(0x2b, [[0, 0], [-1, 0], [1, 0], [1, -1], [1, 1]]),
        p4: new Piece(0x2c, [[0, 0], [0, 1], [0, -1], [1, -1], [-1, -1]]),
        o0: new Piece(0x30, [[0, -1], [0, 0], [1, 0], [0, 1], [0, 2]]),
        o1: new Piece(0x31, [[0, -1], [0, 0], [-1, 0], [0, 1], [0, 2]]),
        o2: new Piece(0x32, [[1, 0], [0, 0], [0, 1], [-1, 0], [-2, 0]]),
        o3: new Piece(0x33, [[-1, 0], [0, 0], [0, 1], [1, 0], [2, 0]]),
        o4: new Piece(0x34, [[0, 1], [0, 0], [-1, 0], [0, -1], [0, -2]]),
        o5: new Piece(0x35, [[0, 1], [0, 0], [1, 0], [0, -1], [0, -2]]),
        o6: new Piece(0x36, [[-1, 0], [0, 0], [0, -1], [1, 0], [2, 0]]),
        o7: new Piece(0x37, [[1, 0], [0, 0], [0, -1], [-1, 0], [-2, 0]]),
        n0: new Piece(0x38, [[0, 0], [0, 1], [-1, 1], [0, -1], [-1, -1]]),
        n1: new Piece(0x39, [[0, 0], [0, 1], [1, 1], [0, -1], [1, -1]]),
        n2: new Piece(0x3a, [[0, 0], [-1, 0], [-1, -1], [1, 0], [1, -1]]),
        n6: new Piece(0x3e, [[0, 0], [1, 0], [1, 1], [-1, 0], [-1, 1]]),
        m0: new Piece(0x40, [[0, -1], [-1, 0], [0, 0], [-1, 1], [0, 1]]),
        m1: new Piece(0x41, [[0, -1], [1, 0], [0, 0], [1, 1], [0, 1]]),
        m2: new Piece(0x42, [[1, 0], [0, -1], [0, 0], [-1, -1], [-1, 0]]),
        m3: new Piece(0x43, [[-1, 0], [0, -1], [0, 0], [1, -1], [1, 0]]),
        m4: new Piece(0x44, [[0, 1], [1, 0], [0, 0], [1, -1], [0, -1]]),
        m5: new Piece(0x45, [[0, 1], [-1, 0], [0, 0], [-1, -1], [0, -1]]),
        m6: new Piece(0x46, [[-1, 0], [0, 1], [0, 0], [1, 1], [1, 0]]),
        m7: new Piece(0x47, [[1, 0], [0, 1], [0, 0], [-1, 1], [-1, 0]]),
        l0: new Piece(0x48, [[0, -2], [0, -1], [0, 0], [-1, 0], [-1, 1]]),
        l1: new Piece(0x49, [[0, -2], [0, -1], [0, 0], [1, 0], [1, 1]]),
        l2: new Piece(0x4a, [[2, 0], [1, 0], [0, 0], [0, -1], [-1, -1]]),
        l3: new Piece(0x4b, [[-2, 0], [-1, 0], [0, 0], [0, -1], [1, -1]]),
        l4: new Piece(0x4c, [[0, 2], [0, 1], [0, 0], [1, 0], [1, -1]]),
        l5: new Piece(0x4d, [[0, 2], [0, 1], [0, 0], [-1, 0], [-1, -1]]),
        l6: new Piece(0x4e, [[-2, 0], [-1, 0], [0, 0], [0, 1], [1, 1]]),
        l7: new Piece(0x4f, [[2, 0], [1, 0], [0, 0], [0, 1], [-1, 1]]),
        k0: new Piece(0x50, [[0, 0], [0, 1], [0, -2], [0, -1], [-1, 1]]),
        k1: new Piece(0x51, [[0, 0], [0, 1], [0, -2], [0, -1], [1, 1]]),
        k2: new Piece(0x52, [[0, 0], [-1, 0], [2, 0], [1, 0], [-1, -1]]),
        k3: new Piece(0x53, [[0, 0], [1, 0], [-2, 0], [-1, 0], [1, -1]]),
        k4: new Piece(0x54, [[0, 0], [0, -1], [0, 2], [0, 1], [1, -1]]),
        k5: new Piece(0x55, [[0, 0], [0, -1], [0, 2], [0, 1], [-1, -1]]),
        k6: new Piece(0x56, [[0, 0], [1, 0], [-2, 0], [-1, 0], [1, 1]]),
        k7: new Piece(0x57, [[0, 0], [-1, 0], [2, 0], [1, 0], [-1, 1]]),
        j0: new Piece(0x58, [[0, 0], [0, 1], [0, 2], [0, -1], [0, -2]]),
        j2: new Piece(0x5a, [[0, 0], [-1, 0], [-2, 0], [1, 0], [2, 0]]),
        i0: new Piece(0x60, [[-1, 0], [0, 0], [0, 1], [1, 1]]),
        i1: new Piece(0x61, [[1, 0], [0, 0], [0, 1], [-1, 1]]),
        i2: new Piece(0x62, [[0, -1], [0, 0], [-1, 0], [-1, 1]]),
        i3: new Piece(0x63, [[0, -1], [0, 0], [1, 0], [1, 1]]),
        h0: new Piece(0x68, [[0, 0], [1, 0], [0, 1], [1, 1]]),
        g0: new Piece(0x70, [[0, 0], [1, 0], [0, 1], [0, -1]]),
        g1: new Piece(0x71, [[0, 0], [-1, 0], [0, 1], [0, -1]]),
        g2: new Piece(0x72, [[0, 0], [0, 1], [-1, 0], [1, 0]]),
        g6: new Piece(0x76, [[0, 0], [0, -1], [1, 0], [-1, 0]]),
        f0: new Piece(0x78, [[0, 0], [0, -1], [0, 1], [-1, 1]]),
        f1: new Piece(0x79, [[0, 0], [0, -1], [0, 1], [1, 1]]),
        f2: new Piece(0x7a, [[0, 0], [1, 0], [-1, 0], [-1, -1]]),
        f3: new Piece(0x7b, [[0, 0], [-1, 0], [1, 0], [1, -1]]),
        f4: new Piece(0x7c, [[0, 0], [0, 1], [0, -1], [1, -1]]),
        f5: new Piece(0x7d, [[0, 0], [0, 1], [0, -1], [-1, -1]]),
        f6: new Piece(0x7e, [[0, 0], [-1, 0], [1, 0], [1, 1]]),
        f7: new Piece(0x7f, [[0, 0], [1, 0], [-1, 0], [-1, 1]]),
        e0: new Piece(0x80, [[0, 0], [0, 1], [0, 2], [0, -1]]),
        e2: new Piece(0x82, [[0, 0], [-1, 0], [-2, 0], [1, 0]]),
        d0: new Piece(0x88, [[0, 0], [1, 0], [0, -1]]),
        d1: new Piece(0x89, [[0, 0], [-1, 0], [0, -1]]),
        d2: new Piece(0x8a, [[0, 0], [0, 1], [1, 0]]),
        d3: new Piece(0x8b, [[0, 0], [0, 1], [-1, 0]]),
        c0: new Piece(0x90, [[0, 0], [0, 1], [0, -1]]),
        c2: new Piece(0x92, [[0, 0], [-1, 0], [1, 0]]),
        b0: new Piece(0x98, [[0, 0], [0, 1]]),
        b2: new Piece(0x9a, [[0, 0], [-1, 0]]),
        a0: new Piece(0xa0, [[0, 0]])
}

const puzzleSet = [
        new Puzzle(0x00, 5, [[0, 0, pieceSet.u0], [0, 0, pieceSet.u0],
        [0, 0, pieceSet.u0], [0, 0, pieceSet.u0],
        [0, 0, pieceSet.u0], [0, 0, pieceSet.u0],
        [0, 0, pieceSet.u0], [0, 0, pieceSet.u0]]),
        new Puzzle(0x08, 5, [[0, 0, pieceSet.t0], [0, 0, pieceSet.t1],
        [0, 0, pieceSet.t2], [0, 0, pieceSet.t3],
        [0, 0, pieceSet.t4], [0, 0, pieceSet.t5],
        [0, 0, pieceSet.t6], [0, 0, pieceSet.t7]]),
        new Puzzle(0x10, 5, [[0, 0, pieceSet.s0], [0, 0, pieceSet.s1],
        [0, 0, pieceSet.s2], [0, 0, pieceSet.s3],
        [0, 0, pieceSet.s0], [0, 0, pieceSet.s1],
        [0, 0, pieceSet.s2], [0, 0, pieceSet.s3]]),
        new Puzzle(0x18, 5, [[0, 0, pieceSet.r0], [0, 0, pieceSet.r1],
        [0, 0, pieceSet.r2], [0, 0, pieceSet.r3],
        [0, 0, pieceSet.r3], [0, 0, pieceSet.r2],
        [0, 0, pieceSet.r1], [0, 0, pieceSet.r0]]),
        new Puzzle(0x20, 5, [[0, 0, pieceSet.q0], [0, 0, pieceSet.q1],
        [0, 0, pieceSet.q2], [0, 0, pieceSet.q3],
        [0, 0, pieceSet.q3], [0, 0, pieceSet.q2],
        [0, 0, pieceSet.q1], [0, 0, pieceSet.q0]]),
        new Puzzle(0x28, 5, [[0, 0, pieceSet.p0], [0, 0, pieceSet.p0],
        [0, 0, pieceSet.p2], [0, 0, pieceSet.p3],
        [0, 0, pieceSet.p4], [0, 0, pieceSet.p4],
        [0, 0, pieceSet.p3], [0, 0, pieceSet.p2]]),
        new Puzzle(0x30, 5, [[0, 0, pieceSet.o0], [0, 0, pieceSet.o1],
        [0, 0, pieceSet.o2], [0, 0, pieceSet.o3],
        [0, 0, pieceSet.o4], [0, 0, pieceSet.o5],
        [0, 0, pieceSet.o6], [0, 0, pieceSet.o7]]),
        new Puzzle(0x38, 5, [[0, 0, pieceSet.n0], [0, 0, pieceSet.n1],
        [0, 0, pieceSet.n2], [0, 0, pieceSet.n2],
        [0, 0, pieceSet.n1], [0, 0, pieceSet.n0],
        [0, 0, pieceSet.n6], [0, 0, pieceSet.n6]]),
        new Puzzle(0x40, 5, [[0, 0, pieceSet.m0], [0, 0, pieceSet.m1],
        [0, 0, pieceSet.m2], [0, 0, pieceSet.m3],
        [0, 0, pieceSet.m4], [0, 0, pieceSet.m5],
        [0, 0, pieceSet.m6], [0, 0, pieceSet.m7]]),
        new Puzzle(0x48, 5, [[0, 0, pieceSet.l0], [0, 0, pieceSet.l1],
        [0, 0, pieceSet.l2], [0, 0, pieceSet.l3],
        [0, 0, pieceSet.l4], [0, 0, pieceSet.l5],
        [0, 0, pieceSet.l6], [0, 0, pieceSet.l7]]),
        new Puzzle(0x50, 5, [[0, 0, pieceSet.k0], [0, 0, pieceSet.k1],
        [0, 0, pieceSet.k2], [0, 0, pieceSet.k3],
        [0, 0, pieceSet.k4], [0, 0, pieceSet.k5],
        [0, 0, pieceSet.k6], [0, 0, pieceSet.k7]]),
        new Puzzle(0x58, 5, [[0, 0, pieceSet.j0], [0, 0, pieceSet.j0],
        [0, 0, pieceSet.j2], [0, 0, pieceSet.j2],
        [0, 0, pieceSet.j0], [0, 0, pieceSet.j0],
        [0, 0, pieceSet.j2], [0, 0, pieceSet.j2]]),
        new Puzzle(0x60, 4, [[0, 0, pieceSet.i0], [0, 0, pieceSet.i1],
        [0, 0, pieceSet.i2], [0, 0, pieceSet.i3],
        [0, -1, pieceSet.i0], [0, -1, pieceSet.i1],
        [1, 0, pieceSet.i2], [-1, 0, pieceSet.i3]]),
        new Puzzle(0x68, 4, [[0, 0, pieceSet.h0], [-1, 0, pieceSet.h0],
        [-1, 0, pieceSet.h0], [0, 0, pieceSet.h0],
        [-1, -1, pieceSet.h0], [0, -1, pieceSet.h0],
        [0, -1, pieceSet.h0], [-1, -1, pieceSet.h0]]),
        new Puzzle(0x70, 4, [[0, 0, pieceSet.g0], [0, 0, pieceSet.g1],
        [0, 0, pieceSet.g2], [0, 0, pieceSet.g2],
        [0, 0, pieceSet.g1], [0, 0, pieceSet.g0],
        [0, 0, pieceSet.g6], [0, 0, pieceSet.g6]]),
        new Puzzle(0x78, 4, [[0, 0, pieceSet.f0], [0, 0, pieceSet.f1],
        [0, 0, pieceSet.f2], [0, 0, pieceSet.f3],
        [0, 0, pieceSet.f4], [0, 0, pieceSet.f5],
        [0, 0, pieceSet.f6], [0, 0, pieceSet.f7]]),
        new Puzzle(0x80, 4, [[0, 0, pieceSet.e0], [0, 0, pieceSet.e0],
        [0, 0, pieceSet.e2], [1, 0, pieceSet.e2],
        [0, -1, pieceSet.e0], [0, -1, pieceSet.e0],
        [1, 0, pieceSet.e2], [0, 0, pieceSet.e2]]),
        new Puzzle(0x88, 3, [[0, 0, pieceSet.d0], [0, 0, pieceSet.d1],
        [0, 0, pieceSet.d2], [0, 0, pieceSet.d3],
        [0, 0, pieceSet.d3], [0, 0, pieceSet.d2],
        [0, 0, pieceSet.d1], [0, 0, pieceSet.d0]]),
        new Puzzle(0x90, 3, [[0, 0, pieceSet.c0], [0, 0, pieceSet.c0],
        [0, 0, pieceSet.c2], [0, 0, pieceSet.c2],
        [0, 0, pieceSet.c0], [0, 0, pieceSet.c0],
        [0, 0, pieceSet.c2], [0, 0, pieceSet.c2]]),
        new Puzzle(0x98, 2, [[0, 0, pieceSet.b0], [0, 0, pieceSet.b0],
        [0, 0, pieceSet.b2], [1, 0, pieceSet.b2],
        [0, -1, pieceSet.b0], [0, -1, pieceSet.b0],
        [1, 0, pieceSet.b2], [0, 0, pieceSet.b2]]),
        new Puzzle(0xa0, 1, [[0, 0, pieceSet.a0], [0, 0, pieceSet.a0],
        [0, 0, pieceSet.a0], [0, 0, pieceSet.a0],
        [0, 0, pieceSet.a0], [0, 0, pieceSet.a0],
        [0, 0, pieceSet.a0], [0, 0, pieceSet.a0]])
];

const puzzlePositionConfig = [
        [1,1],
        [2,1],
        [3.2,1],

        [1,2],
        [1.8,2],
        [3.3,1.7],

        [1,3.2],
        [2,3],
        [3.5,3],

        [1,4.9],
        [1.5,4.5],
        [2.5,4],

        [1,5.7],
        [2,5],
        [3,5],

        [1,6.8],
        [2,6],
        [3,6],

        [1.4,7],
        [2,7],
        [3,7],
] ;

export { pieceSet, puzzleSet, puzzlePositionConfig };

