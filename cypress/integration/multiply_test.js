
export const labels = {
    // Auth
    signInLabel: 'Sign In',
    signOutLabel: 'Sign Out',
    signInHeader: 'Sign in to your account',
    signInResetPassword: 'Reset password',
    signInCreateAccount: 'Create account',

    // Application 
    newChallenge: 'NEW CHALLENGE!',
    submitChallenge: 'SUBMIT',
    backToScoreboard: 'BACK',
    scoreboard: 'Your scoreboard',
    resultNoErrors: '0 error(s)',
    resetScoreboard: 'RESET SCOREBOARD',
    congratulations: 'Congratulation!',

    scoreboardTable : {
      tableOf: 'Table of',
      record: 'Record (sec)',
      errors: 'Errors',
      when: 'When'
    }
}

export const selectors = {
    // Auth component classes
    signInSlot: '[slot="sign-in"]',
    signInHeader: '[data-test="sign-in-header-section"]',
    signInResetPasswordLink: '[data-test="sign-in-forgot-password-link"]',
    signInCreateAccountLink: '[data-test="sign-in-create-account-link"]',
    signInEmailInput: '[data-test="sign-in-email-input"]',
    signInPasswordInput: '[data-test="sign-in-password-input"]',
    signInSignInButton: '[data-test="sign-in-sign-in-button"]',
    signOutButton: '[data-test="sign-out-button"]',
}

export const login = {
    username: Cypress.env('username'),
    password: Cypress.env('password')
} 

function SignIn() {
        // it is ok for the username to be visible in the Command Log
        expect(login.username, 'username was set').to.be.a('string').and.not.be.empty
        // but the password value should not be shown
        if (typeof login.password !== 'string' || !login.password) {
          throw new Error('Missing password value, set using CYPRESS_password=...')
        }

        cy.get(selectors.signInSlot)
          .find(selectors.signInEmailInput, { includeShadowDom: true })
          .type(login.username, {log: false, force: true});

        cy.get(selectors.signInSlot)
          .find(selectors.signInPasswordInput, { includeShadowDom: true })
          .type(login.password, {log: false, force: true});
 
        cy.get(selectors.signInSlot)
          .find(selectors.signInSignInButton, { includeShadowDom: true })
          .contains(labels.signInLabel)
          .click();
};

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

