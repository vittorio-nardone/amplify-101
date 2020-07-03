import React from 'react';
import './App.css';

import { getScores }  from './graphql/queries';

import { API, graphqlOperation } from "aws-amplify";


class Scoreboard extends React.Component {

  constructor() {
    super();
    this.state = null;
  }

  componentDidMount() {
    this.fetchData();  
  }

  async fetchData() {
    const data = await API.graphql(graphqlOperation(getScores));
    const scores = data.data.getScores
    console.log(scores);
    this.setState({'scores':scores});
  }
  
  render() {
    return this.state === null ? (
            <p>Empty list</p>
        )
        :
        (
            <table>
            <tbody>
            {this.state.scores.map(score => {
                    return (
                        <tr key={score.multiply}>
                            <td>{score.multiply}</td> 
                            <td>{score.duration}</td> 
                            <td>{score.errors}</td> 
                            <td>{score.when}</td> 
                        </tr>
                    )
                } )
            }
            </tbody>
            </table> 
    );
  }



}


        
export default Scoreboard;