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
