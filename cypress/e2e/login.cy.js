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
    cy.get('#forgotPasswordLink').click();
    cy.get('#recoveryEmail').type("alice@example.com");
    cy.get('#recoveryBtn').click();
    cy.get('#recoveryMessage').should('have.text', 'Recovery email sent! Account has been unblocked.');
  });
  it('should display user not found message when email does not exist', () => {
    cy.visit('login_page.html');
    cy.get('#forgotPasswordLink').click();
    cy.get('#recoveryEmail').type("notexistentuser@example.com");
    cy.get('#recoveryBtn').click();
    cy.get('#recoveryMessage').should('have.text', 'User not found');
  });
});

describe('API Test without UI', () => {
  const apiUrl = 'http://localhost:3000/api/login';

  it('should login with valid credentials', () => {
    cy.request({
      method: 'POST',
      url: apiUrl,
      body: {
        username: 'alice',
        password: 'password123',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).eq('Login successful');
    });
  });
});
