import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import HTML5Backend from 'react-dnd-html5-backend';
import {
        DragSource,
        DropTarget,
        DragDropContext
} from 'react-dnd';
import FlipMove from 'react-flip-move';

import tiles from '../../data/tiles';
import testTiles from '../../data/tiles' ;

const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 14;
const SQUARE_SIZE = 40;
const TILE_OFFSET = 3;
const NUM_SQUARES = BOARD_WIDTH * BOARD_HEIGHT;


@DragDropContext(HTML5Backend)
class Board extends React.Component {
        constructor(props) {
                super(props);
                this.state = {
                        tiles,
                        testTiles
                }
                this.updateDroppedTilePosition = this.updateDroppedTilePosition.bind(this);
        }


        updateDroppedTilePosition({ x, y }, tile) {
                let stateTiles = this.state.tiles.slice();
                const index = stateTiles.findIndex(stateTile => stateTile.id === tile.id);
                stateTiles[index] = { ...tile, x, y };
                this.setState({ tiles: stateTiles });
        }

        renderTiles() {
                return this.state.tiles.map((tile, index) => {
                        return (
                                <Tile
                                        key={index}
                                        onDrop={this.updateDroppedTilePosition}
                                        {...tile}
                                />
                        );
                });
        }

        renderBoardSquares() {
                const range =  n => Array.from(new Array(n), (x,i) => i) ;

                const matrixProduct = (x, y) => {
                        const rows = range(y);
                        const columns = range(x);
                        return rows.map((row, i) => columns.slice());
                }
                const matrix = matrixProduct(BOARD_WIDTH,BOARD_HEIGHT) ;

                return matrix.map((row, rowIndex) => (
                        row.map((index) => {
                                return (
                                        <BoardSquare
                                                x={index}
                                                y={rowIndex}
                                                onDrop={this.updateDroppedTilePosition}
                                        />
                                );
                        })
                ));
        }

        render() {
                return (
                        <div id="scrabble">
                                <div className="board-border">
                                        <div className="board">
                                                <FlipMove duration={200} staggerDelayBy={150}>
                                                        {this.renderTiles()}
                                                </FlipMove>
                                                {this.renderBoardSquares()}
                                        </div>
                                </div>
                        </div>
                );
        }
};

const tileSource = {
        beginDrag(props) { return props; }
};

const tileTarget = {
        drop(props, monitor) {
                const tile1 = props;
                const tile2 = monitor.getItem();

                props.onDrop(tile1, tile2);
                props.onDrop(tile2, tile1);
        }
}

@DropTarget('tile', tileTarget, (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
}))
@DragSource('tile', tileSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
}))

class Tile extends Component {
        render() {
                const {
                        connectDropTarget, connectDragSource, isDragging, letter, points, x, y
                } = this.props;

                const styles = {
                        left: x * SQUARE_SIZE - TILE_OFFSET,
                        top: y * SQUARE_SIZE - TILE_OFFSET,
                        zIndex: `${x + 1}${y + 1}`,
                        opacity: isDragging ? 0.5 : 1
                };

                return connectDropTarget(connectDragSource(
                        <div className="tile" style={styles}>
                                <span className="tile-letter">{letter}</span>
                                <span className="tile-points">{points}</span>
                        </div>
                ));
        }
}

const squareTarget = {
        drop(props, monitor) {
                props.onDrop(props, monitor.getItem());
        }
}
@DropTarget('tile', squareTarget, (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
}))
class BoardSquare extends Component {
        renderSquare() {
                const classes = classNames({
                        'board-square': true,
                        'dragged-over': this.props.isOver
                });

                return <div className={classes}></div>
        }
        render() {
                if (this.props.tile) {
                        // If this square already has a tile in it, we don't want to allow drops.
                        return this.renderSquare();
                } else {
                        return this.props.connectDropTarget(this.renderSquare());
                }
        }
}
export default Board;