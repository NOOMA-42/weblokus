import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import Asia from './maps/Asia';
import Board from './maps/Board' ;
import View from './view/View' ;

class WebLokus extends React.Component {
        render() {
                return (
                        < Container >
                                <Row>
                                        <Col xs="2">1</Col>
                                        <Col xs="7"><Board /></Col>
                                        <Col xs="3"><View /></Col>
                                </Row>
                        </Container >
                );
        }
}

export default WebLokus;