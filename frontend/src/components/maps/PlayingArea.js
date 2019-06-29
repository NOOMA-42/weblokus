import React from 'react';
import classNames from 'classnames' ;

const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 14;
const SQUARE_SIZE = 40;
const SINGLEPIECE_OFFSET = 3;
class BoardSquare extends React.Component {
        renderSquare() {
                const classes = classNames({
                        'board-square': true
                });
                return <div className={classes} id={this.props.id}></div>
        }
        render() {
                return this.renderSquare() ;
        }
}
class PlayingArea extends React.Component {
        renderBoardSquares() {
                const range = n => Array.from(new Array(n), (x, i) => i);
                const matrixProduct = (x, y) => {
                        const rows = range(y);
                        const columns = range(x);
                        return rows.map((row, i) => columns.slice());
                }
                const matrix = matrixProduct(BOARD_WIDTH, BOARD_HEIGHT);

                return matrix.map((row, rowIndex) => (
                        row.map((index) => {
                                return (
                                        <BoardSquare
                                                x={index}
                                                y={rowIndex}
                                                id={`board_${index.toString(16)}${rowIndex.toString(16)}`}
                                                key={`${index}+${rowIndex}`}
                                        />
                                );
                        })
                ));
        }

        render() {
                return (
                        <div id="board">
                                <div className='board-border'>
                                        <div className='board'>
                                                {this.renderBoardSquares()}
                                        </div>
                                </div>
                        </div>
                );
        }
}

export default PlayingArea;