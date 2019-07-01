import React from 'react';
import { Table } from 'reactstrap';
import axios from 'axios';

export default class Example extends React.Component {
    constructor(props) {
        super(props);
        
       

    }
    
    componentDidMount() {
        axios.get('http://localhost:2567/ranks/')
        .then(response => {
            const data = response.data
            this.setState(
                {scores: data}
                );
            state = {
                score:data
            }
        })
        .catch(function (error){
            console.log(error);
        })
        
        
        
    }

  render() {
    console.log(this.state)
    const scores =  this.state.scores.map((score,id)=>{
        <tr>
            <th scope="row">{id}</th>
            <td>{score.rank_user}</td>
            <td>{score.rank_score}</td>
          </tr>
    })
    return (
    <div style={{padding:"10% 20%"}}>
        <h1 style={{textAlign:"center"}}>Ranking</h1>
        <Table style={{margin:"5%",padding:"20%"}}>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </Table>

    </div>
      
    );
  }
}