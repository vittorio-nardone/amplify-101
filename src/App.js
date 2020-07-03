import React from 'react';
import logo from './logo.svg';
import './App.css';
import { AmplifyAuthenticator, AmplifySignOut, AmplifySignUp, AmplifySignIn } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import Scoreboard from './Scoreboard'

const App = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
        setAuthState(nextAuthState);
        setUser(authData)
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    
    <div className="App">
      <header className="App-header">
        <p className="App-header-contents"><b>Amplify 101 - Learn math!</b></p>
        <p><b>User:</b> {user.username}</p>
        <AmplifySignOut className="App-header-contents"/>  
      </header>

      <div className="App-body">
        <Scoreboard/>
      </div>
    </div>
  ) : (
    <div className="App">
      <header className="App-header">
        <p className="App-header-contents"><b>Amplify 101 - Learn math!</b></p>
      </header>
      <AmplifyAuthenticator usernameAlias="email">
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

export default App;
