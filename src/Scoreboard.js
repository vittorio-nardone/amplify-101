import React from 'react';
import './App.css';

import {getScores} from './graphql/queries';
import {resetScores} from './graphql/mutations';
import {API, graphqlOperation} from 'aws-amplify';

class Scoreboard extends React.Component {
  constructor() {
    super();
    this.state = null;
    this.resetClick = this.resetClick.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    const data = await API.graphql(graphqlOperation(getScores));
    const scores = data.data.getScores;
    console.log(scores);
    this.setState({'scores': scores});
  }

  resetClick(e) {
    e.preventDefault();

    API.graphql(graphqlOperation(resetScores, null))
        .then((data) => {
          this.setState({'scores': []});
        })
        .catch((err) => console.log('error: ', err));

    return false;
  }

  epochToDate(epoch) {
    const aDate = new Date(0);
    aDate.setUTCSeconds(epoch);
    return aDate.toLocaleDateString();
  }

  render() {
    return this.state === null ? (
            <div className="Scoreboard">
              <h1>Your scoreboard</h1>
              <p><i>..loading scoreboard..</i></p>
            </div>
        ) : (
            <div className="Scoreboard">
              <h1>Your scoreboard</h1>
              <table className="ScoreTable">
                <thead>
                  <tr className="ScoreTable-Header">
                    <th>Table of</th>
                    <th>Record (sec)</th>
                    <th>Errors</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.scores.map((score) => {
                    return (
                      <tr key={score.multiply} className="ScoreTable-Row">
                        <td><b>{score.multiply}</b></td>
                        <td>{score.duration}</td>
                        <td>{score.errors}</td>
                        <td>{this.epochToDate(score.when)}</td>
                      </tr>
                    );
                  })
                  }
                </tbody>
              </table>
              {this.state.scores.length > 0 ? (
              <pre>
                <a href="!#" onClick={this.resetClick}>RESET SCOREBOARD</a>
              </pre>
              ) : ( '' )}
            </div>
        );
  }
}

export default Scoreboard;
