import React from 'react';
import classNames from 'classnames';
import HTML5Backend from 'react-dnd-html5-backend';
import {
        DragSource,
        DropTarget,
        DragDropContext,
        DragDropContextProvider
} from 'react-dnd' ;
import FlipMove from 'react-flip-move';

const BOARD_WIDTH   = 11;
const BOARD_HEIGHT  = 7;
const SQUARE_SIZE   = 56;
const TILE_OFFSET   = 3;
const NUM_SQUARES   = BOARD_WIDTH * BOARD_HEIGHT;


@DragDropContext(HTML5Backend)
class Asia extends React.Component { 
        constructor(props) {
                super(props);
                this.state = {
                        
                }
        }

        updateDroppedTilePosition() {
                
        }

        renderTiles() {
                
        }

        renderBoardSquares() {
                
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
}


export default Asia;