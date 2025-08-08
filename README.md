# Team members
| [@nkborba](https://github.com/nkborba) |
[@wgomes95](https://github.com/wgomes95) |
[@fsreibnitz](https://github.com/fsreibnitz) |
[@vanessalaves](https://www.linkedin.com/in/vandev) |
[@renatoalves](https://www.linkedin.com/in/renato-oliveira-alves44/) |

# E-commerce Login Management API

This project is a REST API for login management, blocking after failed attempts, and password recovery for an e-commerce platform. It is designed for software testing studies and uses in-memory storage (no database).

## Features
- User login (with blocking after 3 failed attempts)
- Password recovery (simulated)
- In-memory user storage
- JSON communication
- Swagger API documentation
- Mocha & Supertest tests

## Getting Started

### Install dependencies
On api folder
```
npm install
```

### Run the API
```
npm start
```
The server will start on [http://localhost:3000](http://localhost:3000).

### Run the Frontend
On frontend folder
```
npx serve -l 3001
```
Confirm the installation if necessary

```Need to install the following packages:
serve@14.2.4
Ok to proceed? (y) y
```
Access the browser [http://localhost:3001](http://localhost:3001)

### API Documentation
Swagger docs are available at:
```
http://localhost:3000/api-docs
```

### Install Cypress
On main folder
```
npm install
```

### Run E2E Tests with Cypress
```
npx cypress open
```

### Run APT Tests
```
npm test
```

## Endpoints
- `POST /api/login` — User login
- `POST /api/recover` — Password recovery

See Swagger docs for full details.

## Notes
- All data is stored in-memory and resets on server restart.
- This API is for testing and educational purposes only. 
