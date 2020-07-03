import React from 'react';
import logo, { ReactComponent } from './logo.svg';
import './App.css';
import { AmplifyAuthenticator, AmplifySignOut, AmplifySignUp, AmplifySignIn } from '@aws-amplify/ui-react';
import Scoreboard from './Scoreboard'

import { getChallenge }  from './graphql/queries';
import { API, graphqlOperation } from "aws-amplify";

class App extends React.Component {
  
  constructor() {
    super();
    this.state = {
      authState: null,
      user: null,
      challenge: null
    }
  }

  async newChallenge() {
    const data = await API.graphql(graphqlOperation(getChallenge));
    console.log(data)
    this.setState({challenge: data.data.getChallenge})
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
          <button onClick={() => this.newChallenge()}>
              New Challenge!
          </button>
          </div>
        ) : (
          <div className="App-body">
          <p>ciao</p>
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
