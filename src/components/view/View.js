import React, { Component, PropTypes } from 'react';
import { puzzleSet, puzzlePositionConfig } from '../puzzles/puzzle.config';
import { Puzzle } from '../puzzles/puzzle' ;

const UNITLENGTH = 100;
const NUMOFPUZZLES = 21;

class View extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        currentPuzzles: puzzleSet 
                }
                this.renderPuzzles = this.renderPuzzles.bind(this);
        }

        renderPuzzles() {
                return ( 
                        this.state.currentPuzzles.map( (puzzle,index) => {
                                return(
                                        <Puzzle
                                        id={'b'+index}
                                        key={index}
                                        x={puzzlePositionConfig[index][0]==1? puzzlePositionConfig[index][0]*60:puzzlePositionConfig[index][0] * UNITLENGTH} 
                                        y={puzzlePositionConfig[index][1]==1? puzzlePositionConfig[index][1]*60:puzzlePositionConfig[index][1] * UNITLENGTH} 
                                        puzzle={puzzle} 
                                        size={puzzle.size}
                                        />
                                ) ;
                        })
                ) ;
        }

        render() {
                return (
                        <div id="puzzle-area">
                                {this.renderPuzzles()}
                        </div>
                );
        }
}

export default View;