describe('Authenticator:', function() {
    // Step 1: setup the application state
    beforeEach(function() {
      cy.visit('/');
    });
    
    describe('Sign In', () => {
      it('check sign in page', () => {
        cy.get(selectors.signInSlot)
        .find(selectors.signInHeader, { includeShadowDom: true })
        .contains(labels.signInHeader)
        .should('be.visible');

      cy.get(selectors.signInSlot)
        .find(selectors.signInResetPasswordLink, { includeShadowDom: true })
        .contains(labels.signInResetPassword)
        .should('be.visible');

      cy.get(selectors.signInSlot)
        .find(selectors.signInCreateAccountLink, { includeShadowDom: true })
        .contains(labels.signInCreateAccount)
        .should('be.visible');

      cy.get(selectors.signInSlot)
        .find(selectors.signInEmailInput, { includeShadowDom: true })
        .should('be.visible')
        .should('be.enabled');

      cy.get(selectors.signInSlot)
        .find(selectors.signInPasswordInput, { includeShadowDom: true })
        .should('be.visible')
        .should('be.enabled');

      cy.get(selectors.signInSlot)
        .find(selectors.signInSignInButton, { includeShadowDom: true })
        .contains(labels.signInLabel)
        .should('be.visible');
      });

      it('allows a user to signin', () => {
        // Take an action (Sign in)
        SignIn();

        // Make an assertion (Check for sign-out text)
        cy.get(selectors.signOutButton, { includeShadowDom: true, timeout: 10000 })
            .contains(labels.signOutLabel)
            .should("be.visible");        
      });
    });

    describe('Sign Out', () => {
        it('allows a user to signout', () => {
          // Take an action (Sign in)
          SignIn();

          // Click on sign-out button
          cy.get(selectors.signOutButton, { includeShadowDom: true, timeout: 10000 })
            .contains(labels.signOutLabel)
            .click();
          
          // Make an assertion (Check for sign-in button)
          cy.get(selectors.signInSlot).find(selectors.signInSignInButton, { includeShadowDom: true })
            .contains(labels.signInLabel)
            .should("be.visible");
        });
      });
 
  });


  describe('Challenges:', function() {
    beforeEach(function() {
      cy.visit('/');
      SignIn();
      cy.get(selectors.signOutButton, { includeShadowDom: true, timeout: 10000 })
        .contains(labels.signOutLabel)
        .should("be.visible");        
    });

    describe('New Challenge', () => {
      it('start a new challenge', () => {
        cy.contains(labels.newChallenge).click();
        cy.contains(labels.submitChallenge).should("be.visible"); 
      });

      it('submit a new challenge', () => {
        cy.contains(labels.newChallenge).click();
        cy.contains(labels.submitChallenge).click();
        cy.contains(labels.backToScoreboard).should("be.visible");
      });     

      it('back to scoreboard', () => {
        cy.contains(labels.newChallenge).click();
        cy.contains(labels.submitChallenge).click();
        cy.contains(labels.backToScoreboard).click();
        cy.contains(labels.scoreboard).should("be.visible");
      });   

      it('fill a perfect challenge', () => {
        cy.contains(labels.newChallenge).click();
        cy.contains(labels.submitChallenge).should("be.visible");

        var i;
        for (i = 1; i < 11; i++) {
            cy.get('tbody > :nth-child(' + String(i) + ') > :nth-child(1) > b').then(setResult.bind(null, i)) 
        };
        
        cy.contains(labels.submitChallenge).click();
        cy.contains(labels.backToScoreboard).should("be.visible");
        cy.contains(labels.resultNoErrors).should("be.visible");;  
        
      });   

      it('fill a challenge with errors', () => {
        cy.contains(labels.newChallenge).click();
        cy.contains(labels.submitChallenge);

        var errors = Math.floor(Math.random() * 10) + 1;

        var i;
        for (i = 1; i < errors+1; i++) {
            cy.get('tbody > :nth-child(' + String(i) + ') > :nth-child(1) > b').then(setWrongResult.bind(null, i)) 
        };

        for (i = errors+1; i < 11; i++) {
            cy.get('tbody > :nth-child(' + String(i) + ') > :nth-child(1) > b').then(setResult.bind(null, i)) 
        };
        
        cy.contains(labels.submitChallenge).click();
        cy.contains(labels.backToScoreboard).should("be.visible");;
        cy.contains(String(errors) + ' error(s)').should("be.visible");;  
        
      });   
      
    });
 
  });

  describe('Scoreboard:', function() {

    // Setup the application state
    beforeEach(function() {
      cy.visit('/');
      SignIn();
      cy.get(selectors.signOutButton, { includeShadowDom: true, timeout: 10000 })
        .contains(labels.signOutLabel)
        .should("be.visible");   
    });

    describe('Check Scoreboard', () => {
      it('check if scoreboard is shown', () => {
        
        cy.contains(labels.scoreboardTable.tableOf).should("be.visible"); 
        cy.contains(labels.scoreboardTable.record).should("be.visible"); 
        cy.contains(labels.scoreboardTable.errors).should("be.visible");
        cy.contains(labels.scoreboardTable.when).should("be.visible");
      });

      it('check if reset scoreboard is shown', () => {
        cy.get('.ScoreTable').then(($table) => {
            if ($table.find('tr').length < 2) {
              cy.contains(labels.newChallenge).click();
              cy.contains(labels.submitChallenge).click();
              cy.contains(labels.backToScoreboard).click();
              cy.contains(labels.scoreboard);
            }
            cy.contains(labels.resetScoreboard)
            .should("be.visible");
        }) 
      });

      it('check if reset scoreboard is doing the right job', () => {
        cy.get('.ScoreTable').then(($table) => {
            if ($table.find('tr').length < 2) {
              cy.contains(labels.newChallenge).click();
              cy.contains(labels.submitChallenge).click();
              cy.contains(labels.backToScoreboard).click();
              cy.contains(labels.scoreboard);
            }  
           
            cy.contains(labels.resetScoreboard)
              .click()
              .then(() => {
                cy.wait(2000);
                cy.get('.ScoreTable').then(($table) => {
                  expect($table.find('tr').length).to.equal(1);
                }) 
                cy.contains(labels.resetScoreboard).should("not.exist");
              });
        }) 

      });

    });

  });

    describe('Results:', function() {

    // Setup the application state
    beforeEach(function() {
      cy.visit('/');
      SignIn();
      cy.get(selectors.signOutButton, { includeShadowDom: true, timeout: 10000 })
        .contains(labels.signOutLabel)
        .should("be.visible");   
    });

    describe('Check Results', () => {
      it('check if congratulations is shown', () => {
          cy.get('.ScoreTable').then(($table) => {
              if ($table.find('tr').length > 1) {
                cy.contains(labels.resetScoreboard)
                .click()
                .then(() => {
                  cy.wait(2000);
                });
              }
                
              cy.contains(labels.newChallenge).click();
              cy.contains(labels.submitChallenge).click();
              cy.contains(labels.congratulations);
          });
      });
    });
  });