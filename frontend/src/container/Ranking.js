import React from 'react';
import { Table } from 'reactstrap';
import axios from 'axios';

export default class Example extends React.Component {
    constructor(props) {
        super(props);
        
       
        this.state={
            scores:[]
        }
    }
    
    componentDidMount() {
        axios.get('http://localhost:2567/ranks/')
        .then(response => {
            const data = response.data
            this.setState(
                {scores: response.data}
            );
        })
        .catch(function (error){
            console.log(error);
        })
        
    }

  render() {
    console.log(this.state)
    const scores =  this.state.scores.map((score,id)=>(
<tr>
            <th scope="row">{id}</th>
            <td>{score.rank_user}</td>
            <td>{score.rank_score}</td>
        </tr>
    )
        
    )
    console.log(scores)
    return (
    <div style={{padding:"10% 20%"}}>
        <h1 style={{textAlign:"center"}}>Ranking</h1>
        <Table style={{margin:"5%",padding:"20%"}}>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>score</th>
          </tr>
        </thead>
        <tbody>
          {scores}
        </tbody>
      </Table>

    </div>
      
    );
  }
}