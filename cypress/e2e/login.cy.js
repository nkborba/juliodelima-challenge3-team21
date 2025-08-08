describe('UI Test with API validation', () => {
  it('should login with valid credentials', () => {
    const userProfile = {
      username: 'alice',
      password: 'password123',
    };
    const welcomeMsg = 'Welcome back! You have successfully logged in.';
    cy.intercept('POST', 'api/login').as('login');
    cy.visit('login_page.html');
    cy.get('#username').type(userProfile.username);
    cy.get('#password').type(userProfile.password);
    cy.get('#loginBtn').click();
    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.message).eq('Login successful');
    });
    cy.contains(welcomeMsg).should('be.visible');
    cy.get('#dashboardUsername').should('have.text', userProfile.username);
    cy.contains('Active').should('be.visible');
  })
  it('should display an error message for invalid credentials', () => {
    const userProfile = {
      username: 'mockuser',
      password: 'wrongpassword',
    };
    const errorMsg = 'Invalid credentials';
    cy.intercept('POST', 'api/login', {statusCode: 401, body: {message: errorMsg}}).as('login');
    cy.visit('login_page.html');
    cy.get('#username').type(userProfile.username);
    cy.get('#password').type(userProfile.password);
    cy.get('#loginBtn').click();
    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(401);
      expect(response.body.message).eq(errorMsg);
    });
    cy.contains(errorMsg).should('be.visible');
  })
  it('should block account after 3 failed attempts', () => {
    const userProfile = {
      username: 'alice',
      password: 'wrongpassword',
    };
    const errorMsg = 'Account blocked after 3 failed attempts. Please use password recovery to unblock your account.';
    cy.intercept('POST', 'api/login').as('login');
    cy.visit('login_page.html');
    cy.get('#username').type(userProfile.username);
    cy.get('#password').type(userProfile.password);
    Cypress._.times(3, () => {
      cy.get('#loginBtn').click();
      cy.wait('@login').then(({ response }) => {
        expect(response.statusCode).to.eq(401);
      });
    });
    cy.get('#message').should('have.text', errorMsg);
  })
  it('should send password recovery email', () => {
    cy.visit('login_page.html');
    cy.intercept('POST', 'api/recover').as('recover');
    cy.get('#forgotPasswordLink').click();
    cy.get('#recoveryEmail').type("alice@example.com");
    cy.get('#recoveryBtn').click();
    cy.wait('@recover').then(({ response }) => { expect(response.statusCode).to.eq(200); });
    cy.get('#recoveryMessage').should('have.text', 'Recovery email sent! Account has been unblocked.');
  });
  it('should display user not found message when email does not exist', () => {
    cy.visit('login_page.html');
    cy.intercept('POST', 'api/recover').as('recover');
    cy.get('#forgotPasswordLink').click();
    cy.get('#recoveryEmail').type("notexistentuser@example.com");
    cy.get('#recoveryBtn').click();
    cy.wait('@recover').then(({ response }) => { expect(response.statusCode).to.eq(404); });
    cy.get('#recoveryMessage').should('have.text', 'User not found');
  });
});

describe('API Test without UI', () => {
  const apiBaseUrl = 'http://localhost:3000';

  it('should login with valid credentials', () => {
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/api/login`,
      body: {
        username: 'alice',
        password: 'password123',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).eq('Login successful');
    });
  });
  it('should return 401 for invalid credentials', () => {
    const errorMsg = 'Invalid credentials';
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/api/login`,
      body: {
        username: 'notexistentuser',
        password: 'wrongpassword',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).eq(errorMsg);
    });
  });
  it('should block account after 3 failed attempts', () => {
    const errorMsg = 'Account blocked after 3 failed attempts';
    Cypress._.times(4, (times) => {
      cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/api/login`,
      body: {
        username: 'alice',
        password: 'wrongpassword',
        
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (times === 3) {
        expect(response.status).to.eq(401);
        expect(response.body.message).eq(errorMsg);
      };
    });
    });
  });
  it('should send password recovery email', () => {
   const userEmail = 'alice@example.com';
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/api/recover`,
      body: {
        email: userEmail,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).eq(`Password recovery instructions sent to ${userEmail}`);
    });
  });
    it('should display user not found message when email does not exist', () => {
    const userEmail = 'notexistentuser@example.com';
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/api/recover`,
      body: {
        email: userEmail,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body.message).eq('User not found');
    });
  });
});
