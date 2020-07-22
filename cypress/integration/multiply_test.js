
export const selectors = {
    // Auth component classes
    signInSlot: '[slot="sign-in"]',
    signOutSlot: '[slot="sign-out"]',
    signInEmailInput: 'input[data-test="sign-in-email-input"]',
    signInPasswordInput: '[data-test="sign-in-password-input"]',
    signInSignInButton: '[data-test="sign-in-sign-in-button"]',
    signOutButton: '[data-test="sign-out-button"]',

    // Application 
    newChallenge: 'NEW CHALLENGE!',
    submitChallenge: 'SUBMIT',
    backToScoreboard: 'BACK',
    scoreboard: 'Your scoreboard'
 }

export const login = {
    username: Cypress.env('username'),
    password: Cypress.env('password')
} 

function SignIn() {
        

        cy.get(selectors.signInSlot)
          .find(selectors.signInEmailInput, { includeShadowDom: true })
          .type(login.username, {log: false, force: true});

        cy.get(selectors.signInSlot)
          .find(selectors.signInPasswordInput, { includeShadowDom: true })
          .type(login.password, {log: false, force: true});
 
        cy.get(selectors.signInSlot)
          .find(selectors.signInSignInButton, { includeShadowDom: true })
          .contains('Sign In')
          .click();

};

describe('Authenticator:', function() {
    // Step 1: setup the application state
    beforeEach(function() {
      cy.visit('/');
    });
    
    describe('Sign In:', () => {
      it('allows a user to signin', () => {
        // Step 2: Take an action (Sign in)
        SignIn();

        // Step 3: Make an assertion (Check for sign-out text)
        cy.get(selectors.signOutButton, { includeShadowDom: true, timeout: 10000 }).contains('Sign Out');        
      });
    });

    describe('Sign Out:', () => {
        it('allows a user to signout', () => {
          // Step 2: Take an action (Sign in)
          SignIn();

          // Step 3: Click on sign-out button
          cy.get(selectors.signOutButton, { includeShadowDom: true, timeout: 10000 }).contains('Sign Out').click();
          
          // Step 4: Make an assertion (Check for sign-in button)
          cy.get(selectors.signInSlot).find(selectors.signInSignInButton, { includeShadowDom: true }).contains('Sign In');
        });
      });
 
  });


  describe('Challenges:', function() {
    // Step 1: setup the application state
    beforeEach(function() {
      cy.visit('/');
      // Step 2: Take an action (Sign in)
      SignIn();

      // Step 3: Make an assertion (Check for sign-out text)
      cy.get(selectors.signOutButton, { includeShadowDom: true, timeout: 10000 }).contains('Sign Out');        

    });


    describe('New Challenge', () => {
      it('start a new challenge', () => {
        cy.contains(selectors.newChallenge).click();
        cy.contains(selectors.submitChallenge); 
      });

      it('submit a new challenge', () => {
        cy.contains(selectors.newChallenge).click();
        cy.contains(selectors.submitChallenge).click();
        cy.contains(selectors.backToScoreboard);
      });     

      it('back to scoreboard', () => {
        cy.contains(selectors.newChallenge).click();
        cy.contains(selectors.submitChallenge).click();
        cy.contains(selectors.backToScoreboard).click();
        cy.contains(selectors.scoreboard);
      });   

    function setResult(i, multiply) {
        var guess = multiply[0].textContent;
        var x = guess.indexOf("x");
        var a = guess.substr(0,2);
        var b = guess.substr(x+1,3);
        cy.get(':nth-child(' + String(i) + ') > :nth-child(2) > input').type(String(a*b));
    }

    function setWrongResult(i, multiply) {
        var guess = multiply[0].textContent;
        var x = guess.indexOf("x");
        var a = guess.substr(0,2);
        var b = guess.substr(x+1,3);
        cy.get(':nth-child(' + String(i) + ') > :nth-child(2) > input').type(String(a*b+1));
    }

      it('fill a perfect challenge', () => {
        cy.contains(selectors.newChallenge).click();
        cy.contains(selectors.submitChallenge);

        var i;
        for (i = 1; i < 11; i++) {
            cy.get('tbody > :nth-child(' + String(i) + ') > :nth-child(1) > b').then(setResult.bind(null, i)) 
        };
        
        cy.contains(selectors.submitChallenge).click();
        cy.contains(selectors.backToScoreboard);
        cy.contains('0 error(s)');  
        
      });   

      it('fill a challenge with errors', () => {
        cy.contains(selectors.newChallenge).click();
        cy.contains(selectors.submitChallenge);

        var errors = Math.floor(Math.random() * 10) + 1;

        var i;
        for (i = 1; i < errors+1; i++) {
            cy.get('tbody > :nth-child(' + String(i) + ') > :nth-child(1) > b').then(setWrongResult.bind(null, i)) 
        };

        for (i = errors+1; i < 11; i++) {
            cy.get('tbody > :nth-child(' + String(i) + ') > :nth-child(1) > b').then(setResult.bind(null, i)) 
        };
        
        cy.contains(selectors.submitChallenge).click();
        cy.contains(selectors.backToScoreboard);
        cy.contains(String(errors) + ' error(s)');  
        
      });   
      
    });
 
  });
  
  

  