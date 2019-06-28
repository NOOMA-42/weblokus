import React from 'react' ;

const SCALE = 30 ;

class SinglePiece extends React.Component {
        constructor(props) {
                super(props) ;
                this.state = {
                        top: props.y,
                        left: props.x,
                        width : SCALE,
                        height: SCALE,
                        className: 'block' + props.id
                }
        }

        render() {
                const style = {
                        position: 'absolute',
                        top: this.state.top + 'px',
                        left: this.state.left + 'px',
                        width: this.state.width + 'px',
                        height: this.state.height + 'px',
                        color: this.props.color
                }
                return(
                        <div style={style} className={this.state.className}></div>
                ) ;
        }
}

class Puzzle extends React.Component {
        constructor(props) {
                super(props) ;
                this.state = {
                        top: props.y,
                        left: props.x,
                        puzzle: props.puzzle,
                        size: props.size
                }
        }

        render() {
                const style = {
                        position: 'absolute',
                        top: this.state.top + 'px',
                        left: this.state.left + 'px'
                }
                let piece = this.state.puzzle.rotations[0] ;
                let originalPieces = [] ;
                for(let i = 0 ; i < this.state.size ; i++) {
                        originalPieces[i] = {
                                x : piece.coords[i].x, 
                                y : piece.coords[i].y 
                        } ;
                }
                
                const pieces = originalPieces.map( (piece,index) => {
                        return(
                                <SinglePiece 
                                color='orange' 
                                key={index} 
                                id={0} 
                                x={piece.x * SCALE} 
                                y ={piece.y * SCALE}
                                />
                        ) ;
                }) ;

                return(
                        <div 
                        id={this.props.id}
                        data-direction={0}
                        style={style}
                        className= 'puzzle'
                        onMouseDown={this.props.onMouseDown}
                        onWheel={this.props.onWheel}
                        onClick = {this.props.onClick}
                        onDoubleClick = {this.props.onDoubleClick}
                        >
                        {pieces}
                        </div>
                ) ;
        }
}


export {Puzzle, SinglePiece} ;