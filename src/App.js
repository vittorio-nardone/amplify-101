import React from 'react';
import './App.css';
import { AmplifyAuthenticator, AmplifySignOut, AmplifySignUp, AmplifySignIn } from '@aws-amplify/ui-react';
import Scoreboard from './Scoreboard'
import Challenge from './Challenge'

import { getChallenge }  from './graphql/queries';
import { API, graphqlOperation } from "aws-amplify";

class App extends React.Component {
  
  constructor() {
    super();
    this.state = {
      authState: null,
      user: null,
      challenge: null,
      loadingChallenge: false,
    }

    this.resetChallenge = this.resetChallenge.bind(this)
  }

  async newChallenge() {
    this.setState({loadingChallenge: true});
    const data = await API.graphql(graphqlOperation(getChallenge));
    console.log(data)
    this.setState({challenge: data.data.getChallenge})
  }

  resetChallenge() {
    this.setState({
      challenge: null,
      loadingChallenge: false
    })
  }

  render() {
    console.log(this.props.authState)
    return this.state.authState === 'signedin' ? (
      
      <div className="App">
        <header className="App-header">
          <p className="App-header-contents"><b>Amplify 101 - Learn math!</b></p>
          <p><b>User:</b> {this.state.user.username}</p>
          <AmplifySignOut className="App-header-contents"/>  
        </header>
        
        {this.state.challenge === null ? (
          <div className="App-body"><Scoreboard/>
          <p>
          <button class="App-buttons" disabled={this.state.loadingChallenge} onClick={() => this.newChallenge() }>
              {this.state.loadingChallenge ? "...generating..." : "NEW CHALLENGE!"}
          </button>
          </p>
          </div>
        ) : (
          <div className="App-body">
            <Challenge challenge={this.state.challenge} onFinish={this.resetChallenge} />
          </div>
        )}
        
      </div>
    ) : (
      <div className="App">
        <header className="App-header">
          <p className="App-header-contents"><b>Amplify 101 - Learn math!</b></p>
        </header>
        <AmplifyAuthenticator 
            usernameAlias="email" 
            handleAuthStateChange={(state, data) => {
                console.log(state)
                console.log(data)
                this.setState({authState: state, user: data})
            }}>
        <AmplifySignUp
          slot="sign-up"
          usernameAlias="email"
          formFields={[
            {
              type: "email",
              required: true,
            },
            {
              type: "password",
              required: true,
            },
          ]} 
        />
        <AmplifySignIn slot="sign-in" usernameAlias="email" />
        </AmplifyAuthenticator>
        </div>
      )
    }
}

export default App;
