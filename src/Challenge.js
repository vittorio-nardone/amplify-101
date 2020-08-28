import React from 'react';
import './App.css';
import pb from './pb.png';
import {API, graphqlOperation} from 'aws-amplify';
import {sendChallengeResults} from './graphql/mutations';
import TimeCounter from "./TimeCounter";

class Challenge extends React.Component {
  constructor(props) {
    super(props);
    const results = new Array(props.challenge.challenge.length).fill(0);
    this.state = {'score': null, 'results': results, 'loadingResults': false};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleClick() {
    this.setState({'loadingResults': true});

    // mutation
    const challengeResult = {id: this.props.challenge.id,
      results: this.state.results};

    API.graphql(graphqlOperation(sendChallengeResults, challengeResult))
        .then((data) => {
          console.log({data});
          this.setState({'score': data.data.sendChallengeResults});
        })
        .catch((err) => console.log('error: ', err));
  }

  handleChange(value, index) {
    const results = this.state.results;
    results[index] = parseInt(value);
    console.log(results);
    this.setState({'results': results});
  }

  render() {
    return this.state.score !== null ? (
            <div className="Challenge">
              {this.state.score.pb ? (
              <div>
                <img src={pb} alt="pb" height="200px"/>
                <h1>Congratulation!</h1>
                <p>It&apos;s your new personal best!</p>
              </div>
            ) : (<p><h1>Results</h1>Hmm, not your best.</p>)}
              <p>You did it in 
                <b> {this.state.score.duration}</b> seconds and 
                <b> {this.state.score.errors}</b> error(s).
              </p>
              <button className="App-buttons" onClick = {this.props.onFinish}>
                BACK
              </button>
            </div>
      ) :
    (
            <div className="Challenge">
              <h1>Table of {this.props.challenge.multiply}</h1>

              <form onSubmit={this.handleSubmit} className="ChallengeForm">

                <table className="ChallengeTable">

                  <thead>
                    <tr className="ChallengeTable-Header">
                      <th>Guess</th>
                      <th>Result</th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.props.challenge.challenge.map((item, index) => {
                      return (
                        <tr key={item} className="ChallengeTable-Row">
                          <td>
                            <b>{this.props.challenge.multiply} x {item} ?</b>
                          </td>
                          <td>
                            <input type="text" maxLength="3" size="3"
                              onChange={
                                (e)=>this.handleChange(e.target.value, index)
                              }
                            />
                          </td>
                        </tr>
                      );
                    } )
                    }
                  </tbody>

                </table>
                <p>
                  <button
                    disabled={this.state.loadingResults}
                    className="App-buttons"
                    onClick={this.handleClick}>
                    {this.state.loadingResults ? '...checking...' : 'SUBMIT'}
                  </button>
                </p>
                <div class="App-footer" style={{ fontSize: 28 }}><b>time:</b> <TimeCounter/> - <b>personal best:</b> {this.props.challenge.personal_best === 0 ? ("none") : (this.props.challenge.personal_best)}</div>
              </form>
            </div>
    );
  }
}


export default Challenge;
